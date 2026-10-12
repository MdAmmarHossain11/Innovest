import os
import joblib
import json
import numpy as np
import pandas as pd
import datetime
import xgboost as xgb
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report, make_scorer, f1_score
from django.conf import settings
import sqlite3

class StartupProfitabilityPredictor:
    def __init__(self, db_path=None):
        self.model = None
        self.label_encoders = {}
        self.scaler = StandardScaler()
        self.db_path = db_path or os.path.join(settings.BASE_DIR, 'db.sqlite3')
        self.model_path = os.path.join(settings.BASE_DIR, 'ml_api', 'startup_model.joblib')
        self.required_columns = [
            'industry', 'funding_rounds', 'funding_amount_m_usd', 
            'valuation_m_usd', 'revenue_m_usd', 'employees',
            'market_share_percent', 'year_founded', 'region'
        ]

    def load_data(self):
        """Load data from SQLite database"""
        conn = sqlite3.connect(self.db_path)
        query = """
        SELECT * FROM company_analysis 
        WHERE profitable IS NOT NULL AND profitable != ''
        """
        df = pd.read_sql_query(query, conn)
        conn.close()
        return df

    def preprocess_data(self, df):
        """Preprocess the data"""
        # Convert numeric columns
        numeric_cols = ['funding_rounds', 'funding_amount_m_usd', 'valuation_m_usd', 
                       'revenue_m_usd', 'employees', 'market_share_percent', 'year_founded']
        
        for col in numeric_cols:
            df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Fill missing values
        df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
        
        # Encode categorical variables
        categorical_cols = ['industry', 'region']
        for col in categorical_cols:
            self.label_encoders[col] = LabelEncoder()
            df[col] = self.label_encoders[col].fit_transform(df[col].astype(str))
        
        # Convert target to int
        df['profitable'] = df['profitable'].astype(int)
        
        # Scale numeric features
        X = df[self.required_columns]
        y = df['profitable']
        
        X[numeric_cols] = self.scaler.fit_transform(X[numeric_cols])
        
        return X, y

    def train(self):
        """Train the model and return accuracy"""
        try:
            # Load and preprocess data
            df = self.load_data()
            X, y = self.preprocess_data(df)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Train model with XGBoost
            self.model = xgb.XGBClassifier(
                objective='binary:logistic',
                eval_metric='logloss',
                n_estimators=100,
                learning_rate=0.1,
                max_depth=4,
                min_child_weight=1,
                subsample=0.8,
                colsample_bytree=0.8,
                random_state=42,
                n_jobs=-1,
                use_label_encoder=False
            )
            
            # Fit the model
            self.model.fit(X_train, y_train)
            
            # Evaluate
            y_pred = self.model.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)
            report = classification_report(y_test, y_pred, output_dict=True)
            
            print(f"Model accuracy: {accuracy:.2f}")
            print(classification_report(y_test, y_pred))
            
            # Save model info
            model_info = {
                'accuracy': accuracy,
                'training_date': datetime.datetime.now().isoformat(),
                'samples_trained': len(X_train),
                'test_accuracy': accuracy,
                'classification_report': report
            }
            
            # Save model info to JSON
            model_info_path = os.path.join(settings.BASE_DIR, 'ml_api', 'model_info.json')
            os.makedirs(os.path.dirname(model_info_path), exist_ok=True)
            with open(model_info_path, 'w') as f:
                json.dump(model_info, f, indent=2)
            
            # Save the model
            self.save_model()
            
            return accuracy
            
        except Exception as e:
            print(f"Error training model: {str(e)}")
            raise

    def _preprocess_input(self, input_df):
        """Preprocess input data for prediction"""
        numeric_cols = ['funding_rounds', 'funding_amount_m_usd', 'valuation_m_usd', 
                       'revenue_m_usd', 'employees', 'market_share_percent', 'year_founded']
        
        # Convert numeric columns
        for col in numeric_cols:
            input_df[col] = pd.to_numeric(input_df[col], errors='coerce')
        
        # Fill missing values with median (shouldn't happen with proper validation)
        input_df[numeric_cols] = input_df[numeric_cols].fillna(0)
        
        # Encode categorical variables
        categorical_cols = ['industry', 'region']
        for col in categorical_cols:
            if col in input_df.columns:
                # Handle unseen labels
                input_df[col] = input_df[col].apply(
                    lambda x: x if x in self.label_encoders[col].classes_ else 'unknown'
                )
                input_df[col] = self.label_encoders[col].transform(input_df[col])
        
        # Scale features
        input_df[numeric_cols] = self.scaler.transform(input_df[numeric_cols])
        
        return input_df

    def predict(self, input_data):
        """Make a prediction for new input data"""
        if not self.model:
            try:
                self.load_model()
            except Exception as e:
                raise Exception("Model not found. Please train the model first.")
            
        try:
            # Convert input data to DataFrame
            input_df = pd.DataFrame([input_data])
            
            # Preprocess the input data
            X = self._preprocess_input(input_df)
            
            # Make prediction
            prediction = self.model.predict(X)[0]
            proba = self.model.predict_proba(X)[0]
            confidence = float(max(proba))
            
            # Return in the format expected by the frontend
            return {
                'is_profitable': bool(prediction == 1),
                'probability': float(proba[1]),  # Probability of being profitable
                'key_factors': self._get_key_factors(X)  # Add key factors if available
            }
        except Exception as e:
            raise Exception(f"Error making prediction: {str(e)}")

    def save_model(self):
        """Save the trained model and encoders"""
        model_data = {
            'model': self.model,
            'label_encoders': self.label_encoders,
            'scaler': self.scaler
        }
        joblib.dump(model_data, self.model_path)

    def load_model(self):
        """Load the trained model and encoders"""
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(
                f"Model not found at {self.model_path}. "
                "Please train the model first using the train_model management command."
            )
        
        try:
            model_data = joblib.load(self.model_path)
            self.model = model_data['model']
            self.label_encoders = model_data['label_encoders']
            self.scaler = model_data['scaler']
            return True
            
        except Exception as e:
            raise Exception(f"Error loading model: {str(e)}")
    
    def is_model_trained(self):
        """Check if the model is trained and can be loaded"""
        try:
            return self.load_model() is not None
        except Exception:
            return False
            
    def _get_key_factors(self, X):
        """Get key factors that influenced the prediction"""
        if not hasattr(self.model, 'feature_importances_'):
            return ["Detailed factor analysis not available for this model"]
            
        # Get feature importances from XGBoost
        importances = self.model.feature_importances_
        
        # Get feature names (assuming X is a DataFrame)
        try:
            feature_names = X.columns.tolist()
        except:
            feature_names = [f'feature_{i}' for i in range(len(importances))]
        
        # Sort features by importance
        features = sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)
        
        # Return top 3 factors
        top_factors = features[:3]
        
        # Format the factors into readable strings
        factor_descriptions = []
        for factor, importance in top_factors:
            factor_name = factor.replace('_', ' ').title()
            factor_descriptions.append(f"{factor_name} (Impact: {importance*100:.1f}%)")
            
        return factor_descriptions or ["No significant factors identified"]

# Singleton instance
predictor = StartupProfitabilityPredictor()
