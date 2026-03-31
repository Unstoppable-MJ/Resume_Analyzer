from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from core.common import BaseService, BaseException

class AuthService(BaseService):
    """Service to handle user authentication and registration."""

    def register_user(self, username, email, password):
        try:
            if User.objects.filter(username=username).exists():
                raise BaseException("Username already exists", status_code=400)
            
            user = User.objects.create_user(username=username, email=email, password=password)
            refresh = RefreshToken.for_user(user)
            
            return {
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                },
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            }
        except Exception as e:
            self.handle_exception(e)

    def login_user(self, username, password):
        try:
            from django.contrib.auth import authenticate
            user = authenticate(username=username, password=password)
            
            if user is None:
                raise BaseException("Invalid credentials", status_code=401)
            
            refresh = RefreshToken.for_user(user)
            return {
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                },
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            }
        except Exception as e:
            self.handle_exception(e)
