from rest_framework.exceptions import APIException
import logging

logger = logging.getLogger('django')

class BaseException(APIException):
    """Base class for all custom exceptions."""
    def __init__(self, message, status_code=400):
        self.detail = {'error': message}
        self.status_code = status_code
        super().__init__(self.detail)

class ResumeParsingError(BaseException):
    """Raised when resume parsing fails."""
    pass

class ResumeValidationError(BaseException):
    """Raised when a document fails strict resume validation rules."""
    pass

class MLModelError(BaseException):
    """Raised when ML model processing fails."""
    pass

class BaseService:
    """Base class for all business services."""
    
    def __init__(self):
        self.logger = logger

    def handle_exception(self, e):
        """Standardized exception handling."""
        self.logger.error(f"Service Error: {str(e)}")
        if isinstance(e, BaseException):
            raise e
        raise BaseException(str(e), status_code=500)
