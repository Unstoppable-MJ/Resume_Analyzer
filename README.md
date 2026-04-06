# 🚀 AI Resume Analyzer & Career Copilot

**Transform your career journey with AI-powered insights.**

This project is a premium, SaaS-style web application designed to help job seekers optimize their resumes, identify skill gaps, and get real-time career coaching through an AI-powered "Career Copilot."

---

## 📸 Project Showcase

 ## Landing Page
 
 <img width="1919" height="1030" alt="image" src="https://github.com/user-attachments/assets/1009ded7-0c66-4116-88f6-10a66754dd0c" />
 <img width="1917" height="1031" alt="image" src="https://github.com/user-attachments/assets/3facb661-0a64-4934-a9e0-1c82d7366819" />
 <img width="1914" height="982" alt="image" src="https://github.com/user-attachments/assets/35d2a326-af48-4ab8-b41b-f71c710bc4c1" />

 ## Login Page

 <img width="1919" height="1028" alt="image" src="https://github.com/user-attachments/assets/b74b21be-ee91-42c7-bae1-756f93a64e73" />
 <img width="1919" height="940" alt="image" src="https://github.com/user-attachments/assets/c6d3c3e6-80dc-4da3-9545-41b44d22b38f" />

 ## Analysis of Resume 

 <img width="1919" height="972" alt="image" src="https://github.com/user-attachments/assets/76bb307d-fda5-440e-8f47-1de90f7e1311" />

 ## Skill Mapped and AI Suggestions
 
 <img width="1885" height="782" alt="image" src="https://github.com/user-attachments/assets/38ec3eb5-c660-4e67-905a-14e1e8991a42" />

 ## Ai Job matches

 <img width="1897" height="817" alt="image" src="https://github.com/user-attachments/assets/6cbe735f-589d-498d-a5ec-4902f447f8e2" />

 ## Ai Carrier Matcher 

 <img width="1890" height="967" alt="image" src="https://github.com/user-attachments/assets/ffef3f00-14b8-4aa0-be0b-eecd05e82705" />
 <img width="1901" height="958" alt="image" src="https://github.com/user-attachments/assets/2d3ec606-04df-44d4-bc10-a9059cfcbec7" />

 ## Career Guide Copilot

 <img width="1897" height="963" alt="image" src="https://github.com/user-attachments/assets/48d6c890-d5e2-4a9d-9d48-5482421a4486" />
 <img width="1889" height="934" alt="image" src="https://github.com/user-attachments/assets/cfec5faa-ac11-4333-8534-0415bcf1e2ce" />













---

## ✨ Core Features

- **📄 AI Resume Analysis**: Instantly receive an ATS-friendly score and detailed performance summary using Gemini 2.0 Flash.
- **🛠️ Automated Skill Extraction**: Uses Spacy NLP to extract technical and soft skills from your PDF resume.
- **💬 Career Copilot Chatbot**: A real-time AI assistant that provides interview tips, resume advice, and career path guidance.
- **🎯 Career Matching**: Smart job recommendations based on your resume's skill profile and identified gaps.
- **🛡️ Production Ready**: Hardened security, optimized Nginx configuration, and automated CI/CD deployment.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Framework**: Django + DRF
- **NLP**: Spacy (en_core_web_md)
- **AI Models**: Gemini 2.0, Llama 3 (Groq), Mistral (HuggingFace)

---

## 🚢 Deployment (Azure VM)

This project is configured for automated deployment via GitHub Actions.

1. **GitHub Secrets**: Add `SERVER_IP`, `SERVER_USER`, `SSH_PRIVATE_KEY` to your repository secrets.
2. **Push**: Any push to the `main` branch will trigger a fresh build and deploy.
3. **PM2**: Use `pm2 restart backend --update-env` to apply changes on the server.
