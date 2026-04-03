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
    pred_encoded = model.predict(np.array(features))[0]
    pred_label = label_encoder.inverse_transform([pred_encoded])[0]
    return pred_label, derived_metrics


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