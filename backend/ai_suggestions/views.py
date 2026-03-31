from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .services import AISuggestionsService

class SuggestionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        text = request.data.get('text')
        if not text:
            return Response({"error": "No text provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        service = AISuggestionsService()
        suggestions = service.get_suggestions(text)
        return Response({"suggestions": suggestions})
