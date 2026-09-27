import { JuniorYouthGroup, JuniorYouthParticipant, Animator, Meeting, ServiceProject, CampOrEvent, StudyCycle, ReportData, AppNotification } from '../types';

export const SAMPLE_GROUPS: JuniorYouthGroup[] = [
  {
    id: 'grp-1',
    name: 'Breezes of Hope Group',
    location: 'North Ward Community Centre',
    neighborhood: 'North Ward',
    areaOfActivity: 'Cluster 4 - Sub-District A',
    meetingVenue: 'Room 2B, Community Centre / Garden Pavilion',
    meetingDay: 'Saturday',
    meetingTime: '10:00 AM - 12:00 PM',
    animatorIds: ['anim-1', 'anim-2'],
    jyParticipantIds: ['jy-1', 'jy-2', 'jy-3', 'jy-4'],
    startDate: '2026-01-17',
    status: 'active',
    goals: 'Complete Breezes of Confirmation and organize a community neighborhood tree-planting project.',
    notes: 'The group shows great enthusiasm for group singing and consultative decision-making.',
    activitiesSummary: 'Study sessions, cooperative soccer games, family presentation.',
    currentMaterialId: 'mat-breezes',
    currentSection: 'Lesson 8'
  },
  {
    id: 'grp-2',
    name: 'Wellspring Youth Circle',
    location: 'Hillside Neighborhood Library',
    neighborhood: 'Hillside',
    areaOfActivity: 'Cluster 4 - Sub-District B',
    meetingVenue: 'Community Room',
    meetingDay: 'Sunday',
    meetingTime: '02:30 PM - 04:30 PM',
    animatorIds: ['anim-3'],
    jyParticipantIds: ['jy-5', 'jy-6', 'jy-7'],
    startDate: '2026-02-01',
    status: 'active',
    goals: 'Cultivate deep friendships and complete study of Wellspring of Joy.',
    notes: 'Planning to recruit a co-animator to assist with expanding to more youth.',
    activitiesSummary: 'Storytelling, drama improvisation, tutoring younger children.',
    currentMaterialId: 'mat-wellspring',
    currentSection: 'Lesson 4'
  },
  {
    id: 'grp-3',
    name: 'Cedar Park New Group',
    location: 'Cedar Park Recreation Hall',
    neighborhood: 'Cedar Park',
    areaOfActivity: 'Cluster 4 - Sub-District C',
    meetingVenue: 'Cedar Park Lounge',
    meetingDay: 'Friday',
    meetingTime: '04:00 PM - 05:30 PM',
    animatorIds: [],
    jyParticipantIds: [],
    startDate: '2026-03-20',
    status: 'forming',
    goals: 'Currently reaching out to parents and securing two trained animators.',
    notes: 'Requires immediate animator assignment from cluster coordinator.',
    activitiesSummary: 'Informational home visits with families.',
  }
];

