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
  ReportData
} from '../types';
import { INITIAL_MATERIALS } from '../data/materialsData';
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

const STORAGE_KEY = 'jy_connect_app_data_v1';

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
  settings: AppSettings;
  currentRole: UserRole;
  isDemoDataActive: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  clusterName: 'Cluster Coordination Area',
  coordinatorContact: 'Cluster Coordinator Team',
  whatsappContact: '0114488963',
  privacyProtectionEnabled: true
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
    settings: DEFAULT_SETTINGS,
    currentRole: 'coordinator',
    isDemoDataActive: false
  };
}

export function getSamplePracticeData(): AppStateData {
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
        plans: 'Hold Ruhi Book 5 intensive workshop in mid-April to train 4 new animators, and coordinate the spring camp.'
      }
    ],
    settings: {
      clusterName: 'Cluster 4 - Metropolitan Area',
      coordinatorContact: 'Cluster Institute Coordinator',
      whatsappContact: '0114488963',
      privacyProtectionEnabled: true
    },
    currentRole: 'coordinator',
    isDemoDataActive: true
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
    // Ensure all keys exist
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
      settings: parsed.settings || DEFAULT_SETTINGS,
      currentRole: parsed.currentRole || 'coordinator',
      isDemoDataActive: Boolean(parsed.isDemoDataActive)
    };
  } catch (err) {
    console.error('Failed to parse stored JY Connect data', err);
    return getInitialEmptyData();
  }
}

export function saveStoredData(data: AppStateData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save JY Connect data', err);
  }
}
