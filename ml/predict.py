
# Prologue:
# Name of Program: ml/predict.py
# Description: Handles prediction
# Inputs: None
# Outputs: None
# Author: Kristin Boeckmann, Zach Alwin, Shravya Mehta, Lisa Phan, Vinayak Jha
# Creation Date: 04/27/2025

import pandas as pd # Import pandas
from sklearn.preprocessing import MinMaxScaler # Import MinMaxScaler for pre-processing
import numpy as np # Import numpy
import json # Import json
import os # Import os
from prophet import Prophet # Import prophet

PREDICTION_LIMIT_IN_MONTHS = 12 # Prediction limit

METHOD='prophet' # Method prophet

# Name: _validate_file
# Author: Vinayak Jha
# Date: 04/27/2025
# Preconditions: filepath
# Postconditions: raises error if file not found
def _validate_file(filepath):
    # Check if the fi le exists
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")

# Put this somewhere else.
# IDEA: Make the predict.py take args (so this will be called with something like python3 predict.py --method=prophet)
# TODO: Get rid of using filepath, directly connect to database
# Name: predict_using_prophet
# Author: Vinayak Jha
# Date: 04/27/2025
# Preconditions: filepath
# Postconditions: returns predictions
def predict_using_prophet(filepath):
    _validate_file(filepath) # Validate file path

    # Load data
    df = pd.read_csv(filepath)
    expense_df_TSA=df.drop(['categoryId'],axis=1) # Drop category
    expense_df_TSA.rename(columns={'createdAt':'ds','amount':'y'},inplace=True) # Rename columns (for prophet)
    p=Prophet(interval_width=0.92,daily_seasonality=True) # Get prophet
    model= p.fit(expense_df_TSA) # Fit the model
    # Make predicts on the basis of month, and make predictions into the next year
    future = model.make_future_dataframe(periods=PREDICTION_LIMIT_IN_MONTHS, freq='M', include_history=False)
    forecast_prediction = model.predict(future) # Make forecast
    forecast_prediction = forecast_prediction[['ds', 'yhat', 'yhat_lower', 'yhat_upper']] # Chose certain columns
    forecast_prediction['date'] = forecast_prediction['ds'].map(lambda x: x.strftime("%Y-%m-%d")) # Alias date
    forecast_prediction = forecast_prediction.drop(['ds'], axis=1) # Drop ds
    # Return a serializable list of predictions into the next year
    return forecast_prediction.values.tolist()


# Name: preprocess_data
# Author: Kristin Boeckmann
# Date: 04/27/2025
# Preconditions: filepath
# Postconditions: currently preprocess data
def preprocess_data(filepath):
    _validate_file(filepath) # Validate file

    # Load data
    df = pd.read_csv(filepath)

    # Convert createdAt to datetime (MM-DD-YYYY format)
    df["createdAt"] = pd.to_datetime(df["createdAt"], format="%m-%d-%Y")

    # Extract time-based features
    df["month"] = df["createdAt"].dt.month
    df["day_of_week"] = df["createdAt"].dt.dayofweek

    # Aggregate data by month
    monthly_spending = df.groupby(["month"]).agg({"amount": "sum"}).reset_index()

    # Normalize the amount
    scaler = MinMaxScaler(feature_range=(0, 1))
    monthly_spending["amount_normalized"] = scaler.fit_transform(monthly_spending[["amount"]])

    return monthly_spending, scaler

if __name__ == "__main__": # If running directly
    try:
        RANDOM_SALT = os.getenv("summa_random_salt") # Get random salt
        if RANDOM_SALT is None:
            # If random salt is not found, raise exception
            raise Exception("Expected a random salt for dumping predictions")
        filepath = os.path.join(os.getcwd(), f'/tmp/{RANDOM_SALT}.csv') # get the file path
        if METHOD == 'prophet': # Run prophet predictions
            predictions = predict_using_prophet(filepath)
        else:
            monthly_spending, scaler = preprocess_data(filepath)
            # Dummy predictions for testing
            predictions = monthly_spending["amount_normalized"].tolist()
        with open(f"/tmp/{RANDOM_SALT}.json", "w") as prediction_file:
            prediction_file.write(json.dumps(predictions))
    except Exception as e:
        print(json.dumps({"error": str(e)}))  # Print error as JSON
