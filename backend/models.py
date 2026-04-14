import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = 'users'
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=False, default='')
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    expertise = Column(Text, nullable=True)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    requirements = relationship('Requirement', back_populates='student', cascade='all, delete-orphan')
    wallet = relationship('Wallet', back_populates='user', uselist=False, cascade='all, delete-orphan')
    connections = relationship('Connection', back_populates='teacher', cascade='all, delete-orphan')
    transactions = relationship('Transaction', back_populates='user', cascade='all, delete-orphan')


class Requirement(Base):
    __tablename__ = 'requirements'
    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    subject = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    budget = Column(Float, nullable=False)

    student = relationship('User', back_populates='requirements')
    preferred_time = Column(String(255), nullable=False)
    preferred_language = Column(String(50), nullable=False, default='Hindi')
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    connections = relationship('Connection', back_populates='requirement', cascade='all, delete-orphan')


class Connection(Base):
    __tablename__ = 'connections'
    id = Column(String(36), primary_key=True, default=generate_uuid)
    teacher_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    requirement_id = Column(String(36), ForeignKey('requirements.id', ondelete='CASCADE'), nullable=False, index=True)
    credits_used = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint('teacher_id', 'requirement_id', name='uq_teacher_requirement'),
    )

    teacher = relationship('User', back_populates='connections')
    requirement = relationship('Requirement', back_populates='connections')


class Wallet(Base):
    __tablename__ = 'wallets'
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False, index=True)
    balance = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship('User', back_populates='wallet')


class Transaction(Base):
    __tablename__ = 'transactions'
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    type = Column(String(20), nullable=False)
    amount = Column(Integer, nullable=False)
    description = Column(String(500))
    status = Column(String(20), default='pending')
    razorpay_payment_id = Column(String(255))
    razorpay_order_id = Column(String(255))
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship('User', back_populates='transactions')


class CreditPlan(Base):
    __tablename__ = 'credit_plans'
    plan_id = Column(Integer, primary_key=True)
    price_inr = Column(Integer, nullable=False)
    credits = Column(Integer, nullable=False)
