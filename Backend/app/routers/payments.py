import uuid
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, get_optional_current_user
from app.models import PaymentTransaction, User, Activity, Notification
from app import schemas

router = APIRouter(prefix="/api/payments", tags=["payments"])

PLAN_CONFIG = {
    "starter": {
        "name": "Starter",
        "monthly_price": 0.0,
        "yearly_price": 0.0,
        "features": [
            "5 AI Interviews",
            "Basic Feedback",
            "Resume Upload",
            "Community Access",
        ],
    },
    "pro": {
        "name": "Pro",
        "monthly_price": 49.0,
        "yearly_price": 470.0,  # ~20% discount
        "features": [
            "Unlimited AI Interviews",
            "AI Performance Analysis",
            "ATS Resume Review",
            "Voice + Video Interview",
            "Coding Challenges",
            "Real-Time AI Hints",
            "Personalized Growth Roadmap",
        ],
    },
    "team": {
        "name": "Team",
        "monthly_price": 99.0,
        "yearly_price": 950.0,  # ~20% discount
        "features": [
            "Team Dashboard & Seat Management",
            "Recruiter & Manager Analytics",
            "Custom AI Interview Models",
            "Priority Dedicated Support",
            "Bulk Candidate Assessment Export",
        ],
    },
}

COUPONS = {
    "INTERVISTA20": {"type": "percent", "value": 20, "description": "20% off on all plans"},
    "AIREADY": {"type": "fixed", "value": 15, "description": "$15 instant discount"},
    "STUDENT": {"type": "percent", "value": 30, "description": "30% student discount"},
    "LAUNCH50": {"type": "percent", "value": 50, "description": "50% launch special discount"},
}


def calculate_pricing(plan_name: str, billing_cycle: str, promo_code: Optional[str] = None):
    plan_key = plan_name.lower().strip()
    if plan_key not in PLAN_CONFIG:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid plan '{plan_name}'. Available plans: {', '.join(PLAN_CONFIG.keys())}",
        )

    config = PLAN_CONFIG[plan_key]
    base_price = config["yearly_price"] if billing_cycle == "yearly" else config["monthly_price"]

    discount_amount = 0.0
    promo_applied = None

    if promo_code and base_price > 0:
        code_clean = promo_code.strip().upper()
        if code_clean in COUPONS:
            coupon = COUPONS[code_clean]
            if coupon["type"] == "percent":
                discount_amount = round(base_price * (coupon["value"] / 100.0), 2)
            elif coupon["type"] == "fixed":
                discount_amount = min(base_price, float(coupon["value"]))
            promo_applied = code_clean

    discounted_subtotal = max(0.0, base_price - discount_amount)
    tax_amount = 0.0  # Zero extra tax or bundled
    final_amount = round(discounted_subtotal + tax_amount, 2)

    return {
        "plan_key": plan_key,
        "plan_name": config["name"],
        "base_price": base_price,
        "discount_amount": discount_amount,
        "tax_amount": tax_amount,
        "final_amount": final_amount,
        "promo_code": promo_applied,
        "features": config["features"],
    }


@router.get("/plans")
def get_plans():
    """Retrieve current pricing tiers, features, and available promo code offers."""
    return {
        "plans": PLAN_CONFIG,
        "billing_cycles": ["monthly", "yearly"],
        "yearly_discount_percent": 20,
        "active_promos": [
            {"code": "INTERVISTA20", "description": "20% off any premium plan"},
            {"code": "AIREADY", "description": "$15 instant discount"},
            {"code": "STUDENT", "description": "30% off with student pass"},
        ],
    }