export const SAMPLE_PARTICIPANTS: JuniorYouthParticipant[] = [
  {
    id: 'jy-1',
    name: 'Tariq M.',
    age: 12,
    dateOfBirth: '2014-04-12',
    groupId: 'grp-1',
    neighborhood: 'North Ward',
    parentGuardianName: 'Farid M.',
    parentGuardianContact: '082-555-0192',
    dateJoined: '2026-01-17',
    attendanceCount: 8,
    absencesCount: 1,
    participationNotes: 'Very active in consultations and leads singing warm-ups.',
    activitiesJoined: ['Reading Lessons 1-7', 'Park Clean-up', 'Neighborhood Survey'],
    serviceProjectsJoined: ['proj-1'],
    notes: 'Exhibits thoughtful reflections on personal choices and friendship.'
  },
  {
    id: 'jy-2',
    name: 'Amira K.',
    age: 13,
    dateOfBirth: '2013-09-03',
    groupId: 'grp-1',
    neighborhood: 'North Ward',
    parentGuardianName: 'Zainab K.',
    parentGuardianContact: '083-555-0144',
    dateJoined: '2026-01-17',
    attendanceCount: 9,
    absencesCount: 0,
    participationNotes: 'Consistently on time, brings great artistic creativity to posters.',
    activitiesJoined: ['Calligraphy Art', 'Lessons 1-7', 'Drama Skit'],
    serviceProjectsJoined: ['proj-1'],
    notes: 'Expressed strong interest in mentoring younger children.'
  },
  {
    id: 'jy-3',
    name: 'David S.',
    age: 12,
    dateOfBirth: '2014-02-18',
    groupId: 'grp-1',
    neighborhood: 'North Ward',
    parentGuardianName: 'Elena S.',
    parentGuardianContact: '084-555-0188',
    dateJoined: '2026-01-24',
    attendanceCount: 7,
    absencesCount: 2,
    participationNotes: 'Good team player during cooperative sports and games.',
    activitiesJoined: ['Lessons 2-7', 'Sports Activities'],
    serviceProjectsJoined: ['proj-1'],
    notes: 'Excused absence for school sports tournament.'
  },
  {
    id: 'jy-4',
    name: 'Lina B.',
    age: 11,
    dateOfBirth: '2015-06-25',
    groupId: 'grp-1',
    neighborhood: 'North Ward',
    parentGuardianName: 'Rashid B.',
    parentGuardianContact: '081-555-0112',
    dateJoined: '2026-01-17',
    attendanceCount: 8,
    absencesCount: 1,
    participationNotes: 'Enjoys memorizing uplifting quotations and storytelling.',
    activitiesJoined: ['Lessons 1-7', 'Quotation Memorization'],
    serviceProjectsJoined: ['proj-1'],
    notes: 'Very supportive of newer peers.'
  },
  {
    id: 'jy-5',
    name: 'Samuel N.',
    age: 13,
    dateOfBirth: '2013-11-14',
    groupId: 'grp-2',
    neighborhood: 'Hillside',
    parentGuardianName: 'Grace N.',
    parentGuardianContact: '082-555-0721',
    dateJoined: '2026-02-01',
    attendanceCount: 6,
    absencesCount: 0,
    participationNotes: 'Shares insightful questions during moral discussions.',
    activitiesJoined: ['Lessons 1-4', 'Library Book Sorting Service'],
    serviceProjectsJoined: ['proj-2'],
    notes: 'Keen on science and nature observation.'
  },
  {
    id: 'jy-6',
    name: 'Maya P.',
    age: 12,
    dateOfBirth: '2014-07-09',
    groupId: 'grp-2',
    neighborhood: 'Hillside',
    parentGuardianName: 'Kavita P.',
    parentGuardianContact: '083-555-0932',
    dateJoined: '2026-02-01',
    attendanceCount: 5,
    absencesCount: 1,
    participationNotes: 'Helps organize materials and guides the opening prayer/reflection.',
    activitiesJoined: ['Lessons 1-4', 'Youth Choir'],
    serviceProjectsJoined: ['proj-2'],
    notes: 'Talented musician.'
  },
  {
    id: 'jy-7',
    name: 'Noah L.',
    age: 14,
    dateOfBirth: '2012-05-30',
    groupId: 'grp-2',
    neighborhood: 'Hillside',
    parentGuardianName: 'Marcus L.',
    parentGuardianContact: '084-555-0456',
    dateJoined: '2026-02-08',
    attendanceCount: 5,
    absencesCount: 1,
    participationNotes: 'Great enthusiasm for outdoor service activities and cleanups.',
    activitiesJoined: ['Lessons 2-4', 'Community Garden Service'],
    serviceProjectsJoined: ['proj-2'],
    notes: 'Assists animator with setting up seating.'
  }
];

