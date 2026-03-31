from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, serializers
from .models import Resume
from .services import ResumeParserService
from skill_extractor.services import SkillExtractorService

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ('id', 'file', 'extracted_text', 'uploaded_at')
        read_only_fields = ('extracted_text', 'uploaded_at')

class ResumeUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Save resume record
        resume = Resume.objects.create(user=request.user, file=file)
        
        from .services import ResumeParserService, ResumeValidatorService
        try:
            # Step 1: Parse Text
            parser = ResumeParserService()
            text = parser.extract_text(resume.file.path)

            # Step 2: Validate Resume Content
            validator = ResumeValidatorService()
            validation_result = validator.validate(text)
            
            if not validation_result.get("is_valid_resume"):
                resume.delete()
                return Response(validation_result, status=status.HTTP_400_BAD_REQUEST)

            resume.extracted_text = text
            resume.save()

            # Step 2: Extract Skills
            extractor = SkillExtractorService()
            skills = extractor.extract_skills(text)

            return Response({
                "message": "Resume uploaded and processed successfully",
                "resume_id": resume.id,
                "skills": skills,
                "preview_text": text[:500] + "..." if len(text) > 500 else text
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResumeListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        resumes = Resume.objects.filter(user=request.user)
        serializer = ResumeSerializer(resumes, many=True)
        return Response(serializer.data)
