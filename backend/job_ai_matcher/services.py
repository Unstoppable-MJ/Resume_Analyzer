import json
import re
import google.generativeai as genai
from django.conf import settings
from core.common import BaseService

class JobMatcherService(BaseService):
    def __init__(self):
        super().__init__()
        self.api_key = getattr(settings, 'OPENAI_API_KEY', getattr(settings, 'GEMINI_API_KEY', None))
        if self.api_key and self.api_key != 'dummy_key':
            genai.configure(api_key=self.api_key)
            # Using flash-lite to avoid restrictive quotas
            self.model = genai.GenerativeModel('gemini-2.5-flash-lite')
        else:
            self.model = None

    def match_jobs(self, resume_text, top_n=3):
        if not resume_text:
            return []

        # 1. Fallback Dummy Data if model is not configured
        if not self.model:
            return self._get_fallback_jobs()

        # 2. Dynamic Gemini JSON Generation
        prompt = f"""
        You are an elite technical recruiter and career coach. Review the provided resume and dynamically generate {top_n} realistic, specific job roles that the candidate is mostly highly qualified for.
        
        If the resume is for a Civil Engineer, only output Civil Engineering roles (e.g. Structural Engineer, Site Manager). If medical, output medical roles, etc. Make the recommendations extremely realistic and perfectly tailored to the resume.

        Resume Text:
        {resume_text[:4000]}
        
        Provide the response strictly as a JSON array containing {top_n} objects. Do NOT use markdown wrappers like ```json. Output ONLY raw JSON.

        Each object must have exactly these keys:
        - "title": (string) The specific job title.
        - "match_percentage": (integer) A realistic match score between 60 and 99.
        - "reason": (string) A 1-2 sentence explanation of why this job matches the user. Focus on specific skills or projects mentioned in their resume.
        - "missing_skills": (list of strings) 1 to 4 required skills for this job that the user does NOT have.
        - "matched_skills": (list of strings) 3 to 6 main skills required by this job that the user ACTUALLY possesses.
        - "domain": (string) General industry domain (e.g., "Civil Engineering", "Data Science", "Marketing").
        """

        try:
            response = self.model.generate_content(prompt)
            content = response.text.strip()
            
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
        """Returns dummy jobs if the API fails due to rate limits or formatting errors."""
        return [
            {
                "title": "Related Professional Role",
                "match_percentage": 75,
                "reason": "Based on the keywords in your resume, your experience aligns well with standard roles in this sector. (Note: Dynamic AI generation is temporarily rate-limited).",
                "missing_skills": ["Specialized Certification"],
                "domain": "General Industry",
                "matched_skills": ["Communication", "Project Management", "Analysis"]
            }
        ]