export const SAMPLE_ANIMATORS: Animator[] = [
  {
    id: 'anim-1',
    name: 'Navid Mehrabi',
    contact: '082-444-1234',
    email: 'navid.m@example.org',
    groupIds: ['grp-1'],
    trainingStatus: 'fully_certified',
    booksStudied: ['Ruhi Book 1', 'Ruhi Book 3', 'Ruhi Book 5', 'Ruhi Book 7'],
    experienceYears: 3,
    availability: 'weekends',
    responsibilities: 'Lead animator, consultation facilitation, parent liaison',
    activities: 'Weekly group meetings, quarterly parent dinners, cluster reflection gatherings',
    notes: 'Experienced in mentoring junior youth through service projects.'
  },
  {
    id: 'anim-2',
    name: 'Soraya Bennett',
    contact: '083-333-5678',
    email: 'soraya.b@example.org',
    groupIds: ['grp-1'],
    trainingStatus: 'book_5_completed',
    booksStudied: ['Ruhi Book 1', 'Ruhi Book 5'],
    experienceYears: 1,
    availability: 'weekends',
    responsibilities: 'Co-animator, arts and cooperative games coordinator, attendance tracking',
    activities: 'Music and arts workshops, camp facilitator',
    notes: 'Completed Ruhi Book 5 intensive camp last spring.'
  },
  {
    id: 'anim-3',
    name: 'Kwame Osei',
    contact: '084-222-9876',
    email: 'kwame.o@example.org',
    groupIds: ['grp-2'],
    trainingStatus: 'book_5_completed',
    booksStudied: ['Ruhi Book 1', 'Ruhi Book 5'],
    experienceYears: 2,
    availability: 'flexible',
    responsibilities: 'Sole animator for Hillside group; needs support co-animator',
    activities: 'Study cycle coordination, science exploration walks',
    notes: 'Cluster coordinator should partner a newly trained youth animator with Kwame.'
  },
  {
    id: 'anim-4',
    name: 'Fatima Al-Mansoor',
    contact: '081-111-4321',
    email: 'fatima.m@example.org',
    groupIds: [],
    trainingStatus: 'in_training',
    booksStudied: ['Ruhi Book 1', 'Ruhi Book 5 (currently studying)'],
    experienceYears: 0,
    availability: 'weekdays',
    responsibilities: 'Ready to be assigned as co-animator upon Book 5 completion',
    activities: 'Observing Breezes of Hope group meetings',
    notes: 'Finishing Ruhi Book 5 unit 3 next week. Recommended for Cedar Park group.'
  }
];

export const SAMPLE_MEETINGS: Meeting[] = [
  {
    id: 'meet-1',
    groupId: 'grp-1',
    date: '2026-03-21',
    time: '10:00 AM',
    location: 'North Ward Community Centre Room 2B',
    sessionTopic: 'Confirmations through Perseverance',
    materialId: 'mat-breezes',
    materialTitle: 'Breezes of Confirmation',
    unitOrLesson: 'Lesson 7',
    activities: 'Opening reflection, reading story passage, pair discussion on persevering through exam preparation, cooperative passing game.',
    attendance: {
      'jy-1': 'present',
      'jy-2': 'present',
      'jy-3': 'late',
      'jy-4': 'present'
    },
    reflection: 'The junior youth articulated deeply how helping each other understand math and English homework is a direct reflection of confirmation.',
    followUpActions: 'Soraya will print quotation cards for next session. Tariq agreed to bring his acoustic guitar.',
    notes: 'All participants engaged peacefully and enthusiastically.',
    isRecurring: true,
    recurringPattern: 'weekly'
  },
  {
    id: 'meet-2',
    groupId: 'grp-1',
    date: '2026-03-28',
    time: '10:00 AM',
    location: 'North Ward Community Centre Room 2B',
    sessionTopic: 'Service Action Consultation',
    materialId: 'mat-breezes',
    materialTitle: 'Breezes of Confirmation',
    unitOrLesson: 'Lesson 8',
    activities: 'Review quotation, finalize roles for neighborhood tree planting project, practice environmental presentation.',
    attendance: {
      'jy-1': 'present',
      'jy-2': 'present',
      'jy-3': 'present',
      'jy-4': 'present'
    },
    reflection: 'Full attendance. The participants voted unanimously to clean and plant native seedlings in the park square.',
    followUpActions: 'Navid will contact the municipal park authority for seedling permits.',
    notes: 'A parent, Farid M., attended the first 10 minutes to support the group.',
    isRecurring: true,
    recurringPattern: 'weekly'
  },
  {
    id: 'meet-3',
    groupId: 'grp-2',
    date: '2026-03-22',
    time: '02:30 PM',
    location: 'Hillside Neighborhood Library',
    sessionTopic: 'Discovering Joy in Friendship',
    materialId: 'mat-wellspring',
    materialTitle: 'Wellspring of Joy',
    unitOrLesson: 'Lesson 4',
    activities: 'Story reading, vocabulary investigation, drama skit portraying sincere encouragement versus mock teasing.',
    attendance: {
      'jy-5': 'present',
      'jy-6': 'present',
      'jy-7': 'absent'
    },
    reflection: 'The drama skit was very impactful. Maya and Samuel helped dramatize how to welcome someone feeling isolated.',
    followUpActions: 'Kwame will check in with Noah’s family regarding the absence.',
    notes: 'Room reservation at the library renewed for next month.',
    isRecurring: true,
    recurringPattern: 'weekly'
  }
];

