import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from job_ai_matcher.services import JobMatcherService

service = JobMatcherService()

resume = """
ADITI SHARMA
Civil Engineer
Pune, Maharashtra

EDUCATION
B.Tech in Civil Engineering
National Institute of Technology (NIT)

SKILLS
AutoCAD, Revit, Structural Analysis, SAP2000, ETABS, Concrete Design, Project Management, Site Inspection, Cost Estimation

EXPERIENCE
Junior Structural Engineer
L&T Construction
- Designed and drafted structural plans for 3 commercial buildings.
- Conducted site quality inspections to ensure compliance with seismic standards.
- Reduced project material cost by 15% through optimized concrete mix design.

PROJECTS
- Designed a suspension bridge model using SAP2000.
"""

print("Generating Jobs...")
jobs = service.match_jobs(resume)
import json
print(json.dumps(jobs, indent=2))
