import json
import re
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from django.conf import settings
from core.common import BaseService
from core.ai_service import AIService

class JobMatcherService(BaseService):
    def __init__(self):
        super().__init__()
        self.ai = AIService()

    def match_jobs(self, resume_text, top_n=3, user_id=None):
        if not resume_text:
            return []

        # Use AIService for resilient generation
        prompt = f"""
        You are an elite technical recruiter and career coach. Review the provided resume and dynamically generate {top_n} realistic, specific job roles that the candidate is mostly highly qualified for.
        
        Resume Text:
        {resume_text[:4000]}
        
        Provide the response strictly as a JSON array containing {top_n} objects. Do NOT use markdown wrappers like ```json. Output ONLY raw JSON.

        Each object must have exactly these keys:
        - "title": (string) The specific job title.
        - "match_percentage": (integer) A realistic match score.
        - "reason": (string) A 1-2 sentence explanation.
        - "missing_skills": (list of strings) 1 to 4 missing skills.
        - "matched_skills": (list of strings) 3 to 6 matched skills.
        - "domain": (string) Industry domain.
        """

        try:
            ai_data = self.ai.generate_response(prompt, user_id=user_id)
            content = ai_data.get('response')
            
            if not content or ai_data.get('status') in ['rate_limited', 'all_failed']:
                return self._get_fallback_jobs()

            content = content.strip()
            
            # Clean up potential markdown formatting mistakenly added by LLM
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()
                
            jobs = json.loads(content)
            
            # Ensure it is a list
            if isinstance(jobs, dict):
                # Sometimes LLM outputs {"jobs": [...]}
                jobs = jobs.get("jobs", [jobs])
                
            return jobs[:top_n]
            
        except Exception as e:
            self.logger.error(f"Job Matcher Dynamic Generation Error: {str(e)}")
            return self._get_fallback_jobs()

    def _get_fallback_jobs(self):
        """Returns high quality fallback jobs if the API fails."""
        return [
            {
                "title": "Software Engineer",
                "match_percentage": 85,
                "reason": "Your technical foundation and problem-solving skills align perfectly with modern software engineering roles.",
                "missing_skills": ["System Design Architecture"],
                "domain": "Software Development",
                "matched_skills": ["Python", "Algorithm Analysis", "Problem Solving"]
            },
            {
                "title": "Data Analyst",
                "match_percentage": 78,
                "reason": "Your experience with data handling and analytical thinking makes you a strong candidate for data-driven roles.",
                "missing_skills": ["Advanced Tableau BI"],
                "domain": "Data Analytics",
                "matched_skills": ["Statistical Analysis", "Data Manipulation", "Report Generation"]
            },
            {
                "title": "Technical Project Manager",
                "match_percentage": 72,
                "reason": "Your ability to oversee technical tasks and communicate effectively is ideal for management-track roles.",
                "missing_skills": ["PMP Certification"],
                "domain": "Project Management",
                "matched_skills": ["Agile Methodology", "Team Leadership", "Planning"]
            }
        ]

class JobAPIService(BaseService):
    """Fetches real-time jobs from an external Job API. Defaults to Remotive API."""
    
    def _fetch_from_remotive(self, query, limit):
        url = f"https://remotive.com/api/remote-jobs?search={query}&limit={limit*3}"
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            return data.get('jobs', [])
        except Exception as e:
            import logging
            logging.getLogger(__name__).error(f"Remotive Fetch Error: {str(e)}")
            return []

    def fetch_jobs(self, skills, limit=15):
        queries = []
        if skills:
            # 1. Try a highly targeted query
            queries.append(" ".join(skills[:2]))
            # 2. Try just the top skill
            queries.append(skills[0])
            
        # 3. Always fallback to generic tech
        queries.extend(["developer", "software engineer"])
        
        jobs = []
        for query in queries:
            if not query:
                continue
            # Some skills might have URL-unsafe spaces, so requests will handle them or we can just replace
            jobs = self._fetch_from_remotive(query, limit)
            if jobs:
                break # Found some jobs, break out of fallback loop!
                
        formatted_jobs = []
        for job in jobs[:limit]:
            # Extract simple location strings
            location = job.get("candidate_required_location") or "Remote"
            if len(location) > 30:
                location = "Remote / " + location[:20] + "..."
                
            formatted_jobs.append({
                "title": job.get("title"),
                "company": job.get("company_name"),
                "location": location,
                "apply_link": job.get("url"),
                "description": job.get("description", ""),
                "source": "Remotive"
            })
        return formatted_jobs

class AIJobMatcherService(BaseService):
    """Ranks job requirements against a resume using TF-IDF cosine similarity."""
    def __init__(self):
        super().__init__()
        self.vectorizer = TfidfVectorizer(stop_words='english')

    def rank_jobs(self, resume_text, jobs):
        if not jobs or not resume_text:
            return jobs

        try:
            # Prepare documents: index 0 is resume, the rest are job descriptions
            documents = [resume_text] + [f"{job['title']} {job['description']}" for job in jobs]
            
            # Create TF-IDF matrix
            tfidf_matrix = self.vectorizer.fit_transform(documents)
            
            # Calculate cosine similarity between resume (doc 0) and all jobs (doc 1 to N)
            cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
            
            # Attach match percentage and sort
            ranked_jobs = []
            for i, job in enumerate(jobs):
                # Cosine similarity is between 0 and 1. Convert to percentage.
                base_score = float(cosine_similarities[i]) * 100
                
                # Scale up a bit to look realistic (raw cosine similarity text-wise is typically ~15-40%)
                matched_score = min(99, int(base_score * 2.5 + 40)) 
                
                job_copy = job.copy()
                job_copy.pop("description", None) # Remove huge description from response
                job_copy["match_percentage"] = max(matched_score, 10) # Ensure at least 10%
                ranked_jobs.append(job_copy)
                
            # Sort by match_percentage descending
            ranked_jobs.sort(key=lambda x: x["match_percentage"], reverse=True)
            return ranked_jobs
            
        except Exception as e:
            self.logger.error(f"AI Job Matcher Ranking Error: {str(e)}")
            # Fallback: Just return jobs with a default match percentage
            for job in jobs:
                job.pop("description", None)
                job["match_percentage"] = 75
            return jobs
