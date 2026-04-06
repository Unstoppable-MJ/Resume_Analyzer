# 🚀 AI Resume Analyzer & Career Copilot

**Transform your career journey with AI-powered insights.**

This project is a premium, SaaS-style web application designed to help job seekers optimize their resumes, identify skill gaps, and get real-time career coaching through an AI-powered "Career Copilot."

---

## 📸 Project Showcase

> [!TIP]
> **ADD SCREENSHOT HERE**: Replace this with a high-resolution hero image of your landing page. 
> Recommended size: 1200x600px.
> `![Hero Screenshot](./screenshots/hero.png)`

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
