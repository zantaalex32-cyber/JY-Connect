import {
  JuniorYouthGroup,
  JuniorYouthParticipant,
  Animator,
  Meeting,
  ServiceProject,
  CampOrEvent,
  StudyCycle,
  Material,
  AppNotification,
  AppSettings,
  UserRole,
  ReportData,
  FollowUpTask,
  GroupTimelineEntry,
  GroupReflection,
  SupportResource,
  SafeguardingIncident,
  AuditLogEntry,
  SyncStatus
} from '../types';
import { INITIAL_MATERIALS } from '../data/materialsData';
import { INITIAL_SUPPORT_RESOURCES } from '../data/supportResourcesData';
import {
  SAMPLE_GROUPS,
  SAMPLE_PARTICIPANTS,
  SAMPLE_ANIMATORS,
  SAMPLE_MEETINGS,
  SAMPLE_SERVICE_PROJECTS,
  SAMPLE_EVENTS,
  SAMPLE_STUDY_CYCLES,
  SAMPLE_NOTIFICATIONS
} from '../data/sampleData';

const STORAGE_KEY = 'jy_connect_app_data_v2';
const BACKUP_STORAGE_KEY = 'jy_connect_auto_backup';

export interface AppStateData {
  groups: JuniorYouthGroup[];
  participants: JuniorYouthParticipant[];
  animators: Animator[];
  meetings: Meeting[];
  serviceProjects: ServiceProject[];
  events: CampOrEvent[];
  studyCycles: StudyCycle[];
  materials: Material[];
  notifications: AppNotification[];
  reports: ReportData[];
  tasks: FollowUpTask[];
  timelineEntries: GroupTimelineEntry[];
  reflections: GroupReflection[];
  supportResources: SupportResource[];
  safeguardingIncidents: SafeguardingIncident[];
  auditLogs: AuditLogEntry[];
  settings: AppSettings;
  currentRole: UserRole;
  isDemoDataActive: boolean;
  syncStatus: SyncStatus;
  offlineQueue: any[];
  lastBackupDate?: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  clusterName: 'Cluster Coordination Area',
  coordinatorContact: 'Cluster Coordinator Team',
  whatsappContact: '0114488963',
  privacyProtectionEnabled: true,
  language: 'en',
  sessionTimeoutMinutes: 30,
  autoSyncEnabled: true,
  notificationPreferences: {
    upcomingMeetings: true,
    overdueFollowups: true,
    camps: true,
    attendanceReminders: true
  }
};

export function getInitialEmptyData(): AppStateData {
  return {
    groups: [],
    participants: [],
    animators: [],
    meetings: [],
    serviceProjects: [],
    events: [],
    studyCycles: [],
    materials: INITIAL_MATERIALS,
    notifications: [
      {
        id: 'notif-welcome',
        title: 'Welcome to JY Connect',
        message: 'Your Junior Youth platform is ready. Begin by adding your group, animators, or exploring the Materials Library.',
        type: 'deadline',
        date: new Date().toISOString().split('T')[0],
        read: false
      }
    ],
    reports: [],
    tasks: [],
    timelineEntries: [],
    reflections: [],
    supportResources: INITIAL_SUPPORT_RESOURCES,
    safeguardingIncidents: [],
    auditLogs: [
      {
        id: 'log-init',
        timestamp: new Date().toISOString(),
        userRole: 'coordinator',
        userName: 'Cluster Coordinator',
        actionType: 'login',
        details: 'JY Connect platform initialized with clean community workspace.'
      }
    ],
    settings: DEFAULT_SETTINGS,
    currentRole: 'coordinator',
    isDemoDataActive: false,
    syncStatus: 'synced',
    offlineQueue: [],
    lastBackupDate: new Date().toISOString()
  };
}