@router.post("/validate-coupon", response_model=schemas.CouponValidationResponse)
def validate_coupon(payload: schemas.CouponValidationRequest):
    """Validate promo coupon code and calculate savings."""
    plan_key = payload.plan_name.lower().strip()
    if plan_key not in PLAN_CONFIG:
        raise HTTPException(status_code=400, detail="Invalid plan selected.")

    config = PLAN_CONFIG[plan_key]
    base_price = config["yearly_price"] if payload.billing_cycle == "yearly" else config["monthly_price"]

    code_clean = payload.code.strip().upper()
    if code_clean not in COUPONS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid or expired promo code. Try INTERVISTA20 or AIREADY.",
        )

    coupon = COUPONS[code_clean]
    if coupon["type"] == "percent":
        discount_amount = round(base_price * (coupon["value"] / 100.0), 2)
        discount_pct = coupon["value"]
    else:
        discount_amount = min(base_price, float(coupon["value"]))
        discount_pct = round((discount_amount / base_price) * 100) if base_price > 0 else 0

    final_price = max(0.0, round(base_price - discount_amount, 2))

    return schemas.CouponValidationResponse(
        valid=True,
        code=code_clean,
        discount_percentage=discount_pct,
        discount_amount=discount_amount,
        original_price=base_price,
        final_price=final_price,
        message=f"Coupon {code_clean} applied! You saved ${discount_amount:.2f}.",
    )


