from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .services import JobMatcherService, JobAPIService, AIJobMatcherService

class AIJobMatchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        resume_text = request.data.get('resume_text', '')
        
        if not resume_text:
            return Response({"error": "Missing resume_text in request"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            service = JobMatcherService()
            jobs = service.match_jobs(resume_text, top_n=4)
            return Response({"recommended_jobs": jobs}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LiveAIJobMatchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        resume_text = request.data.get('resume_text', '')
        skills = request.data.get('skills', [])
        
        if not resume_text:
            return Response({"error": "Missing resume_text in request"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # 1. Fetch live jobs using API
            api_service = JobAPIService()
            fetched_jobs = api_service.fetch_jobs(skills=skills, limit=15)
            
            # 2. Rank using AI Matcher
            matcher_service = AIJobMatcherService()
            ranked_jobs = matcher_service.rank_jobs(resume_text, fetched_jobs)
            
            return Response({"jobs": ranked_jobs}, status=status.HTTP_200_OK)
        except Exception as e:
            import logging
            logging.getLogger('error_logger').error(f"Live AI Job Matcher Error: {str(e)}")
            return Response({"error": str(e), "jobs": []}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
