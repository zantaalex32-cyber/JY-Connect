export type UserRole = 'admin' | 'coordinator' | 'animator' | 'viewer';

export type GroupStatus = 'active' | 'forming' | 'paused' | 'concluded';

export type LanguageCode = 'en' | 'sw';

export type SyncStatus = 'online' | 'offline' | 'synchronizing' | 'synced';

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

export interface ParentConsentRecord {
  consentGiven: boolean;
  consentDate: string;
  photoReleaseAllowed: boolean;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalNotes: string;
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
  consent?: ParentConsentRecord;
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
  seriesId?: string;
  reflectionJournalId?: string;
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
  originalUrl?: string;
  publicationInfo?: string;
  language: string;
  dateAdded: string;
  trustLevel: SourceTrustLevel;
  isOfficialSource: boolean;
  bookmarked?: boolean;
  ageRange?: string;
  topic?: string;
  isOfflineAvailable?: boolean;
  downloadable?: boolean;
  relatedMaterialIds?: string[];
  relatedActivitySuggestions?: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'meeting' | 'attendance' | 'event' | 'animator' | 'service' | 'deadline' | 'task' | 'safeguarding';
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
  achievements?: string;
  lessonsLearned?: string;
  supportNeeded?: string;
}

export interface AppSettings {
  clusterName: string;
  coordinatorContact: string;
  whatsappContact: string;
  privacyProtectionEnabled: boolean;
  language: LanguageCode;
  sessionTimeoutMinutes: number;
  autoSyncEnabled: boolean;
  notificationPreferences: {
    upcomingMeetings: boolean;
    overdueFollowups: boolean;
    camps: boolean;
    attendanceReminders: boolean;
  };
}

// -------------------------------------------------------------
// NEW ARCHITECTURAL TYPES (Follow-ups, Timeline, Journal, Support, Audit)
// -------------------------------------------------------------

export type FollowUpStatus = 'not_started' | 'in_progress' | 'completed' | 'cancelled';
export type FollowUpPriority = 'high' | 'medium' | 'low';
export type FollowUpConnectedType =
  | 'meeting'
  | 'youth'
  | 'family'
  | 'group'
  | 'animator'
  | 'service'
  | 'event'
  | 'report'
  | 'general';

export interface FollowUpTask {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  priority: FollowUpPriority;
  status: FollowUpStatus;
  connectedType: FollowUpConnectedType;
  connectedId?: string;
  connectedName?: string;
  notes: string;
  createdAt: string;
  completedAt?: string;
}

export type TimelineEntryType =
  | 'creation'
  | 'first_meeting'
  | 'participant_joined'
  | 'lesson_completed'
  | 'service_project'
  | 'camp'
  | 'challenge'
  | 'milestone'
  | 'custom_note';

export interface GroupTimelineEntry {
  id: string;
  groupId: string;
  date: string;
  title: string;
  type: TimelineEntryType;
  description: string;
  authorRole?: UserRole;
  authorName?: string;
}

export interface GroupReflection {
  id: string;
  meetingId: string;
  groupId: string;
  date: string;
  animatorName: string;
  whatHappened: string;
  whatWentWell: string;
  challengesArose: string;
  whatGroupLearned: string;
  whatToTryNext: string;
  supportNeeded: string;
  followUpActions: string;
  isPrivateToCoordinators: boolean;
}

export type SupportCategory =
  | 'training'
  | 'session_planning'
  | 'discussion'
  | 'arts'
  | 'games'
  | 'service_ideas'
  | 'reflection'
  | 'parent_engagement'
  | 'camp_planning'
  | 'faq'
  | 'official_resources';

export interface SupportResource {
  id: string;
  title: string;
  category: SupportCategory;
  description: string;
  details: string;
  authorOrSource: string;
  tags: string[];
  isOfficial: boolean;
  dateAdded: string;
  sourceUrl?: string;
}

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'open' | 'under_review' | 'resolved';

export interface SafeguardingIncident {
  id: string;
  date: string;
  reportedByRole: UserRole;
  reporterName: string;
  title: string;
  severity: IncidentSeverity;
  description: string;
  actionsTaken: string;
  status: IncidentStatus;
  confidentialNotes: string;
  followUpDate?: string;
}

export type AuditActionType =
  | 'login'
  | 'role_switch'
  | 'create_record'
  | 'update_record'
  | 'delete_record'
  | 'edit_participant'
  | 'delete_group'
  | 'delete_participant'
  | 'export_data'
  | 'safeguarding_record'
  | 'backup_created'
  | 'restore_data'
  | 'sync';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userRole: UserRole;
  userName: string;
  actionType: AuditActionType;
  details: string;
  entityType?: string;
  entityId?: string;
}