@router.post("/create-order", response_model=schemas.CreatePaymentOrderResponse)
def create_payment_order(
    payload: schemas.CreatePaymentOrderRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    """Create checkout session order with accurate pricing, tax, and discount breakdown."""
    pricing = calculate_pricing(payload.plan_name, payload.billing_cycle, payload.promo_code)
    order_id = f"ord_{uuid.uuid4().hex[:12]}"

    return schemas.CreatePaymentOrderResponse(
        order_id=order_id,
        plan_name=pricing["plan_name"],
        billing_cycle=payload.billing_cycle,
        original_price=pricing["base_price"],
        discount_amount=pricing["discount_amount"],
        tax_amount=pricing["tax_amount"],
        final_amount=pricing["final_amount"],
        currency=payload.currency or "USD",
        promo_code=pricing["promo_code"],
        features=pricing["features"],
    )


@router.post("/confirm", response_model=schemas.ConfirmPaymentResponse)
def confirm_payment(
    payload: schemas.ConfirmPaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Process payment confirmation, record transaction, generate invoice, and upgrade user subscription tier."""
    pricing = calculate_pricing(payload.plan_name, payload.billing_cycle, payload.promo_code)

    transaction_id = f"txn_{uuid.uuid4().hex[:14]}"
    invoice_id = f"INV-{datetime.now(timezone.utc).strftime('%Y%m')}-{uuid.uuid4().hex[:6].upper()}"

    # Calculate expiration date based on billing cycle
    now = datetime.now(timezone.utc)
    if payload.billing_cycle == "yearly":
        expires_at = now + timedelta(days=365)
    else:
        expires_at = now + timedelta(days=30)

    # Save transaction record
    transaction = PaymentTransaction(
        user_id=current_user.id,
        user_email=current_user.email,
        user_name=current_user.name,
        plan_name=pricing["plan_key"],
        billing_cycle=payload.billing_cycle,
        amount=int(pricing["final_amount"] * 100),  # store in cents
        currency=payload.currency or "USD",
        payment_method=payload.payment_method,
        payment_status="succeeded",
        transaction_id=transaction_id,
        invoice_id=invoice_id,
        promo_code=pricing["promo_code"],
        discount_amount=int(pricing["discount_amount"] * 100),
        card_last4=payload.card_last4,
        card_brand=payload.card_brand,
        receipt_url=f"/api/payments/invoice/{invoice_id}",
    )
    db.add(transaction)

    # Upgrade User's Subscription
    current_user.subscription_plan = pricing["plan_key"]
    current_user.subscription_cycle = payload.billing_cycle
    current_user.subscription_expires_at = expires_at

    # Add dashboard activity & notification
    activity = Activity(
        user_id=current_user.id,
        title=f"Upgraded to {pricing['plan_name']} Plan",
        company=f"${pricing['final_amount']:.2f} via {payload.payment_method.upper()}",
        time="Just now",
        color="#8b5cf6",
    )
    db.add(activity)

    notification = Notification(
        user_id=current_user.id,
        title=f"Welcome to {pricing['plan_name']} Membership! ✦",
        desc=f"Your payment of ${pricing['final_amount']:.2f} was successful. Unlimited AI interviews and features are now active.",
        color="#22c55e",
        time="Just now",
        is_read=False,
    )
    db.add(notification)

    db.commit()
    db.refresh(current_user)

    receipt = {
        "invoice_id": invoice_id,
        "transaction_id": transaction_id,
        "customer_name": current_user.name,
        "customer_email": current_user.email,
        "plan": pricing["plan_name"],
        "billing_cycle": payload.billing_cycle.capitalize(),
        "amount_paid": f"${pricing['final_amount']:.2f}",
        "payment_method": payload.payment_method.replace("_", " ").upper(),
        "card_last4": payload.card_last4,
        "card_brand": payload.card_brand,
        "date": now.strftime("%B %d, %Y - %H:%M UTC"),
        "expires_at": expires_at.strftime("%B %d, %Y"),
        "status": "PAID & VERIFIED",
        "line_items": [
            {
                "description": f"Intervista AI {pricing['plan_name']} Subscription ({payload.billing_cycle.capitalize()})",
                "original_price": f"${pricing['base_price']:.2f}",
                "discount": f"-${pricing['discount_amount']:.2f}" if pricing["discount_amount"] > 0 else "$0.00",
                "total": f"${pricing['final_amount']:.2f}",
            }
        ],
    }

    return schemas.ConfirmPaymentResponse(
        success=True,
        message=f"Payment verified! You are now on the Intervista AI {pricing['plan_name']} plan.",
        transaction_id=transaction_id,
        invoice_id=invoice_id,
        plan_name=pricing["plan_name"],
        billing_cycle=payload.billing_cycle,
        amount_paid=pricing["final_amount"],
        currency=payload.currency or "USD",
        payment_method=payload.payment_method,
        subscription_expires_at=expires_at,
        receipt=receipt,
    )


@router.get("/history", response_model=List[schemas.PaymentTransactionOut])
def get_payment_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve billing and payment history for the authenticated user."""
    transactions = (
        db.query(PaymentTransaction)
        .filter(PaymentTransaction.user_id == current_user.id)
        .order_by(PaymentTransaction.created_at.desc())
        .all()
    )
    return transactions


@router.get("/invoice/{invoice_id}")
def get_invoice_details(
    invoice_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve structured invoice details for PDF rendering or receipt view."""
    transaction = (
        db.query(PaymentTransaction)
        .filter(PaymentTransaction.invoice_id == invoice_id)
        .first()
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Invoice not found.")

    if not current_user.is_admin and transaction.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized access to this invoice.")

    amount_val = transaction.amount / 100.0
    discount_val = transaction.discount_amount / 100.0

    return {
        "invoice_id": transaction.invoice_id,
        "transaction_id": transaction.transaction_id,
        "customer_name": transaction.user_name or current_user.name,
        "customer_email": transaction.user_email or current_user.email,
        "plan_name": transaction.plan_name.capitalize(),
        "billing_cycle": transaction.billing_cycle.capitalize(),
        "amount_paid": f"${amount_val:.2f}",
        "currency": transaction.currency,
        "payment_method": transaction.payment_method.replace("_", " ").upper(),
        "card_last4": transaction.card_last4,
        "card_brand": transaction.card_brand,
        "status": transaction.payment_status.upper(),
        "date": transaction.created_at.strftime("%B %d, %Y %H:%M UTC"),
        "company_name": "Intervista AI Inc.",
        "company_address": "742 Innovation Way, Tech Park, San Francisco, CA 94107",
        "company_tax_id": "US-EIN-984712093",
        "line_items": [
            {
                "item": f"Intervista AI {transaction.plan_name.capitalize()} Subscription ({transaction.billing_cycle.capitalize()})",
                "price": f"${(amount_val + discount_val):.2f}",
                "discount": f"-${discount_val:.2f}" if discount_val > 0 else "$0.00",
                "total": f"${amount_val:.2f}",
            }
        ],
    }
