import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
from core.common import BaseService, MLModelError

class ResumeScoringService(BaseService):
    """Service to score resumes using ML."""

    MODEL_PATH = 'resume_scoring/models/scoring_model.joblib'
    VECTORIZER_PATH = 'resume_scoring/models/vectorizer.joblib'

    def __init__(self):
        super().__init__()
        self._load_model()

    def _load_model(self):
        """Load or train a basic model if not exists."""
        if os.path.exists(self.MODEL_PATH) and os.path.exists(self.VECTORIZER_PATH):
            self.model = joblib.load(self.MODEL_PATH)
            self.vectorizer = joblib.load(self.VECTORIZER_PATH)
        else:
            self.logger.warning("ML model not found. Training a baseline model...")
            self._train_baseline_model()

    def _train_baseline_model(self):
        """Train a baseline model using synthetic data."""
        data = [
            ("Experienced Python Developer with Django and React knowledge.", 90),
            ("Junior developer with basic HTML and CSS.", 40),
            ("Senior Data Scientist with NLP and Machine Learning expertise.", 95),
            ("Marketing manager with some social media skills.", 50),
            ("DevOps Engineer with Kubernetes and Docker experience.", 88)
        ]
        texts, scores = zip(*data)
        
        self.vectorizer = TfidfVectorizer(max_features=1000)
        X = self.vectorizer.fit_transform(texts)
        
        self.model = RandomForestRegressor(n_estimators=100)
        self.model.fit(X, scores)
        
        # Save model
        os.makedirs(os.path.dirname(self.MODEL_PATH), exist_ok=True)
        joblib.dump(self.model, self.MODEL_PATH)
        joblib.dump(self.vectorizer, self.VECTORIZER_PATH)

    def calculate_score(self, text):
        """Predict score for the given resume text."""
        try:
            X = self.vectorizer.transform([text])
            score = self.model.predict(X)[0]
            return round(float(score), 2)
        except Exception as e:
            self.handle_exception(MLModelError(f"Scoring Failed: {str(e)}"))
