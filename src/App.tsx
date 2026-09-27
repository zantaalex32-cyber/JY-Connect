import React, { useState, useEffect } from 'react';
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
  AttendanceStatus
} from './types';
import {
  loadStoredData,
  saveStoredData,
  getSamplePracticeData,
  getInitialEmptyData,
  AppStateData
} from './utils/storage';
import { Navbar } from './components/layout/Navbar';
import { Dashboard } from './components/dashboard/Dashboard';
import { GroupList } from './components/groups/GroupList';
import { ParticipantList } from './components/participants/ParticipantList';
import { AnimatorList } from './components/animators/AnimatorList';
import { MeetingManager } from './components/meetings/MeetingManager';
import { StudyProgram } from './components/study/StudyProgram';
import { ServiceProjects } from './components/service/ServiceProjects';
import { EventManager } from './components/events/EventManager';
import { CalendarView } from './components/calendar/CalendarView';
import { MaterialsLibrary } from './components/materials/MaterialsLibrary';
import { ClusterReports } from './components/reports/ClusterReports';
import { SettingsView } from './components/settings/SettingsView';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationsModal } from './components/common/NotificationsModal';
import { JyMascotLogo, BahaiNinePointedStar } from './components/common/BahaiArt';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<AppStateData>(() => loadStoredData());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Sync state to local storage on changes
  useEffect(() => {
    saveStoredData(data);
  }, [data]);

  // Handlers for Group CRUD
  const handleSaveGroup = (group: JuniorYouthGroup) => {
    setData((prev) => {
      const exists = prev.groups.some((g) => g.id === group.id);
      const updatedGroups = exists
        ? prev.groups.map((g) => (g.id === group.id ? group : g))
        : [...prev.groups, group];
      return { ...prev, groups: updatedGroups };
    });
  };

  const handleDeleteGroup = (groupId: string) => {
    setData((prev) => ({
      ...prev,
      groups: prev.groups.filter((g) => g.id !== groupId)
    }));
  };

  // Handlers for Participant CRUD
  const handleSaveParticipant = (participant: JuniorYouthParticipant) => {
    setData((prev) => {
      const exists = prev.participants.some((p) => p.id === participant.id);
      const updated = exists
        ? prev.participants.map((p) => (p.id === participant.id ? participant : p))
        : [...prev.participants, participant];
      return { ...prev, participants: updated };
    });
  };

  const handleDeleteParticipant = (participantId: string) => {
    setData((prev) => ({
      ...prev,
      participants: prev.participants.filter((p) => p.id !== participantId)
    }));
  };

  // Handlers for Animator CRUD
  const handleSaveAnimator = (animator: Animator) => {
    setData((prev) => {
      const exists = prev.animators.some((a) => a.id === animator.id);
      const updated = exists
        ? prev.animators.map((a) => (a.id === animator.id ? animator : a))
        : [...prev.animators, animator];
      return { ...prev, animators: updated };
    });
  };

  const handleDeleteAnimator = (animatorId: string) => {
    setData((prev) => ({
      ...prev,
      animators: prev.animators.filter((a) => a.id !== animatorId)
    }));
  };

  // Handlers for Meeting CRUD & Attendance
  const handleSaveMeeting = (meeting: Meeting) => {
    setData((prev) => {
      const exists = prev.meetings.some((m) => m.id === meeting.id);
      const updatedMeetings = exists
        ? prev.meetings.map((m) => (m.id === meeting.id ? meeting : m))
        : [...prev.meetings, meeting];
      return { ...prev, meetings: updatedMeetings };
    });
  };

  const handleDeleteMeeting = (meetingId: string) => {
    setData((prev) => ({
      ...prev,
      meetings: prev.meetings.filter((m) => m.id !== meetingId)
    }));
  };

  const handleUpdateAttendance = (
    meetingId: string,
    participantId: string,
    status: AttendanceStatus
  ) => {
    setData((prev) => {
      const updatedMeetings = prev.meetings.map((m) => {
        if (m.id === meetingId) {
          return {
            ...m,
            attendance: {
              ...m.attendance,
              [participantId]: status
            }
          };
        }
        return m;
      });
      return { ...prev, meetings: updatedMeetings };
    });
  };

  // Handlers for Study Program
  const handleSaveStudyCycle = (cycle: StudyCycle) => {
    setData((prev) => {
      const exists = prev.studyCycles.some((sc) => sc.id === cycle.id);
      const updated = exists
        ? prev.studyCycles.map((sc) => (sc.id === cycle.id ? cycle : sc))
        : [...prev.studyCycles, cycle];
      return { ...prev, studyCycles: updated };
    });
  };

  const handleDeleteStudyCycle = (cycleId: string) => {
    setData((prev) => ({
      ...prev,
      studyCycles: prev.studyCycles.filter((sc) => sc.id !== cycleId)
    }));
  };

  // Handlers for Service Projects
  const handleSaveServiceProject = (project: ServiceProject) => {
    setData((prev) => {
      const exists = prev.serviceProjects.some((p) => p.id === project.id);
      const updated = exists
        ? prev.serviceProjects.map((p) => (p.id === project.id ? project : p))
        : [...prev.serviceProjects, project];
      return { ...prev, serviceProjects: updated };
    });
  };

  const handleDeleteServiceProject = (projectId: string) => {
    setData((prev) => ({
      ...prev,
      serviceProjects: prev.serviceProjects.filter((p) => p.id !== projectId)
    }));
  };

  // Handlers for Events
  const handleSaveEvent = (event: CampOrEvent) => {
    setData((prev) => {
      const exists = prev.events.some((e) => e.id === event.id);
      const updated = exists
        ? prev.events.map((e) => (e.id === event.id ? event : e))
        : [...prev.events, event];
      return { ...prev, events: updated };
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    setData((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== eventId)
    }));
  };

  // Handlers for Materials
  const handleSaveMaterial = (mat: Material) => {
    setData((prev) => {
      const exists = prev.materials.some((m) => m.id === mat.id);
      const updated = exists
        ? prev.materials.map((m) => (m.id === mat.id ? mat : m))
        : [mat, ...prev.materials];
      return { ...prev, materials: updated };
    });
  };

  const handleToggleBookmarkMaterial = (materialId: string) => {
    setData((prev) => {
      const updated = prev.materials.map((m) =>
        m.id === materialId ? { ...m, bookmarked: !m.bookmarked } : m
      );
      return { ...prev, materials: updated };
    });
  };

  // Handlers for Reports
  const handleSaveReport = (report: ReportData) => {
    setData((prev) => ({
      ...prev,
      reports: [report, ...prev.reports]
    }));
  };

  const handleDeleteReport = (reportId: string) => {
    setData((prev) => ({
      ...prev,
      reports: prev.reports.filter((r) => r.id !== reportId)
    }));
  };

  // Handlers for Settings & Data State
  const handleUpdateSettings = (settings: AppSettings) => {
    setData((prev) => ({ ...prev, settings }));
  };

  const handleSetRole = (role: UserRole) => {
    setData((prev) => ({ ...prev, currentRole: role }));
  };

  const handleLoadPracticeData = () => {
    const practice = getSamplePracticeData();
    setData(practice);
  };

  const handleResetEmptyData = () => {
    const fresh = getInitialEmptyData();
    setData(fresh);
  };

  const handleToggleDemo = () => {
    if (data.isDemoDataActive) {
      handleResetEmptyData();
    } else {
      handleLoadPracticeData();
    }
  };

  // Notification handlers
  const handleMarkAllNotificationsRead = () => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true }))
    }));
  };

  const handleMarkOneNotificationRead = (id: string) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    }));
  };

  const unreadCount = data.notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-sky-100">
      {/* Navbar with 3-zone contract, no gradients */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={data.currentRole}
        setCurrentRole={handleSetRole}
        unreadNotificationsCount={unreadCount}
        openNotifications={() => setIsNotificationsOpen(true)}
        openGlobalSearch={() => setIsSearchOpen(true)}
        isDemoDataActive={data.isDemoDataActive}
        onToggleDemoData={handleToggleDemo}
        onResetEmptyData={handleResetEmptyData}
        whatsappContact={data.settings.whatsappContact}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            groups={data.groups}
            participants={data.participants}
            animators={data.animators}
            meetings={data.meetings}
            serviceProjects={data.serviceProjects}
            events={data.events}
            studyCycles={data.studyCycles}
            currentRole={data.currentRole}
            onNavigate={setActiveTab}
            onOpenNewGroup={() => setActiveTab('groups')}
            onOpenNewMeeting={() => setActiveTab('meetings')}
            onLoadPracticeData={handleLoadPracticeData}
          />
        )}

        {activeTab === 'groups' && (
          <GroupList
            groups={data.groups}
            participants={data.participants}
            animators={data.animators}
            meetings={data.meetings}
            serviceProjects={data.serviceProjects}
            currentRole={data.currentRole}
            onSaveGroup={handleSaveGroup}
            onDeleteGroup={handleDeleteGroup}
            onNavigateToParticipants={(groupId) => setActiveTab('participants')}
            onNavigateToMeetings={(groupId) => setActiveTab('meetings')}
          />
        )}

        {activeTab === 'participants' && (
          <ParticipantList
            participants={data.participants}
            groups={data.groups}
            currentRole={data.currentRole}
            privacyProtectionEnabled={data.settings.privacyProtectionEnabled}
            onSaveParticipant={handleSaveParticipant}
            onDeleteParticipant={handleDeleteParticipant}
          />
        )}

        {activeTab === 'animators' && (
          <AnimatorList
            animators={data.animators}
            groups={data.groups}
            currentRole={data.currentRole}
            onSaveAnimator={handleSaveAnimator}
            onDeleteAnimator={handleDeleteAnimator}
          />
        )}

        {activeTab === 'meetings' && (
          <MeetingManager
            meetings={data.meetings}
            groups={data.groups}
            participants={data.participants}
            materials={data.materials}
            currentRole={data.currentRole}
            onSaveMeeting={handleSaveMeeting}
            onDeleteMeeting={handleDeleteMeeting}
            onUpdateAttendance={handleUpdateAttendance}
          />
        )}

        {activeTab === 'study' && (
          <StudyProgram
            studyCycles={data.studyCycles}
            groups={data.groups}
            materials={data.materials}
            currentRole={data.currentRole}
            onSaveStudyCycle={handleSaveStudyCycle}
            onDeleteStudyCycle={handleDeleteStudyCycle}
            onNavigateToMaterials={() => setActiveTab('materials')}
          />
        )}

        {activeTab === 'service' && (
          <ServiceProjects
            serviceProjects={data.serviceProjects}
            groups={data.groups}
            participants={data.participants}
            currentRole={data.currentRole}
            onSaveServiceProject={handleSaveServiceProject}
            onDeleteServiceProject={handleDeleteServiceProject}
          />
        )}

        {activeTab === 'events' && (
          <EventManager
            events={data.events}
            participants={data.participants}
            animators={data.animators}
            currentRole={data.currentRole}
            onSaveEvent={handleSaveEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            meetings={data.meetings}
            serviceProjects={data.serviceProjects}
            events={data.events}
            groups={data.groups}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialsLibrary
            materials={data.materials}
            currentRole={data.currentRole}
            onSaveMaterial={handleSaveMaterial}
            onToggleBookmark={handleToggleBookmarkMaterial}
          />
        )}

        {activeTab === 'reports' && (
          <ClusterReports
            groups={data.groups}
            participants={data.participants}
            animators={data.animators}
            meetings={data.meetings}
            serviceProjects={data.serviceProjects}
            events={data.events}
            reports={data.reports}
            currentRole={data.currentRole}
            clusterName={data.settings.clusterName}
            onSaveReport={handleSaveReport}
            onDeleteReport={handleDeleteReport}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={data.settings}
            onUpdateSettings={handleUpdateSettings}
            currentRole={data.currentRole}
            isDemoDataActive={data.isDemoDataActive}
            onLoadPracticeData={handleLoadPracticeData}
            onResetEmptyData={handleResetEmptyData}
          />
        )}
      </main>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        groups={data.groups}
        participants={data.participants}
        animators={data.animators}
        materials={data.materials}
        meetings={data.meetings}
        serviceProjects={data.serviceProjects}
        events={data.events}
        reports={data.reports}
        onNavigateToTab={(tab) => setActiveTab(tab)}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={data.notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onMarkOneRead={handleMarkOneNotificationRead}
      />

      {/* Footer (No gradients, clean typography, quiet copyright & WhatsApp help) */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-sky-50 border border-sky-200 flex items-center justify-center">
              <JyMascotLogo size={20} color="#0f172a" />
            </div>
            <div>
              <span className="font-bold text-slate-900 font-sans">JY Connect</span>
              <span className="mx-2">·</span>
              <span>Junior Youth Spiritual Empowerment Program Management & Coordination</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <a
              href="https://www.bahai.org/action/community-building/junior-youth"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              Bahá’í Junior Youth Overview
            </a>
            <span>·</span>
            <a
              href="https://www.ruhi.org/en/resources/materials-for-junior-youth/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              Ruhi Institute Materials
            </a>
            <span>·</span>
            <a
              href={`https://wa.me/${data.settings.whatsappContact.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-800 font-medium flex items-center gap-1 text-sky-700"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: {data.settings.whatsappContact}</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
