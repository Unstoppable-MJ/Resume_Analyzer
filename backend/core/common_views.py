# resume_scoring/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .services import ResumeScoringService

class ScoringView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        service = ResumeScoringService()
        score = service.calculate_score(request.data.get('text', ''))
        return Response({"score": score})

# job_recommender/views.py
from job_recommender.services import JobRecommenderService

class MatchView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        service = JobRecommenderService()
        result = service.calculate_match(
            request.data.get('resume_text', ''),
            request.data.get('job_description', '')
        )
        return Response(result)

# ats_checker/views.py
from ats_checker.services import ATSCheckerService

class ATSCheckView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        service = ATSCheckerService()
        report = service.check_ats_compatibility(request.data.get('text', ''))
        return Response(report)
