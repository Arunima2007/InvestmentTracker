import os
import joblib
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "investment_model.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "models", "label_encoder.pkl")

model = joblib.load(MODEL_PATH)
label_encoder = joblib.load(ENCODER_PATH)


def compute_features(data):
    monthly_income = data["monthly_income"]
    monthly_expenses = data["monthly_expenses"]
    current_savings = data["current_savings"]
    monthly_sip = data["monthly_sip"]
    financial_goal = data["financial_goal"]
    time_horizon_years = data["time_horizon_years"]
    risk_profile = data["risk_profile"]
    income_stability = data["income_stability"]

    savings_ratio = current_savings / monthly_income if monthly_income > 0 else 0
    expense_ratio = monthly_expenses / monthly_income if monthly_income > 0 else 0
    disposable_income = monthly_income - monthly_expenses
    sip_ratio = monthly_sip / monthly_income if monthly_income > 0 else 0
    financial_buffer = current_savings / monthly_expenses if monthly_expenses > 0 else 0
    goal_pressure = financial_goal / (time_horizon_years * 12) if time_horizon_years > 0 else 0
    surplus_after_sip = monthly_income - monthly_expenses - monthly_sip
    goal_feasibility_ratio = monthly_sip / goal_pressure if goal_pressure > 0 else 0
    investment_capacity_ratio = monthly_sip / disposable_income if disposable_income > 0 else 0
    savings_to_goal_ratio = current_savings / financial_goal if financial_goal > 0 else 0
    liquidity_stress = (monthly_expenses + monthly_sip) / monthly_income if monthly_income > 0 else 0

    feature_vector = [[
        monthly_income,
        monthly_expenses,
        current_savings,
        monthly_sip,
        financial_goal,
        time_horizon_years,
        risk_profile,
        income_stability,
        savings_ratio,
        expense_ratio,
        disposable_income,
        sip_ratio,
        financial_buffer,
        goal_pressure,
        surplus_after_sip,
        goal_feasibility_ratio,
        investment_capacity_ratio,
        savings_to_goal_ratio,
        liquidity_stress
    ]]

    derived_metrics = {
        "savings_ratio": savings_ratio,
        "expense_ratio": expense_ratio,
        "disposable_income": disposable_income,
        "sip_ratio": sip_ratio,
        "financial_buffer": financial_buffer,
        "goal_pressure": goal_pressure,
        "surplus_after_sip": surplus_after_sip,
        "goal_feasibility_ratio": goal_feasibility_ratio,
        "investment_capacity_ratio": investment_capacity_ratio,
        "savings_to_goal_ratio": savings_to_goal_ratio,
        "liquidity_stress": liquidity_stress
    }

    return feature_vector, derived_metrics


def predict_investment_type(data):
    features, derived_metrics = compute_features(data)

    feature_array = np.array(features)

    pred_encoded = model.predict(feature_array)[0]
    pred_label = label_encoder.inverse_transform([pred_encoded])[0]

    confidence = None
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(feature_array)[0]
        confidence = float(np.max(probs))

    return pred_label, derived_metrics, confidence


def generate_allocation(predicted_type):
    allocation_map = {
        "Conservative": {
            "Bonds": 40,
            "Fixed Income": 40,
            "Equity": 20
        },
        "Balanced": {
            "Equity": 40,
            "Bonds": 30,
            "Mutual Funds": 30
        },
        "Growth": {
            "Equity": 60,
            "Mutual Funds": 25,
            "Bonds": 15
        },
        "Aggressive": {
            "Equity": 75,
            "High Growth Funds": 15,
            "Bonds": 10
        }
    }
    return allocation_map[predicted_type]


def estimate_annual_return(predicted_type):
    returns_map = {
        "Conservative": 0.07,
        "Balanced": 0.10,
        "Growth": 0.12,
        "Aggressive": 0.14
    }
    return returns_map[predicted_type]
def generate_top_factors(data, derived_metrics):
    factors = []

    if derived_metrics["disposable_income"] > 30000:
        factors.append("High disposable income")

    if data["time_horizon_years"] >= 10:
        factors.append("Long investment horizon")

    if derived_metrics["financial_buffer"] > 6:
        factors.append("Strong financial buffer")

    if derived_metrics["savings_to_goal_ratio"] > 0.15:
        factors.append("Healthy savings relative to goal")

    if data["income_stability"] == 2:
        factors.append("Stable income profile")

    if derived_metrics["goal_feasibility_ratio"] < 0.5:
        factors.append("High goal pressure")

    return factors[:3]
def build_context(data, derived_metrics):
    context = {}

    if derived_metrics["goal_feasibility_ratio"] < 0.5:
        context["goal_pressure"] = "high"
    else:
        context["goal_pressure"] = "normal"

    if derived_metrics["financial_buffer"] < 3:
        context["liquidity_risk"] = "high"
    else:
        context["liquidity_risk"] = "normal"

    if data["risk_profile"] == 2 and derived_metrics["financial_buffer"] < 4:
        context["risk_mismatch"] = True
    else:
        context["risk_mismatch"] = False

    return context
def adjust_recommendation(predicted_type, context):
    order = ["Conservative", "Balanced", "Growth", "Aggressive"]
    idx = order.index(predicted_type)

    if context.get("liquidity_risk") == "high" and idx > 0:
        idx -= 1

    if context.get("risk_mismatch") and idx > 0:
        idx -= 1

    if context.get("goal_pressure") == "high" and idx < len(order) - 1:
        idx += 1

    return order[idx]
def get_adjustment_reason(predicted_type, adjusted_type, context):
    if predicted_type == adjusted_type:
        return "No adjustment required."

    reasons = []

    if context.get("liquidity_risk") == "high":
        reasons.append("limited liquidity buffer")

    if context.get("risk_mismatch"):
        reasons.append("risk-capacity mismatch")

    if context.get("goal_pressure") == "high":
        reasons.append("high goal pressure")

    if not reasons:
        return "Adjusted using financial context."

    return f"Adjusted due to {', '.join(reasons)}."