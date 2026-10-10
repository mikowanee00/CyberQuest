/* =====================================================================
 * config/constants.js — Game rules shared by the server
 * (The client has matching values in client/src/logic/scoring.js.)
 * ===================================================================== */

const SCORING = {
  PASS_PERCENT: 70,          // score needed to complete a lesson and earn its badge
  XP_PER_CORRECT: 10,        // XP per correct answer (best attempt counts)
  XP_COMPLETION_BONUS: 20,   // one-off XP for passing a lesson
  MAX_BONUS_PER_QUESTION: 5, // speed bonus limit in the final challenge
  MAX_QUESTIONS: 20          // safety limit for one quiz submission
};

// Lesson titles (used to make admin tables and CSV files readable)
const LESSONS = [
  { id: 1, title: 'What Is Phishing?' },
  { id: 2, title: 'Spot the Fake Email' },
  { id: 3, title: 'Strong vs. Weak Passwords' },
  { id: 4, title: 'Social Engineering' },
  { id: 5, title: 'Safe Social Media Habits' },
  { id: 6, title: 'Public Wi-Fi Dangers' },
  { id: 7, title: 'Two-Factor Authentication' },
  { id: 8, title: 'Recognizing Scams' },
  { id: 9, title: 'Protecting Personal Information' },
  { id: 10, title: 'Malware & Ransomware' },
  { id: 11, title: 'Final Challenge' }
];

// Lessons 1–10 are regular lessons; 11 is the final challenge.
const REGULAR_LESSON_COUNT = 10;
const FINAL_LESSON_ID = 11;
const MAX_LESSON_ID = 11;

// Ranks unlocked by total XP
const LEVELS = [
  { min: 0, name: 'Phish Food' },
  { min: 100, name: 'Click Cadet' },
  { min: 250, name: 'Scam Spotter' },
  { min: 450, name: 'Firewall Friend' },
  { min: 650, name: 'Cyber Detective' }
];

const lessonTitle = id => (LESSONS.find(l => l.id === Number(id)) || {}).title || `Lesson ${id}`;

module.exports = { SCORING, LESSONS, LEVELS, lessonTitle, REGULAR_LESSON_COUNT, FINAL_LESSON_ID, MAX_LESSON_ID };
