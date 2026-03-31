from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from core.common import BaseService

class JobRecommenderService(BaseService):
    """Service to match resumes against job descriptions."""

    def calculate_match(self, resume_text, job_description):
        """Calculate cosine similarity between resume and JD."""
        try:
            vectorizer = TfidfVectorizer(stop_words='english')
            tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
            
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
            match_percentage = round(float(similarity[0][0]) * 100, 2)
            
            return {
                "match_score": match_percentage,
                "common_keywords": self._get_common_keywords(resume_text, job_description)
            }
        except Exception as e:
            self.handle_exception(e)

    def _get_common_keywords(self, text1, text2):
        """Extract common keywords between two texts (simple implementation)."""
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        common = words1.intersection(words2)
        # Filter for meaningful words (len > 3)
        return list(filter(lambda x: len(x) > 3, common))[:10]