export function getSamplePracticeData(): AppStateData {
  const sampleTasks: FollowUpTask[] = [
    {
      id: 'task-1',
      title: 'Visit Tariq’s parents regarding upcoming Spring Camp',
      assignedTo: 'Layla Al-Mansoor',
      dueDate: '2026-04-02',
      priority: 'high',
      status: 'in_progress',
      connectedType: 'youth',
      connectedId: 'jy-1',
      connectedName: 'Tariq Mansoor',
      notes: 'Ensure medical consent and photo permission form is signed in advance.',
      createdAt: '2026-03-20'
    },
    {
      id: 'task-2',
      title: 'Order art supplies and cardstock for illuminated quotations',
      assignedTo: 'Kareem Vance',
      dueDate: '2026-03-28',
      priority: 'medium',
      status: 'not_started',
      connectedType: 'group',
      connectedId: 'grp-1',
      connectedName: 'Cedar Park Champions',
      notes: 'Buy watercolor brushes, rulers, and calligraphy markers from local bookstore.',
      createdAt: '2026-03-22'
    },
    {
      id: 'task-3',
      title: 'Confirm bus transportation logistics for Pinecrest Camp',
      assignedTo: 'Samira Chen',
      dueDate: '2026-04-10',
      priority: 'high',
      status: 'not_started',
      connectedType: 'event',
      connectedId: 'ev-1',
      connectedName: 'Regional Youth Spring Camp',
      notes: 'Pick-up point at Cedar Community Center 8:00 AM sharp.',
      createdAt: '2026-03-21'
    }
  ];

  const sampleTimeline: GroupTimelineEntry[] = [
    {
      id: 'time-1',
      groupId: 'grp-1',
      date: '2025-09-12',
      title: 'Group Formed in Cedar Park',
      type: 'creation',
      description: 'First home visits conducted; 5 youth expressed keen interest in regular weekly empowerment gatherings.',
      authorRole: 'coordinator'
    },
    {
      id: 'time-2',
      groupId: 'grp-1',
      date: '2025-09-20',
      title: 'Inaugural Meeting Held',
      type: 'first_meeting',
      description: 'Youth chose their group name, recited opening devotions, and started Breezes of Confirmation.',
      authorRole: 'animator'
    },
    {
      id: 'time-3',
      groupId: 'grp-1',
      date: '2025-11-15',
      title: 'Completed Breezes of Confirmation',
      type: 'lesson_completed',
      description: 'Group celebrated completion with their families, sharing essays and songs on the theme of confirmation.',
      authorRole: 'animator'
    },
    {
      id: 'time-4',
      groupId: 'grp-1',
      date: '2026-01-25',
      title: 'Neighborhood Tree Stewardship Project',
      type: 'service_project',
      description: 'Planted 15 saplings in the local park in cooperation with the neighborhood council.',
      authorRole: 'animator'
    }
  ];

  const sampleReflections: GroupReflection[] = [
    {
      id: 'refl-1',
      meetingId: 'mtg-1',
      groupId: 'grp-1',
      date: '2026-03-21',
      animatorName: 'Layla Al-Mansoor',
      whatHappened: 'We studied Lesson 4 of Breezes of Confirmation exploring Musonda’s choice to persevere despite difficulties.',
      whatWentWell: 'The youth engaged deeply in discussing how encouragement from friends gives courage when facing tests.',
      challengesArose: 'One participant was initially reserved; pairing up for reading helped him speak freely.',
      whatGroupLearned: 'True joy comes from overcoming obstacles through spiritual effort rather than giving up.',
      whatToTryNext: 'Incorporate a cooperative drama skit illustrating mutual encouragement.',
      supportNeeded: 'None at this time; group is enthusiastic.',
      followUpActions: 'Bring calligraphy markers for quotation illumination next Saturday.',
      isPrivateToCoordinators: false
    }
  ];

  return {
    groups: SAMPLE_GROUPS,
    participants: SAMPLE_PARTICIPANTS,
    animators: SAMPLE_ANIMATORS,
    meetings: SAMPLE_MEETINGS,
    serviceProjects: SAMPLE_SERVICE_PROJECTS,
    events: SAMPLE_EVENTS,
    studyCycles: SAMPLE_STUDY_CYCLES,
    materials: INITIAL_MATERIALS,
    notifications: SAMPLE_NOTIFICATIONS,
    reports: [
      {
        id: 'rep-sample-1',
        title: 'Quarter 1 Cluster Progress & Quality Review',
        generatedAt: '2026-03-25',
        authorRole: 'coordinator',
        period: 'Q1 2026 (Jan - Mar)',
        totalGroups: 3,
        totalJuniorYouth: 7,
        totalAnimators: 4,
        totalMeetings: 16,
        averageAttendancePct: 88,
        totalServiceProjects: 2,
        totalEvents: 2,
        progress: 'Two active groups established regular weekly study cycles with Breezes of Confirmation and Wellspring of Joy. Participation has been consistent.',
        challenges: 'Cedar Park neighborhood has eager parents and youth but needs 2 trained animators before launching weekly sessions.',
        plans: 'Hold Ruhi Book 5 intensive workshop in mid-April to train 4 new animators, and coordinate the spring camp.',
        achievements: 'High parent engagement with 100% consent forms recorded, zero dropouts.',
        lessonsLearned: 'Regular animator study circle creates mutual accompaniment and enthusiasm.',
        supportNeeded: 'Additional copies of Ruhi Book 5 for the cluster library.'
      }
    ],
    tasks: sampleTasks,
    timelineEntries: sampleTimeline,
    reflections: sampleReflections,
    supportResources: INITIAL_SUPPORT_RESOURCES,
    safeguardingIncidents: [],
    auditLogs: [
      {
        id: 'log-sample-1',
        timestamp: '2026-03-25T09:30:00Z',
        userRole: 'coordinator',
        userName: 'Cluster Coordinator',
        actionType: 'login',
        details: 'Logged into Cluster 4 management dashboard.'
      },
      {
        id: 'log-sample-2',
        timestamp: '2026-03-25T10:15:00Z',
        userRole: 'coordinator',
        userName: 'Cluster Coordinator',
        actionType: 'export_data',
        details: 'Generated Q1 2026 cluster report narrative.'
      }
    ],
    settings: {
      clusterName: 'Cluster 4 - Metropolitan Area',
      coordinatorContact: 'Cluster Institute Coordinator',
      whatsappContact: '0114488963',
      privacyProtectionEnabled: true,
      language: 'en',
      sessionTimeoutMinutes: 30,
      autoSyncEnabled: true,
      notificationPreferences: {
        upcomingMeetings: true,
        overdueFollowups: true,
        camps: true,
        attendanceReminders: true
      }
    },
    currentRole: 'coordinator',
    isDemoDataActive: true,
    syncStatus: 'synced',
    offlineQueue: [],
    lastBackupDate: new Date().toISOString()
  };
}

