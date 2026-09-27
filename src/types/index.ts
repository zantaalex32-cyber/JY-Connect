export type UserRole = 'admin' | 'coordinator' | 'animator' | 'viewer';

export type GroupStatus = 'active' | 'forming' | 'paused' | 'concluded';

export interface JuniorYouthGroup {
  id: string;
  name: string;
  location: string;
  neighborhood: string;
  areaOfActivity: string;
  meetingVenue: string;
  meetingDay: string;
  meetingTime: string;
  animatorIds: string[];
  jyParticipantIds: string[];
  startDate: string;
  status: GroupStatus;
  goals: string;
  notes: string;
  activitiesSummary: string;
  currentMaterialId?: string;
  currentSection?: string;
}

export interface JuniorYouthParticipant {
  id: string;
  name: string;
  age: number;
  dateOfBirth?: string;
  groupId: string;
  neighborhood: string;
  parentGuardianName: string;
  parentGuardianContact: string;
  dateJoined: string;
  attendanceCount: number;
  absencesCount: number;
  participationNotes: string;
  activitiesJoined: string[];
  serviceProjectsJoined: string[];
  notes: string;
}

export type TrainingStatus = 'in_training' | 'book_5_completed' | 'fully_certified' | 'orientation';

export interface Animator {
  id: string;
  name: string;
  contact: string;
  email: string;
  groupIds: string[];
  trainingStatus: TrainingStatus;
  booksStudied: string[];
  experienceYears: number;
  availability: 'weekends' | 'weekdays' | 'flexible' | 'limited';
  responsibilities: string;
  activities: string;
  notes: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'excused' | 'late';

export interface Meeting {
  id: string;
  groupId: string;
  date: string;
  time: string;
  location: string;
  sessionTopic: string;
  materialId?: string;
  materialTitle?: string;
  unitOrLesson?: string;
  activities: string;
  attendance: Record<string, AttendanceStatus>; // participantId -> status
  reflection: string;
  followUpActions: string;
  notes: string;
  isRecurring?: boolean;
  recurringPattern?: 'weekly' | 'biweekly' | 'monthly';
}

export interface StudyCycle {
  id: string;
  groupId: string;
  materialId: string;
  materialTitle: string;
  currentSection: string;
  totalSections: number;
  completedSections: number;
  scheduledSessionsCount: number;
  completedSessionsCount: number;
  startDate: string;
  targetCompletionDate?: string;
  notes: string;
  discussionQuestions: string[];
  reflections: string[];
}

export interface TaskItem {
  id: string;
  title: string;
  assignedTo: string;
  completed: boolean;
}

export type ServiceProjectStatus = 'planned' | 'in_progress' | 'completed';

export interface ServiceProject {
  id: string;
  projectName: string;
  description: string;
  groupId: string;
  location: string;
  date: string;
  participantIds: string[];
  goals: string;
  tasks: TaskItem[];
  assignedResponsibilities: string;
  progressStatus: ServiceProjectStatus;
  results: string;
  reflection: string;
  followUp: string;
}

export type EventType =
  | 'camp'
  | 'animator_training'
  | 'cluster_activity'
  | 'reflection_meeting'
  | 'sports_day'
  | 'service_day'
  | 'gathering';

export interface EventScheduleItem {
  time: string;
  activity: string;
}

export interface CampOrEvent {
  id: string;
  title: string;
  type: EventType;
  startDate: string;
  endDate: string;
  location: string;
  registeredJyIds: string[];
  registeredAnimatorIds: string[];
  schedule: EventScheduleItem[];
  activitiesDescription: string;
  announcements: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
}

export type MaterialType =
  | 'text'
  | 'study_material'
  | 'animator_resource'
  | 'training_material'
  | 'story'
  | 'quotation'
  | 'activity'
  | 'art_activity'
  | 'game'
  | 'service_activity'
  | 'reflection'
  | 'discussion'
  | 'camp_resource'
  | 'music_song'
  | 'parent_resource'
  | 'community_building';

export type SourceTrustLevel = 'official' | 'reputable' | 'user_uploaded';

export interface Material {
  id: string;
  title: string;
  authorOrg: string;
  description: string;
  materialType: MaterialType;
  subjectCategory: string;
  source: string;
  sourceUrl?: string;
  publicationInfo?: string;
  language: string;
  dateAdded: string;
  trustLevel: SourceTrustLevel;
  isOfficialSource: boolean;
  bookmarked?: boolean;
  ageRange?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'meeting' | 'attendance' | 'event' | 'animator' | 'service' | 'deadline';
  date: string;
  read: boolean;
  actionUrl?: string;
}

export interface ReportData {
  id: string;
  title: string;
  generatedAt: string;
  authorRole: UserRole;
  period: string;
  totalGroups: number;
  totalJuniorYouth: number;
  totalAnimators: number;
  totalMeetings: number;
  averageAttendancePct: number;
  totalServiceProjects: number;
  totalEvents: number;
  progress: string;
  challenges: string;
  plans: string;
}

export interface AppSettings {
  clusterName: string;
  coordinatorContact: string;
  whatsappContact: string;
  privacyProtectionEnabled: boolean;
}
