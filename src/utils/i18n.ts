import { LanguageCode } from '../types';

export interface Translations {
  // Navigation & Header
  dashboard: string;
  myWeek: string;
  groups: string;
  participants: string;
  animators: string;
  meetings: string;
  study: string;
  service: string;
  events: string;
  calendar: string;
  materials: string;
  reports: string;
  cluster: string;
  supportCenter: string;
  tasks: string;
  settings: string;
  search: string;
  notifications: string;
  assistant: string;
  online: string;
  offline: string;
  synchronizing: string;
  synced: string;

  // General Actions
  addNew: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  viewDetails: string;
  filter: string;
  all: string;
  exportData: string;
  importData: string;
  markComplete: string;
  download: string;

  // Roles
  coordinator: string;
  animator: string;
  admin: string;
  viewer: string;

  // Empty states
  noGroups: string;
  createFirstGroup: string;
  noParticipants: string;
  addFirstParticipant: string;
  noAnimators: string;
  registerFirstAnimator: string;
  noMeetings: string;
  scheduleMeeting: string;
  noTasks: string;
  createTask: string;

  // Dashboard & Metrics
  activeGroups: string;
  juniorYouthTotal: string;
  activeAnimators: string;
  clusterAttendance: string;
  groupsAttention: string;
  overdueTasks: string;
  recentActivities: string;
  weeklySchedule: string;

  // Safeguarding & Privacy
  safeguarding: string;
  privacyProtected: string;
  consentRecorded: string;
  emergencyContact: string;

  // Assistant
  askAssistant: string;
  assistantSubtitle: string;
}

export const DICTIONARY: Record<LanguageCode, Translations> = {
  en: {
    dashboard: 'Dashboard',
    myWeek: 'My Week',
    groups: 'Groups',
    participants: 'Junior Youth',
    animators: 'Animators',
    meetings: 'Meetings',
    study: 'Study Cycles',
    service: 'Service',
    events: 'Events & Camps',
    calendar: 'Calendar',
    materials: 'Materials',
    reports: 'Reports',
    cluster: 'Cluster Map',
    supportCenter: 'Support Center',
    tasks: 'Follow-ups',
    settings: 'Settings',
    search: 'Global Search',
    notifications: 'Notifications',
    assistant: 'JY Assistant',
    online: 'Online',
    offline: 'Offline',
    synchronizing: 'Synchronizing...',
    synced: 'Synced',

    addNew: 'Add New',
    save: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    viewDetails: 'View Details',
    filter: 'Filter',
    all: 'All',
    exportData: 'Export',
    importData: 'Import',
    markComplete: 'Mark Complete',
    download: 'Download',

    coordinator: 'Coordinator',
    animator: 'Animator',
    admin: 'Administrator',
    viewer: 'Viewer',

    noGroups: 'No Junior Youth groups yet.',
    createFirstGroup: 'Create your first group',
    noParticipants: 'No Junior Youth participants registered yet.',
    addFirstParticipant: 'Enroll a participant',
    noAnimators: 'No animators registered yet.',
    registerFirstAnimator: 'Register an animator',
    noMeetings: 'No meetings scheduled yet.',
    scheduleMeeting: 'Schedule a meeting',
    noTasks: 'No follow-up tasks recorded.',
    createTask: 'Create a follow-up task',

    activeGroups: 'Active Groups',
    juniorYouthTotal: 'Junior Youth',
    activeAnimators: 'Animators',
    clusterAttendance: 'Cluster Attendance',
    groupsAttention: 'Groups Requiring Attention',
    overdueTasks: 'Outstanding Follow-ups',
    recentActivities: 'Recent Activities',
    weeklySchedule: 'Weekly Schedule',

    safeguarding: 'Safeguarding & Consent',
    privacyProtected: 'Minor contact details masked for privacy',
    consentRecorded: 'Parent Consent Recorded',
    emergencyContact: 'Emergency Contact',

    askAssistant: 'Ask JY Assistant',
    assistantSubtitle: 'Planning, activities, and reflection support for animators and coordinators'
  },
  sw: {
    dashboard: 'Dashibodi',
    myWeek: 'Wiki Yangu',
    groups: 'Vikundi',
    participants: 'Vijana Chipukizi',
    animators: 'Wawezeshaji',
    meetings: 'Mikutano',
    study: 'Mizunguko ya Masomo',
    service: 'Miradi ya Huduma',
    events: 'Kambi na Matukio',
    calendar: 'Kalenda',
    materials: 'Vitabu na Nyenzo',
    reports: 'Ripoti za Eneo',
    cluster: 'Ramani ya Eneo',
    supportCenter: 'Kituo cha Msaada',
    tasks: 'Ufuatiliaji',
    settings: 'Mipangilio',
    search: 'Tafuta Kote',
    notifications: 'Taarifa',
    assistant: 'Msaidizi wa JY',
    online: 'Uko Mtandaoni',
    offline: 'Nje ya Mtandao',
    synchronizing: 'Inalandanisha...',
    synced: 'Imelandanishwa',

    addNew: 'Ongeza Mpya',
    save: 'Hifadhi Mabadiliko',
    cancel: 'Ghairi',
    delete: 'Futa',
    edit: 'Hariri',
    viewDetails: 'Angalia Maelezo',
    filter: 'Chuja',
    all: 'Yote',
    exportData: 'Pakua Data',
    importData: 'Ingiza Data',
    markComplete: 'Weka Imekamilika',
    download: 'Pakua',

    coordinator: 'Mratibu',
    animator: 'Mwezeshaji',
    admin: 'Msimamizi Mkuu',
    viewer: 'Mtazamaji',

    noGroups: 'Bado hakuna vikundi vya vijana chipukizi.',
    createFirstGroup: 'Unda kikundi cha kwanza',
    noParticipants: 'Bado hakuna vijana waliosajiliwa.',
    addFirstParticipant: 'Sajili kijana chipukizi',
    noAnimators: 'Bado hakuna wawezeshaji waliosajiliwa.',
    registerFirstAnimator: 'Sajili mwezeshaji',
    noMeetings: 'Bado hakuna mikutano iliyopangwa.',
    scheduleMeeting: 'Panga mkutano',
    noTasks: 'Hakuna majukumu ya ufuatiliaji.',
    createTask: 'Tengeneza jukumu la ufuatiliaji',

    activeGroups: 'Vikundi Vinavyofanya Kazi',
    juniorYouthTotal: 'Vijana Chipukizi',
    activeAnimators: 'Wawezeshaji',
    clusterAttendance: 'Mahudhurio ya Eneo',
    groupsAttention: 'Vikundi Vinavyohitaji Makini',
    overdueTasks: 'Ufuatiliaji Unaosubiri',
    recentActivities: 'Shughuli za Hivi Karibuni',
    weeklySchedule: 'Ratiba ya Wiki Hii',

    safeguarding: 'Ulinzi wa Watoto na Idhini',
    privacyProtected: 'Mawasiliano yanalindwa kwa faragha',
    consentRecorded: 'Idhini ya Mzazi Imerekodiwa',
    emergencyContact: 'Mawasiliano ya Dharura',

    askAssistant: 'Uliza Msaidizi wa JY',
    assistantSubtitle: 'Msaada wa kupanga mikutano, michezo, na kutafakari'
  }
};

export function getTranslation(lang: LanguageCode, key: keyof Translations): string {
  const dict = DICTIONARY[lang] || DICTIONARY.en;
  return dict[key] || DICTIONARY.en[key] || String(key);
}
