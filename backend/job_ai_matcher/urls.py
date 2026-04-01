from django.urls import path
from .views import AIJobMatchView

urlpatterns = [
    path('match/', AIJobMatchView.as_view(), name='ai_job_match'),
]
