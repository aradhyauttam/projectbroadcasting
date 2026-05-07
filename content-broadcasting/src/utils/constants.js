export const ROLES = {
  TEACHER: 'teacher',
  PRINCIPAL: 'principal',
}

export const CONTENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

export const SCHEDULE_STATUS = {
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  EXPIRED: 'expired',
}

export const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Arts',
  'Physical Education',
  'Social Studies',
]

export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif']
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif']
export const MAX_FILE_SIZE_MB = 10
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

export const TOKEN_KEY = 'ebs_token'
export const USER_KEY = 'ebs_user'

export const POLL_INTERVAL_MS = 30_000 // 30s for live page auto-refresh