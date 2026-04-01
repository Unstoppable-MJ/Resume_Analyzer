# Defines a static, high-quality dataset of job roles to be used by the AI matcher.
# This ensures recommendations are realistic and cover various domains.

STATIC_JOBS = [
    {
        "id": "J1",
        "title": "Data Engineer",
        "domain": "Data",
        "required_skills": ["Python", "SQL", "Spark", "AWS", "Airflow", "ETL", "Kafka"],
        "description": "Design, build, and optimize data lakes and pipelines. Work with large scale data processing frameworks."
    },
    {
        "id": "J2",
        "title": "Frontend Software Engineer",
        "domain": "Web Development",
        "required_skills": ["JavaScript", "React", "TypeScript", "HTML", "CSS", "Redux", "TailwindCSS"],
        "description": "Develop highly responsive user interfaces, collaborating with design teams to produce premium web experiences."
    },
    {
        "id": "J3",
        "title": "Backend Developer",
        "domain": "Web Development",
        "required_skills": ["Python", "Django", "PostgreSQL", "REST APIs", "Docker", "Node.js", "Redis"],
        "description": "Build robust, scalable and secure server-side applications and integrate with complex databases."
    },
    {
        "id": "J4",
        "title": "Data Scientist",
        "domain": "Data",
        "required_skills": ["Python", "Machine Learning", "Pandas", "Scikit-learn", "TensorFlow", "Statistics", "SQL"],
        "description": "Analyze complex, large-scale datasets, build predictive models, and provide actionable business insights."
    },
    {
        "id": "J5",
        "title": "DevOps Engineer",
        "domain": "Infrastructure",
        "required_skills": ["Linux", "AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Jenkins"],
        "description": "Automate software delivery processes, manage cloud infrastructure, and ensure high availability of applications."
    },
    {
        "id": "J6",
        "title": "Machine Learning Engineer",
        "domain": "AI/ML",
        "required_skills": ["Python", "PyTorch", "TensorFlow", "NLP", "Computer Vision", "MLOps", "Model Deployment"],
        "description": "Design and deploy scaleable machine learning models into production environments."
    },
    {
        "id": "J7",
        "title": "Full Stack Developer",
        "domain": "Web Development",
        "required_skills": ["JavaScript", "React", "Node.js", "Express", "MongoDB", "SQL", "Git"],
        "description": "Handle both client-side and server-side logic, developing end-to-end web applications."
    },
    {
        "id": "J8",
        "title": "Product Manager",
        "domain": "Management",
        "required_skills": ["Agile", "Scrum", "Product Roadmap", "Jira", "Market Analysis", "Communication", "UX principles"],
        "description": "Lead the product vision, prioritize features, and collaborate directly with engineering and design teams."
    },
    {
        "id": "J9",
        "title": "UI/UX Designer",
        "domain": "Design",
        "required_skills": ["Figma", "Sketch", "Prototyping", "User Research", "Wireframing", "Interaction Design", "CSS"],
        "description": "Create intuitive, user-centric interfaces and conduct research to improve overall user experience."
    },
    {
        "id": "J10",
        "title": "Cybersecurity Analyst",
        "domain": "Security",
        "required_skills": ["Network Security", "Penetration Testing", "SIEM", "Python", "Linux", "Risk Assessment"],
        "description": "Monitor internal networks, identify vulnerabilities, and proactively implement security protocols."
    },
    {
        "id": "J11",
        "title": "Cloud Architect",
        "domain": "Infrastructure",
        "required_skills": ["AWS", "Azure", "GCP", "System Design", "Microservices", "Networking", "Security"],
        "description": "Design cloud adoption plans, application design, and management and monitoring of cloud systems."
    },
    {
        "id": "J12",
        "title": "Mobile App Developer",
        "domain": "Mobile",
        "required_skills": ["Swift", "Kotlin", "React Native", "Flutter", "Mobile UI", "REST APIs"],
        "description": "Create engaging and functional applications for iOS and Android platforms."
    }
]