export function loadStoredData(): AppStateData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialEmptyData();
      saveStoredData(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return {
      groups: parsed.groups || [],
      participants: parsed.participants || [],
      animators: parsed.animators || [],
      meetings: parsed.meetings || [],
      serviceProjects: parsed.serviceProjects || [],
      events: parsed.events || [],
      studyCycles: parsed.studyCycles || [],
      materials: parsed.materials && parsed.materials.length > 0 ? parsed.materials : INITIAL_MATERIALS,
      notifications: parsed.notifications || [],
      reports: parsed.reports || [],
      tasks: parsed.tasks || [],
      timelineEntries: parsed.timelineEntries || [],
      reflections: parsed.reflections || [],
      supportResources: parsed.supportResources && parsed.supportResources.length > 0 ? parsed.supportResources : INITIAL_SUPPORT_RESOURCES,
      safeguardingIncidents: parsed.safeguardingIncidents || [],
      auditLogs: parsed.auditLogs || [],
      settings: parsed.settings ? { ...DEFAULT_SETTINGS, ...parsed.settings } : DEFAULT_SETTINGS,
      currentRole: parsed.currentRole || 'coordinator',
      isDemoDataActive: Boolean(parsed.isDemoDataActive),
      syncStatus: 'synced',
      offlineQueue: parsed.offlineQueue || [],
      lastBackupDate: parsed.lastBackupDate || new Date().toISOString()
    };
  } catch (err) {
    console.error('Failed to parse stored JY Connect data', err);
    return getInitialEmptyData();
  }
}

export function saveStoredData(data: AppStateData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Also save an automated rotating backup snapshot
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify({
      timestamp: new Date().toISOString(),
      payload: data
    }));
  } catch (err) {
    console.error('Failed to save JY Connect data', err);
  }
}

export function logAuditEvent(
  prevLogs: AuditLogEntry[],
  actionType: AuditLogEntry['actionType'],
  role: UserRole,
  details: string,
  entityType?: string,
  entityId?: string
): AuditLogEntry[] {
  const newEntry: AuditLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    userRole: role,
    userName: role === 'coordinator' ? 'Cluster Coordinator' : role === 'animator' ? 'Group Animator' : 'System Admin',
    actionType,
    details,
    entityType,
    entityId
  };
  return [newEntry, ...prevLogs.slice(0, 199)]; // Keep latest 200 logs
}

export function exportDataAsJsonFile(data: AppStateData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `jy-connect-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