export const SAMPLE_SERVICE_PROJECTS: ServiceProject[] = [
  {
    id: 'proj-1',
    projectName: 'North Ward Native Tree Planting & Garden Revival',
    description: 'Junior youth surveyed their neighborhood and identified degraded green space in North Ward Park. They consulted with local residents and decided to plant 25 native shade saplings and clean the surrounding pathways.',
    groupId: 'grp-1',
    location: 'North Ward Public Park & Children Playground',
    date: '2026-04-11',
    participantIds: ['jy-1', 'jy-2', 'jy-3', 'jy-4'],
    goals: 'Beautify the public park, improve shade for families, and learn environmental stewardship.',
    tasks: [
      { id: 't1', title: 'Consult with municipal park manager for sapling planting approval', assignedTo: 'Navid Mehrabi', completed: true },
      { id: 't2', title: 'Create informational flyer for neighborhood families', assignedTo: 'Amira K. & Tariq M.', completed: true },
      { id: 't3', title: 'Gather gardening tools, gloves, and watering cans', assignedTo: 'Soraya Bennett & David S.', completed: false },
      { id: 't4', title: 'Hold planting day with community tea and reflection', assignedTo: 'Whole Group', completed: false }
    ],
    assignedResponsibilities: 'Tariq and Amira lead outreach; Soraya coordinates equipment and safety.',
    progressStatus: 'in_progress',
    results: 'Approval obtained from park supervisor; 15 neighborhood families pledged to participate.',
    reflection: 'The junior youth felt proud taking responsibility for their local community space.',
    followUp: 'Schedule weekly watering rota among participants throughout the dry season.'
  },
  {
    id: 'proj-2',
    projectName: 'Hillside Children’s Reading & Storytelling Corner',
    description: 'Youth visit the community library on Saturday mornings to read moral and uplifting stories to children aged 5-8, followed by simple coloring activities.',
    groupId: 'grp-2',
    location: 'Hillside Library Children Wing',
    date: '2026-03-14',
    participantIds: ['jy-5', 'jy-6', 'jy-7'],
    goals: 'Support literacy, foster bonds between junior youth and younger children, and provide parents a quiet space.',
    tasks: [
      { id: 't5', title: 'Select 5 virtue-based illustrated storybooks', assignedTo: 'Maya P.', completed: true },
      { id: 't6', title: 'Prepare coloring sheets and crayons', assignedTo: 'Samuel N.', completed: true },
      { id: 't7', title: 'Conduct first reading session for 12 children', assignedTo: 'Whole Group', completed: true }
    ],
    assignedResponsibilities: 'Kwame supervises; youth take turns narrating and assisting with coloring.',
    progressStatus: 'completed',
    results: '14 younger children attended. Parents expressed sincere gratitude and requested a regular monthly session.',
    reflection: 'Noah mentioned that teaching younger kids helped him realize how much of a role model he is becoming.',
    followUp: 'Plan second session for mid-April.'
  }
];

