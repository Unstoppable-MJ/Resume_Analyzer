from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .services import JobMatcherService

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
