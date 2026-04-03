import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier

# Load dataset
df = pd.read_csv("investment_recommendation_dataset.csv")
print(df["recommended_investment_type"].value_counts())

# Feature columns
feature_cols = [
    "monthly_income",
    "monthly_expenses",
    "current_savings",
    "monthly_sip",
    "financial_goal",
    "time_horizon_years",
    "risk_profile",
    "income_stability",
    "savings_ratio",
    "expense_ratio",
    "disposable_income",
    "sip_ratio",
    "financial_buffer",
    "goal_pressure",
    "surplus_after_sip",
    "goal_feasibility_ratio",
    "investment_capacity_ratio",
    "savings_to_goal_ratio",
    "liquidity_stress"
]

X = df[feature_cols]
y = df["recommended_investment_type"]

# Encode target labels
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, stratify=y_encoded, random_state=42
)

# Base model
model = XGBClassifier(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="multi:softmax",
    num_class=len(label_encoder.classes_),
    eval_metric="mlogloss",
    random_state=42
)

# Train
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Evaluate
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))

# Save model
joblib.dump(model, "investment_model.pkl")
joblib.dump(label_encoder, "label_encoder.pkl")

print("Model and label encoder saved successfully!")