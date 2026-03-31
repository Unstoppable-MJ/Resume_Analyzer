from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .services import JobRecommenderService

class MatchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        resume_text = request.data.get('resume_text')
        job_description = request.data.get('job_description')
        
        if not resume_text or not job_description:
            return Response({"error": "Missing input data"}, status=status.HTTP_400_BAD_REQUEST)
        
        service = JobRecommenderService()
        result = service.calculate_match(resume_text, job_description)
        return Response(result)
