from django.urls import path
from .views import AIJobMatchView, LiveAIJobMatchView

urlpatterns = [
    path('match/', AIJobMatchView.as_view(), name='ai_job_match'),
    path('live/', LiveAIJobMatchView.as_view(), name='live_ai_job_match'),
]