export const SAMPLE_EVENTS: CampOrEvent[] = [
  {
    id: 'ev-1',
    title: 'Cluster 4 Junior Youth Spring Empowerment Camp',
    type: 'camp',
    startDate: '2026-04-18',
    endDate: '2026-04-20',
    location: 'Pine Crest Camp & Education Retreat',
    registeredJyIds: ['jy-1', 'jy-2', 'jy-3', 'jy-4', 'jy-5', 'jy-6', 'jy-7'],
    registeredAnimatorIds: ['anim-1', 'anim-2', 'anim-3'],
    schedule: [
      { time: '08:30 AM', activity: 'Arrival, registration, and icebreaker cooperative games' },
      { time: '10:00 AM', activity: 'Intensive study session by book groups' },
      { time: '12:30 PM', activity: 'Healthy communal lunch' },
      { time: '02:00 PM', activity: 'Art, calligraphy, and choir workshops' },
      { time: '04:00 PM', activity: 'Non-competitive sports tournament' },
      { time: '07:30 PM', activity: 'Evening campfire reflections and uplifting songs' }
    ],
    activitiesDescription: 'A 3-day holistic youth camp combining deep moral study, arts, environmental service, and athletic teamwork.',
    announcements: [
      'Parent permission slips due by April 5th.',
      'Bring notebooks, warm evening clothes, and reusable water bottles.',
      'Health safety brief will be held at 9:00 AM on opening day.'
    ],
    status: 'upcoming'
  },
  {
    id: 'ev-2',
    title: 'Quarterly Cluster Animators & Coordinators Reflection Meeting',
    type: 'reflection_meeting',
    startDate: '2026-04-04',
    endDate: '2026-04-04',
    location: 'Bahá’í Centre / Assembly Conference Room',
    registeredJyIds: [],
    registeredAnimatorIds: ['anim-1', 'anim-2', 'anim-3', 'anim-4'],
    schedule: [
      { time: '09:00 AM', activity: 'Opening prayers and reading of educational guidance' },
      { time: '09:45 AM', activity: 'Review of cluster statistics: groups, attendance, study progress' },
      { time: '11:15 AM', activity: 'Consultation on animator support and forming groups in Cedar Park' },
      { time: '01:00 PM', activity: 'Consultation with Auxiliary Board member and next quarter planning' }
    ],
    activitiesDescription: 'Quarterly review to analyze qualitative insights, identify areas needing animator support, and plan upcoming youth camps.',
    announcements: [
      'Animators please ensure group attendance records are up to date in JY Connect prior to the meeting.'
    ],
    status: 'upcoming'
  }
];

export const SAMPLE_STUDY_CYCLES: StudyCycle[] = [
  {
    id: 'cycle-1',
    groupId: 'grp-1',
    materialId: 'mat-breezes',
    materialTitle: 'Breezes of Confirmation',
    currentSection: 'Lesson 8: Confirmations through Concerted Effort',
    totalSections: 14,
    completedSections: 7,
    scheduledSessionsCount: 14,
    completedSessionsCount: 7,
    startDate: '2026-01-17',
    targetCompletionDate: '2026-05-16',
    notes: 'The youth discuss vocabulary diligently and relate the story of Musonda to their own daily life in school.',
    discussionQuestions: [
      'What are some confirmations that early youth receive when they exert effort for others?',
      'How does sincere friendship help us resist peer pressure?'
    ],
    reflections: [
      'Participants connected the theme of early adolescent power with their desire to protect the local environment.'
    ]
  },
  {
    id: 'cycle-2',
    groupId: 'grp-2',
    materialId: 'mat-wellspring',
    materialTitle: 'Wellspring of Joy',
    currentSection: 'Lesson 4: Finding Joy in Truthfulness and Giving',
    totalSections: 12,
    completedSections: 4,
    scheduledSessionsCount: 12,
    completedSessionsCount: 4,
    startDate: '2026-02-01',
    targetCompletionDate: '2026-05-30',
    notes: 'Youth are creating small dramatic sketches for each lesson.',
    discussionQuestions: [
      'What is the difference between fleeting entertainment and deep spiritual joy?',
      'How can we be a source of encouragement to someone feeling left out?'
    ],
    reflections: [
      'The group showed heightened empathy and created welcoming greeting rituals.'
    ]
  }
];

export const SAMPLE_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Upcoming Meeting Tomorrow',
    message: 'Breezes of Hope Group meets Saturday at 10:00 AM at North Ward Community Centre.',
    type: 'meeting',
    date: '2026-03-27',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Animator Support Needed',
    message: 'Cedar Park New Group has formed and requires 1-2 animators to begin meetings.',
    type: 'animator',
    date: '2026-03-25',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Spring Camp Registration Open',
    message: 'Registration is open for Cluster 4 Junior Youth Spring Empowerment Camp (April 18-20).',
    type: 'event',
    date: '2026-03-20',
    read: true
  }
];
