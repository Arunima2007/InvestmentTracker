import pandas as pd
import numpy as np
import random

np.random.seed(42)
random.seed(42)

rows = []

def assign_investment_type(
    monthly_income,
    monthly_expenses,
    current_savings,
    monthly_sip,
    financial_goal,
    time_horizon_years,
    risk_profile,
    income_stability
):
    savings_ratio = current_savings / monthly_income if monthly_income > 0 else 0
    expense_ratio = monthly_expenses / monthly_income if monthly_income > 0 else 1
    disposable_income = monthly_income - monthly_expenses
    sip_ratio = monthly_sip / monthly_income if monthly_income > 0 else 0
    financial_buffer = current_savings / monthly_expenses if monthly_expenses > 0 else 0
    goal_pressure = financial_goal / (time_horizon_years * 12) if time_horizon_years > 0 else financial_goal
    surplus_after_sip = monthly_income - monthly_expenses - monthly_sip
    goal_feasibility_ratio = monthly_sip / goal_pressure if goal_pressure > 0 else 0
    investment_capacity_ratio = monthly_sip / disposable_income if disposable_income > 0 else 0
    savings_to_goal_ratio = current_savings / financial_goal
    liquidity_stress = (monthly_expenses + monthly_sip) / monthly_income

    score = 0

    if savings_ratio > 6:
        score += 2
    elif savings_ratio > 2:
        score += 1

    if expense_ratio < 0.5:
        score += 2
    elif expense_ratio < 0.7:
        score += 1

    if disposable_income > 40000:
        score += 2
    elif disposable_income > 15000:
        score += 1

    if sip_ratio > 0.25:
        score += 3
    elif sip_ratio > 0.1:
        score += 2

    if financial_buffer > 12:
        score += 2
    elif financial_buffer > 6:
        score += 1

    if goal_feasibility_ratio > 1:
        score += 2
    elif goal_feasibility_ratio > 0.5:
        score += 1

    if time_horizon_years >= 10:
        score += 2
    elif time_horizon_years >= 5:
        score += 1

    if risk_profile == 2:
        score += 5   # strong push to aggressive
    elif risk_profile == 1:
        score += 2
    elif risk_profile == 0:
        score -= 2   # push toward conservative

    if income_stability == 2:
        score += 1
    elif income_stability == 0:
        score -= 1

    if surplus_after_sip < 0:
        score -= 3
    elif surplus_after_sip < 5000:
        score -= 1

    if goal_pressure > disposable_income and disposable_income > 0:
        score -= 2

    if score <= 2:
        return "Conservative"
    elif score <= 4:
        return "Balanced"
    elif score <= 7:
        return "Growth"
    else:
        return "Aggressive"


target_per_class = 1000

class_counts = {
    "Conservative": 0,
    "Balanced": 0,
    "Growth": 0,
    "Aggressive": 0
}

while min(class_counts.values()) < target_per_class:
    monthly_income = np.random.randint(25000, 250001)
    monthly_expenses = np.random.randint(10000, int(monthly_income * 0.9))
    current_savings = np.random.randint(10000, 2000001)
    monthly_sip = np.random.randint(1000, max(2000, int(monthly_income * 0.4)))
    financial_goal = np.random.randint(100000, 10000001)
    time_horizon_years = np.random.randint(1, 21)
    risk_profile = np.random.choice([0, 1, 2])   # 0 low, 1 medium, 2 high
    income_stability = np.random.choice([0, 1, 2])  # 0 low, 1 medium, 2 high

    savings_ratio = current_savings / monthly_income if monthly_income > 0 else 0
    expense_ratio = monthly_expenses / monthly_income if monthly_income > 0 else 0
    disposable_income = monthly_income - monthly_expenses
    sip_ratio = monthly_sip / monthly_income if monthly_income > 0 else 0
    financial_buffer = current_savings / monthly_expenses if monthly_expenses > 0 else 0
    goal_pressure = financial_goal / (time_horizon_years * 12)
    surplus_after_sip = monthly_income - monthly_expenses - monthly_sip
    goal_feasibility_ratio = monthly_sip / goal_pressure if goal_pressure > 0 else 0
    investment_capacity_ratio = monthly_sip / disposable_income if disposable_income > 0 else 0
    savings_to_goal_ratio = current_savings / financial_goal
    liquidity_stress = (monthly_expenses + monthly_sip) / monthly_income

    recommended_investment_type = assign_investment_type(
        monthly_income,
        monthly_expenses,
        current_savings,
        monthly_sip,
        financial_goal,
        time_horizon_years,
        risk_profile,
        income_stability
    )

    if class_counts[recommended_investment_type] < target_per_class:
        rows.append({
            "monthly_income": monthly_income,
            "monthly_expenses": monthly_expenses,
            "current_savings": current_savings,
            "monthly_sip": monthly_sip,
            "financial_goal": financial_goal,
            "time_horizon_years": time_horizon_years,
            "risk_profile": risk_profile,
            "income_stability": income_stability,
            "savings_ratio": savings_ratio,
            "expense_ratio": expense_ratio,
            "disposable_income": disposable_income,
            "sip_ratio": sip_ratio,
            "financial_buffer": financial_buffer,
            "goal_pressure": goal_pressure,
            "surplus_after_sip": surplus_after_sip,
            "goal_feasibility_ratio": goal_feasibility_ratio,
            "recommended_investment_type": recommended_investment_type,
            "investment_capacity_ratio": investment_capacity_ratio,
            "savings_to_goal_ratio": savings_to_goal_ratio,
            "liquidity_stress": liquidity_stress,
        })
        class_counts[recommended_investment_type] += 1

df = pd.DataFrame(rows)
df.to_csv("investment_recommendation_dataset.csv", index=False)

print("Balanced dataset generated successfully!")
print(df.head())
print(df["recommended_investment_type"].value_counts())