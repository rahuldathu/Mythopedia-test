# Mythopedia — Product Requirements Document

## Overview

Mythopedia is a mobile-first learning application for iOS and Android. It teaches users about world mythologies (Greek, Norse, Egyptian, Hindu, Roman, and others) through interactive, gamified lessons inspired by Duolingo’s learning format.

This document outlines the full product requirements for the mobile app, backend services, APIs, data models, offline support, notifications, and analytics infrastructure.

## Product Features

### User Management

- User registration via:  
  - Email/password  
  - Google OAuth  
  - Apple Sign-in (iOS only)  
- User login and logout  
- Profile setup:  
  - Username  
  - Avatar selection or upload  
- JWT-based authentication via Supabase Auth  
- Password reset via email  

### Mythology Courses and Lessons

- Multiple mythology categories (e.g. Greek, Norse, Egyptian, Hindu)  
- Each category contains a structured series of lessons  
- Supported lesson types:  
  - Text-based learning cards  
  - Multiple-choice quizzes  
  - Match-the-pairs exercises  
  - Fill-in-the-blank activities  
  - Image-based identification  
- Locked/unlocked progression system  
- XP awarded for completing each lesson  
- Track progress at both course and individual lesson levels  
- Resume partially completed lessons  

### Gamification

- XP system to track learning progress  
- Daily streak counter for consecutive learning days  
- Achievements and badges for specific milestones (e.g. 100 XP, 7-day streak)  
- Leaderboards within each mythology category, ranking by total XP  

### Offline Support

- Download selected lessons for offline use  
- Store completed lesson data locally  
- Sync XP and progress when the device is back online  
- Display cached content when offline  

### Notifications

- Push notifications for:  
  - Daily lesson reminders  
  - Streak warnings  
  - New mythology category releases  
- User control for enabling/disabling notifications  

## Technical Requirements

### Mobile Application (Frontend)

Framework: react native, expo (iOS and Android)

Modules and tasks:  
- Authentication screens (sign-up, login, password reset)  
- Course selection screen with available mythologies  
- Lesson screens for all lesson types  
- XP progress bar and streak counter  
- Leaderboard screen showing top users per mythology  
- Achievements and badges screen  
- Profile management screen  
- Offline storage implementation using SQLite or Hive  
- Push notification handling using Firebase Cloud Messaging  
- Deep linking support for notification actions  
- API integration via secure HTTPS endpoints  
- Local asset caching and offline lesson playback  

### Backend (API Server)

Framework: Node.js (Express)  
Database: PostgreSQL via Prisma ORM  
Asset Storage: AWS S3  
Notifications: Firebase Cloud Messaging (FCM)

APIs to be built:

**Authentication**  
- POST /register  
- POST /login  
- POST /reset-password  
- GET /profile  
- PUT /profile  

**Courses and Lessons**  
- GET /courses  
- GET /courses/:id/lessons  
- GET /lessons/:id  
- POST /lessons/:id/complete  

**XP, Streaks, Achievements**  
- POST /xp/add  
- GET /streak  
- POST /streak/update  
- GET /achievements  
- POST /achievements/unlock  

**Leaderboards**  
- GET /leaderboard/:course  
- POST /leaderboard/update  

**Notifications**  
- POST /notifications/send  

**Offline Data Sync**  
- POST /offline-sync  

Additional backend tasks:  
- OAuth 2.0 integration (Google, Apple) via Supabase Auth  
- JWT token management  
- XP and streak calculation logic  
- Leaderboard ranking calculation service  
- Push notification job queue  
- Asset delivery via Supabase CDN  
- Event logging for analytics  
- API request validation and rate limiting  

## Database Schema

**Users**  
- id (UUID)  
- email  
- password_hash  
- username  
- avatar_url  
- created_at  

**Courses**  
- id (UUID)  
- name  
- mythology_type  

**Lessons**  
- id (UUID)  
- course_id (UUID)  
- type (text, quiz, match, fill-in, image-match)  
- content (JSONB)  

**UserProgress**  
- id (UUID)  
- user_id (UUID)  
- course_id (UUID)  
- lesson_id (UUID)  
- status (not_started, in_progress, completed)  
- xp_earned (integer)  
- completed_at (timestamp)  

**Leaderboards**  
- id (UUID)  
- course_id (UUID)  
- user_id (UUID)  
- xp_total (integer)  

**Achievements**  
- id (UUID)  
- name  
- condition_type (xp_total, streak_days)  
- value (integer)  

**UserAchievements**  
- id (UUID)  
- user_id (UUID)  
- achievement_id (UUID)  
- unlocked_at (timestamp)  

## Asset and Content Delivery

- Images and lesson assets stored in AWS S3
- Delivered via AWS CloudFront CDN
- Lesson content stored as JSON blobs in the database  

## Analytics and Monitoring

- Log user events:
  - Lesson start and completion
  - XP earned
  - Streak updates
  - Achievements unlocked
- Use centralized logging (CloudWatch / Loggly)
- API performance monitoring (Prometheus / Grafana)  

## Security

- OAuth 2.0 + JWT authentication via Supabase Auth  
- HTTPS on all endpoints  
- Store tokens securely on user devices using platform-appropriate secure storage mechanisms  
- Rate limiting for public-facing APIs  
- GDPR-compliant user data handling and deletion APIs  
- Input validation and sanitization on all endpoints  

**End of Document**
