CivicShinobi – AI-Powered Civic Engagement Platform
🔗 Live Website: https://joyful-crumble-1879bf.netlify.app

📌 Overview
CivicShinobi is a hyperlocal civic tech platform designed to empower citizens to report local issues—like potholes, broken streetlights, overflowing garbage, and water leaks—within their neighborhoods. Built using modern web technologies and AI, the platform streamlines reporting, tracking, and resolution of civic problems, while fostering community engagement and transparency.

✨ Key Features
📍 Geofenced Issue Visibility: Users can only view and interact with issues reported within a 1–5 km radius of their current or selected location.

📸 Crowdsourced Reporting: Report issues with title, description, up to 5 photos, category, and geolocation (via GPS or manual pin).

🤖 AI-based Classification: Use of TensorFlow to auto-classify issues based on uploaded images.

🔔 Real-Time Status Tracking: Track issue lifecycle (Reported → In Progress → Resolved) with live notifications (Socket.IO).

🗺️ Map Visualization: See all issues as pins on a Mapbox-based map, with filters for status, category, and distance.

💬 Community Discussions: Enable comments and feedback on individual issue threads (via Discourse API or custom).

🚩 Spam Control & Moderation: Users can flag inappropriate content. Auto-hide after 3 flags and send to admin dashboard for review.

📊 Open Data Analytics: Visualize trends using D3.js — such as most common civic problems, top locations, resolution rates, and more.

🔐 Anonymous or OAuth-based Login: Flexible access control with secure authentication.

🧱 Tech Stack
Frontend
Next.js – React-based SSR framework

Chakra UI – Responsive and accessible UI components

Mapbox GL JS – Interactive map & geolocation

D3.js – Data visualization and analytics

Backend
Flask – Lightweight Python API framework

TensorFlow – ML model for image classification

Socket.IO – Real-time status and notification updates

Mapbox API – Geocoding and location radius detection

Database & Deployment
MongoDB – Primary database for issue reports, users

Redis – Caching, rate limiting, flag counter

OAuth 2.0 – Secure authentication

Docker & Serverless – Containerized and scalable deployment

🚀 Project Status
✅ MVP Complete
🧪 Currently deployed to Netlify for demo:
🔗 https://joyful-crumble-1879bf.netlify.app

🔮 Future Enhancements
🗣️ Voice-based reporting (OpenAI Whisper or Google Speech API)

🌐 Multilingual UI (regional language support)

📱 Progressive Web App (PWA) or Mobile App

🔍 AI-driven spam and urgency detection

🏛️ Municipality integration APIs for automatic ticket forwarding

