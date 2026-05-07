import { uuid } from '@/utils/helpers'

// ─── Mock Users ────────────────────────────────────────────────────────────
export const MOCK_USERS = [
  {
    id: 'user-teacher-001',
    name: 'Aradhya uttam',
    email: 'teacher@demo.com',
    password: 'password123',
    role: 'teacher',
    subject: 'Mathematics',
    avatar: null,
  },
  {
    id: 'user-teacher-002',
    name: 'Arjun Mehta',
    email: 'teacher2@demo.com',
    password: 'password123',
    role: 'teacher',
    subject: 'Science',
    avatar: null,
  },
  {
    id: 'user-principal-001',
    name: 'Dr. Ramesh Gupta',
    email: 'principal@demo.com',
    password: 'password123',
    role: 'principal',
    avatar: null,
  },
]

// ─── Mock Content Items ────────────────────────────────────────────────────
const now = new Date()
const past = (h) => new Date(now - h * 36e5).toISOString()
const future = (h) => new Date(now.getTime() + h * 36e5).toISOString()

export const MOCK_CONTENT = [
  {
    id: 'c-001',
    title: 'Introduction to Quadratic Equations',
    subject: 'Mathematics',
    description: 'A comprehensive overview of quadratic equations with solved examples and visual aids.',
    fileUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
    fileName: 'quadratic-equations.jpg',
    fileSize: 1245678,
    fileType: 'image/jpeg',
    status: 'approved',
    teacherId: 'user-teacher-001',
    teacherName: 'Aradhya uttam',
    startTime: past(2),
    endTime: future(4),
    rotationDuration: 30,
    rejectionReason: null,
    createdAt: past(5),
    updatedAt: past(1),
  },
  {
    id: 'c-002',
    title: 'Photosynthesis — Visual Guide',
    subject: 'Science',
    description: 'Illustrated guide explaining the process of photosynthesis for Class 8 students.',
    fileUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80',
    fileName: 'photosynthesis-guide.png',
    fileSize: 2345000,
    fileType: 'image/png',
    status: 'pending',
    teacherId: 'user-teacher-001',
    teacherName: 'Aradhya uttam',
    startTime: future(1),
    endTime: future(6),
    rotationDuration: 45,
    rejectionReason: null,
    createdAt: past(3),
    updatedAt: past(3),
  },
  {
    id: 'c-003',
    title: 'World War II — Key Battles',
    subject: 'History',
    description: 'A visual timeline of key battles and events during World War II.',
    fileUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&q=80',
    fileName: 'ww2-battles.png',
    fileSize: 3412000,
    fileType: 'image/png',
    status: 'rejected',
    teacherId: 'user-teacher-001',
    teacherName: 'Aradhya uttam',
    startTime: past(10),
    endTime: past(4),
    rotationDuration: 60,
    rejectionReason: 'Image resolution is too low. Please upload a higher quality version.',
    createdAt: past(20),
    updatedAt: past(15),
  },
  {
    id: 'c-004',
    title: 'Newton\'s Laws of Motion',
    subject: 'Physics',
    description: 'Animated infographic explaining all three of Newton\'s laws of motion with real-world examples.',
    fileUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    fileName: 'newtons-laws.gif',
    fileSize: 5120000,
    fileType: 'image/gif',
    status: 'pending',
    teacherId: 'user-teacher-002',
    teacherName: 'Arjun Mehta',
    startTime: future(2),
    endTime: future(8),
    rotationDuration: 30,
    rejectionReason: null,
    createdAt: past(1),
    updatedAt: past(1),
  },
  {
    id: 'c-005',
    title: 'Periodic Table — Modern Version',
    subject: 'Chemistry',
    description: 'High-resolution periodic table with element groups color-coded for easy learning.',
    fileUrl: 'https://images.unsplash.com/photo-1628863353691-0071c8c1ded5?w=800&q=80',
    fileName: 'periodic-table.png',
    fileSize: 4200000,
    fileType: 'image/png',
    status: 'approved',
    teacherId: 'user-teacher-002',
    teacherName: 'Arjun Mehta',
    startTime: past(6),
    endTime: future(2),
    rotationDuration: 90,
    rejectionReason: null,
    createdAt: past(8),
    updatedAt: past(6),
  },
  {
    id: 'c-006',
    title: 'Grammar — Parts of Speech',
    subject: 'English',
    description: 'Clear and colorful chart of all parts of speech with examples.',
    fileUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
    fileName: 'parts-of-speech.jpg',
    fileSize: 1890000,
    fileType: 'image/jpeg',
    status: 'approved',
    teacherId: 'user-teacher-001',
    teacherName: 'Aradhya uttam',
    startTime: past(12),
    endTime: past(6),
    rotationDuration: 30,
    rejectionReason: null,
    createdAt: past(14),
    updatedAt: past(12),
  },
  {
    id: 'c-007',
    title: 'Indian Geography — River Systems',
    subject: 'Geography',
    description: 'Detailed map showing all major river systems in India.',
    fileUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80',
    fileName: 'indian-rivers.png',
    fileSize: 6100000,
    fileType: 'image/png',
    status: 'pending',
    teacherId: 'user-teacher-001',
    teacherName: 'Aradhya uttam',
    startTime: future(3),
    endTime: future(9),
    rotationDuration: 60,
    rejectionReason: null,
    createdAt: past(0.5),
    updatedAt: past(0.5),
  },
  {
    id: 'c-008',
    title: 'Human Digestive System',
    subject: 'Biology',
    description: 'Anatomical diagram of the human digestive system with labeled organs.',
    fileUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
    fileName: 'digestive-system.jpg',
    fileSize: 2750000,
    fileType: 'image/jpeg',
    status: 'rejected',
    teacherId: 'user-teacher-002',
    teacherName: 'Arjun Mehta',
    startTime: past(24),
    endTime: past(18),
    rotationDuration: 45,
    rejectionReason: 'Content does not meet curriculum standards for this grade level. Please revise.',
    createdAt: past(48),
    updatedAt: past(24),
  },
]

// Utility to simulate API delay
export const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms))

// In-memory store (simulates a backend DB for the session)
let contentStore = [...MOCK_CONTENT]

export const getContentStore = () => [...contentStore]

export const addContent = (item) => {
  contentStore = [item, ...contentStore]
  return item
}

export const updateContent = (id, updates) => {
  contentStore = contentStore.map((c) => (c.id === id ? { ...c, ...updates } : c))
  return contentStore.find((c) => c.id === id)
}