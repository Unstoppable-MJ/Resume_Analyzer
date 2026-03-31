import spacy
from spacy.matcher import PhraseMatcher
from core.common import BaseService

class SkillExtractorService(BaseService):
    """Service to extract skills from text using spaCy."""
    
    def __init__(self):
        super().__init__()
        try:
            self.nlp = spacy.load("en_core_web_sm")
            self.matcher = PhraseMatcher(self.nlp.vocab)
            self._load_skills()
        except Exception as e:
            self.logger.error(f"NLP Model Loading Failed: {str(e)}")

    def _load_skills(self):
        """Load a list of predefined skills into spaCy PhraseMatcher."""
        # This list can be expanded or loaded from a database/file
        skills = [
            "Python", "Django", "React", "JavaScript", "PostgreSQL", 
            "Machine Learning", "Tf-idf", "NLP", "Scikit-learn", 
            "Docker", "AWS", "SQL", "Git", "Java", "C++", "API",
            "Data Science", "XGBoost", "Random Forest", "Framer Motion",
            "Tailwind CSS", "Vite", "Node.js", "Express", "Kubernetes"
        ]
        patterns = [self.nlp.make_doc(text) for text in skills]
        self.matcher.add("SKILL", patterns)

    def extract_skills(self, text):
        """Extract matching skills from the provided text."""
        try:
            doc = self.nlp(text)
            matches = self.matcher(doc)
            
            found_skills = set()
            for match_id, start, end in matches:
                found_skills.add(doc[start:end].text)
            
            return list(found_skills)
        except Exception as e:
            self.handle_exception(e)
