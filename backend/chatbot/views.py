from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .services import ChatbotService

class ChatView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        query = request.data.get('query')
        context = request.data.get('context', '')
        
        if not query:
            return Response({"error": "Query required"}, status=status.HTTP_400_BAD_REQUEST)
        
        service = ChatbotService()
        answer = service.get_response(query, context)
        return Response({"response": answer})
