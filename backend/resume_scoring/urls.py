from django.urls import path
from .views import ScoringView

urlpatterns = [
    path('score/', ScoringView.as_view(), name='score'),
]
