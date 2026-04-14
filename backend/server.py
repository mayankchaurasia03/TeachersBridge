from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
import os
import logging
import bcrypt
import jwt
import razorpay
import hmac
import hashlib
from pathlib import Path
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from database import get_db
from models import User, Requirement, Connection, Wallet, Transaction, CreditPlan

# Config
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', '')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', '')

razorpay_client = None
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# --- Pydantic Schemas ---
class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    role: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RequirementCreate(BaseModel):
    subject: str
    description: str
    budget: float
    preferred_time: str
    preferred_language: str = 'Hindi'

class PurchasePlanRequest(BaseModel):
    plan_id: int

class VerifyPaymentRequest(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str
    transaction_id: str

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    expertise: Optional[str] = None
    bio: Optional[str] = None


# --- Auth Helpers ---
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request, db: AsyncSession = Depends(get_db)) -> dict:
    token = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        result = await db.execute(select(User).where(User.id == payload["sub"]))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {"id": user.id, "name": user.name, "email": user.email, "phone": user.phone, "role": user.role, "expertise": user.expertise, "bio": user.bio}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def user_to_dict(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "expertise": user.expertise,
        "bio": user.bio,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }


def get_credit_cost(budget: float) -> int:
    if budget >= 3500:
        return 3
    elif budget >= 2000:
        return 2
    return 1


# --- Auth Endpoints ---
@api_router.post("/signup")
async def signup(req: SignupRequest, db: AsyncSession = Depends(get_db)):
    if req.role not in ("student", "teacher"):
        raise HTTPException(status_code=400, detail="Role must be 'student' or 'teacher'")
    existing = await db.execute(select(User).where(User.email == req.email.lower()))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        name=req.name,
        email=req.email.lower(),
        phone=req.phone,
        password_hash=hash_password(req.password),
        role=req.role
    )
    db.add(user)
    await db.flush()
    wallet = Wallet(user_id=user.id, balance=0)
    db.add(wallet)
    await db.commit()
    await db.refresh(user)
    token = create_access_token(user.id, user.email, user.role)
    return {"token": token, "user": user_to_dict(user)}


@api_router.post("/login")
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == req.email.lower()))
    user = result.scalar_one_or_none()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user.id, user.email, user.role)
    return {"token": token, "user": user_to_dict(user)}


@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user


# --- Student Endpoints ---
@api_router.post("/requirements")
async def create_requirement(req: RequirementCreate, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can post requirements")
    requirement = Requirement(
        student_id=current_user["id"],
        subject=req.subject,
        description=req.description,
        budget=req.budget,
        preferred_time=req.preferred_time,
        preferred_language=req.preferred_language
    )
    db.add(requirement)
    await db.commit()
    await db.refresh(requirement)
    return {
        "id": requirement.id,
        "student_id": requirement.student_id,
        "subject": requirement.subject,
        "description": requirement.description,
        "budget": requirement.budget,
        "preferred_time": requirement.preferred_time,
        "preferred_language": requirement.preferred_language,
        "created_at": requirement.created_at.isoformat() if requirement.created_at else None
    }


@api_router.get("/requirements/my")
async def get_my_requirements(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can view their requirements")
    result = await db.execute(
        select(Requirement)
        .options(selectinload(Requirement.connections).selectinload(Connection.teacher))
        .where(Requirement.student_id == current_user["id"])
        .order_by(Requirement.created_at.desc())
    )
    requirements = result.scalars().all()
    data = []
    for r in requirements:
        conns = []
        for c in r.connections:
            conns.append({
                "id": c.id,
                "teacher_id": c.teacher.id if c.teacher else None,
                "teacher_name": c.teacher.name if c.teacher else None,
                "teacher_email": c.teacher.email if c.teacher else None,
                "teacher_phone": c.teacher.phone if c.teacher else None,
                "created_at": c.created_at.isoformat() if c.created_at else None
            })
        data.append({
            "id": r.id,
            "subject": r.subject,
            "description": r.description,
            "budget": r.budget,
            "preferred_time": r.preferred_time,
            "preferred_language": r.preferred_language,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "connections": conns
        })
    return data


# --- Teacher Endpoints ---
@api_router.get("/requirements")
async def get_all_requirements(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    subject: Optional[str] = None,
    budget_min: Optional[float] = None,
    budget_max: Optional[float] = None,
):
    if current_user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can browse requirements")
    query = select(Requirement).options(selectinload(Requirement.student), selectinload(Requirement.connections))
    if subject:
        query = query.where(Requirement.subject.ilike(f"%{subject}%"))
    if budget_min is not None:
        query = query.where(Requirement.budget >= budget_min)
    if budget_max is not None:
        query = query.where(Requirement.budget <= budget_max)
    query = query.order_by(Requirement.created_at.desc())
    result = await db.execute(query)
    requirements = result.scalars().all()
    data = []
    for r in requirements:
        already_connected = any(c.teacher_id == current_user["id"] for c in r.connections)
        data.append({
            "id": r.id,
            "student_name": r.student.name if r.student else None,
            "student_email": r.student.email if already_connected and r.student else None,
            "student_phone": r.student.phone if already_connected and r.student else None,
            "subject": r.subject,
            "description": r.description,
            "budget": r.budget,
            "preferred_time": r.preferred_time,
            "preferred_language": r.preferred_language,
            "credit_cost": get_credit_cost(r.budget),
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "already_connected": already_connected,
            "total_connections": len(r.connections)
        })
    return data


@api_router.get("/subjects")
async def get_subjects(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can access subjects")
    result = await db.execute(select(Requirement.subject).distinct().order_by(Requirement.subject))
    subjects = [row[0] for row in result.all()]
    return subjects


@api_router.post("/connect/{requirement_id}")
async def connect_with_student(requirement_id: str, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can connect")
    # Check requirement exists
    req_result = await db.execute(select(Requirement).options(selectinload(Requirement.student)).where(Requirement.id == requirement_id))
    requirement = req_result.scalar_one_or_none()
    if not requirement:
        raise HTTPException(status_code=404, detail="Requirement not found")
    # Check not already connected
    conn_result = await db.execute(
        select(Connection).where(Connection.teacher_id == current_user["id"], Connection.requirement_id == requirement_id)
    )
    if conn_result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already connected to this requirement")
    # Check wallet balance
    wallet_result = await db.execute(select(Wallet).where(Wallet.user_id == current_user["id"]))
    wallet = wallet_result.scalar_one_or_none()
    credit_cost = get_credit_cost(requirement.budget)
    if not wallet or wallet.balance < credit_cost:
        raise HTTPException(status_code=400, detail=f"Insufficient credits. This connection costs {credit_cost} credit(s). Please purchase more credits.")
    # Deduct credits
    wallet.balance -= credit_cost
    wallet.updated_at = datetime.now(timezone.utc)
    # Create connection
    connection = Connection(teacher_id=current_user["id"], requirement_id=requirement_id, credits_used=credit_cost)
    db.add(connection)
    # Log transaction
    txn = Transaction(
        user_id=current_user["id"],
        type="debit",
        amount=credit_cost,
        description=f"Connected with student for: {requirement.subject} ({credit_cost} credits)",
        status="success"
    )
    db.add(txn)
    await db.commit()
    return {
        "message": "Connected successfully!",
        "student_name": requirement.student.name if requirement.student else None,
        "student_email": requirement.student.email if requirement.student else None,
        "student_phone": requirement.student.phone if requirement.student else None,
        "credits_remaining": wallet.balance
    }


# --- Profile Endpoints ---
@api_router.get("/profile/{user_id}")
async def get_profile(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    profile = {
        "id": user.id,
        "name": user.name,
        "role": user.role,
        "expertise": user.expertise,
        "bio": user.bio,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }
    if user.role == "teacher":
        conn_result = await db.execute(select(Connection).where(Connection.teacher_id == user.id))
        profile["total_connections"] = len(conn_result.scalars().all())
    return profile


@api_router.put("/profile")
async def update_profile(req: ProfileUpdateRequest, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == current_user["id"]))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if req.name is not None:
        user.name = req.name
    if req.phone is not None:
        user.phone = req.phone
    if req.expertise is not None:
        user.expertise = req.expertise
    if req.bio is not None:
        user.bio = req.bio
    await db.commit()
    await db.refresh(user)
    return user_to_dict(user)


# --- Wallet Endpoints ---
@api_router.get("/wallet")
async def get_wallet(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    wallet_result = await db.execute(select(Wallet).where(Wallet.user_id == current_user["id"]))
    wallet = wallet_result.scalar_one_or_none()
    if not wallet:
        wallet = Wallet(user_id=current_user["id"], balance=0)
        db.add(wallet)
        await db.commit()
        await db.refresh(wallet)
    # Get recent transactions
    txn_result = await db.execute(
        select(Transaction).where(Transaction.user_id == current_user["id"]).order_by(Transaction.created_at.desc()).limit(20)
    )
    transactions = txn_result.scalars().all()
    return {
        "balance": wallet.balance,
        "transactions": [
            {
                "id": t.id,
                "type": t.type,
                "amount": t.amount,
                "description": t.description,
                "status": t.status,
                "created_at": t.created_at.isoformat() if t.created_at else None
            } for t in transactions
        ]
    }


@api_router.get("/credit-plans")
async def get_credit_plans(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CreditPlan).order_by(CreditPlan.plan_id))
    plans = result.scalars().all()
    return [{"plan_id": p.plan_id, "price_inr": p.price_inr, "credits": p.credits} for p in plans]


@api_router.post("/create-order")
async def create_order(req: PurchasePlanRequest, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not razorpay_client:
        raise HTTPException(status_code=500, detail="Payment service unavailable")
    plan_result = await db.execute(select(CreditPlan).where(CreditPlan.plan_id == req.plan_id))
    plan = plan_result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    # Create Razorpay order
    order_data = {
        "amount": plan.price_inr * 100,
        "currency": "INR",
        "payment_capture": 1,
        "notes": {
            "plan_id": str(plan.plan_id),
            "user_id": current_user["id"],
            "credits": str(plan.credits)
        }
    }
    order = razorpay_client.order.create(data=order_data)
    # Create pending transaction
    txn = Transaction(
        user_id=current_user["id"],
        type="credit",
        amount=plan.credits,
        description=f"Purchase {plan.credits} credits for Rs.{plan.price_inr}",
        status="pending",
        razorpay_order_id=order["id"]
    )
    db.add(txn)
    await db.commit()
    await db.refresh(txn)
    return {
        "order_id": order["id"],
        "amount": order["amount"],
        "currency": order["currency"],
        "transaction_id": txn.id,
        "key_id": RAZORPAY_KEY_ID
    }


@api_router.post("/verify-payment")
async def verify_payment(req: VerifyPaymentRequest, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Verify signature
    txn_result = await db.execute(select(Transaction).where(Transaction.id == req.transaction_id))
    txn = txn_result.scalar_one_or_none()
    if not txn or txn.user_id != current_user["id"]:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if txn.status == "success":
        raise HTTPException(status_code=400, detail="Payment already verified")
    # Verify Razorpay signature
    try:
        message = f"{req.razorpay_order_id}|{req.razorpay_payment_id}"
        generated_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode("utf-8"),
            message.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()
        if generated_signature != req.razorpay_signature:
            txn.status = "failed"
            await db.commit()
            raise HTTPException(status_code=400, detail="Payment verification failed")
    except HTTPException:
        raise
    except Exception:
        txn.status = "failed"
        await db.commit()
        raise HTTPException(status_code=400, detail="Payment verification failed")
    # Update transaction
    txn.status = "success"
    txn.razorpay_payment_id = req.razorpay_payment_id
    # Add credits to wallet
    wallet_result = await db.execute(select(Wallet).where(Wallet.user_id == current_user["id"]))
    wallet = wallet_result.scalar_one_or_none()
    if wallet:
        wallet.balance += txn.amount
        wallet.updated_at = datetime.now(timezone.utc)
    else:
        wallet = Wallet(user_id=current_user["id"], balance=txn.amount)
        db.add(wallet)
    await db.commit()
    return {"message": "Payment verified successfully!", "credits_added": txn.amount, "new_balance": wallet.balance}


# --- Seed Credit Plans ---
@app.on_event("startup")
async def seed_credit_plans():
    from database import AsyncSessionLocal
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(CreditPlan))
        existing = result.scalars().all()
        if not existing:
            plans = [
                CreditPlan(plan_id=1, price_inr=49, credits=3),
                CreditPlan(plan_id=2, price_inr=99, credits=7),
                CreditPlan(plan_id=3, price_inr=149, credits=11),
            ]
            db.add_all(plans)
            await db.commit()
            logger.info("Credit plans seeded successfully")
        else:
            logger.info("Credit plans already exist")


@api_router.get("/")
async def root():
    return {"message": "TeacherBridge API is running"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
