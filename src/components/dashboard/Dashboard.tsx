import React from 'react';
import {
  Users,
  BookOpen,
  Calendar,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  HeartHandshake,
  TrendingUp,
  MapPin,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';
import {
  JuniorYouthGroup,
  JuniorYouthParticipant,
  Animator,
  Meeting,
  ServiceProject,
  CampOrEvent,
  StudyCycle,
  UserRole,
  FollowUpTask,
  ReportData
} from '../../types';
import { BahaiNinePointedStar, BahaiDivider } from '../common/BahaiArt';

interface DashboardProps {
  groups: JuniorYouthGroup[];
  participants: JuniorYouthParticipant[];
  animators: Animator[];
  meetings: Meeting[];
  serviceProjects: ServiceProject[];
  events: CampOrEvent[];
  studyCycles: StudyCycle[];
  tasks?: FollowUpTask[];
  reports?: ReportData[];
  currentRole: UserRole;
  onNavigate: (tab: string) => void;
  onOpenNewGroup: () => void;
  onOpenNewMeeting: () => void;
  onLoadPracticeData: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  groups,
  participants,
  animators,
  meetings,
  serviceProjects,
  events,
  studyCycles,
  tasks = [],
  reports = [],
  currentRole,
  onNavigate,
  onOpenNewGroup,
  onOpenNewMeeting,
  onLoadPracticeData
}) => {
  // Compute key statistics
  const totalGroups = groups.length;
  const activeGroups = groups.filter((g) => g.status === 'active').length;
  const formingGroups = groups.filter((g) => g.status === 'forming');
  const totalParticipants = participants.length;
  const totalAnimators = animators.length;
  const activeAnimators = animators.filter((a) => a.groupIds.length > 0).length;

  const todayStr = new Date().toISOString().split('T')[0];

  // Groups requiring support: status is forming, has 0 animators, or status is paused
  const groupsNeedingSupport = groups.filter(
    (g) => g.status === 'forming' || g.animatorIds.length === 0 || g.status === 'paused'
  );

  // Overdue and pending follow-ups
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.status !== 'cancelled' && t.dueDate < todayStr
  );
  const pendingTasks = tasks.filter((t) => t.status !== 'completed' && t.status !== 'cancelled');

  // Active Service Projects
  const activeProjects = serviceProjects.filter((p) => p.progressStatus !== 'completed');

  // Upcoming meetings (meetings in the next 14 days or sort by date)
  const sortedMeetings = [...meetings].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const upcomingMeetings = sortedMeetings.slice(0, 3);

  // Upcoming events
  const upcomingEvents = [...events]
    .filter((e) => e.status !== 'completed')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  // Overall attendance calculation
  let totalAttendanceChecks = 0;
  let totalPresentCount = 0;
  meetings.forEach((m) => {
    Object.values(m.attendance).forEach((status) => {
      totalAttendanceChecks++;
      if (status === 'present' || status === 'late') {
        totalPresentCount++;
      }
    });
  });
  const overallAttendanceRate =
    totalAttendanceChecks > 0 ? Math.round((totalPresentCount / totalAttendanceChecks) * 100) : 0;

  const isCompletelyEmpty = totalGroups === 0 && totalParticipants === 0 && totalAnimators === 0;

  return (
    <div className="space-y-8">
      {/* Header with Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
              Junior Youth Program Overview
            </h1>
            <BahaiNinePointedStar size={18} color="#0284c7" />
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Empowering early youth through moral insight, intellectual inquiry, and mutual service.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {currentRole !== 'viewer' && (
            <>
              <button
                onClick={() => onNavigate('tasks')}
                className="px-3 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <CheckSquare className="w-3.5 h-3.5 text-sky-600" />
                <span>Follow-ups ({pendingTasks.length})</span>
              </button>
              <button
                onClick={onOpenNewMeeting}
                className="px-3 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                <span>Log Meeting</span>
              </button>
              <button
                onClick={onOpenNewGroup}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-sky-400" />
                <span>New Group</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pristine Empty State Banner if completely fresh database */}
      {isCompletelyEmpty && (
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-6 text-slate-900">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-sky-800 font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Fresh Community Database Ready</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Welcome to your new JY Connect workspace
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                All data fields are currently clean and unpopulated, ready for your local community records. You can begin by creating your first Junior Youth group, adding animators, or exploring the Junior Youth Materials Library.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <button
                onClick={onOpenNewGroup}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
              >
                + Register First Group
              </button>
              <button
                onClick={onLoadPracticeData}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-sky-800 bg-white border border-sky-300 rounded-md hover:bg-sky-100 transition-colors"
              >
                Load Sample Practice Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* High-level Metric Stat Cards (Solid colors, tabular numbers, no gradients) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Groups */}
        <div
          onClick={() => onNavigate('groups')}
          className="bg-white border border-slate-200 border-l-4 border-l-sky-500 rounded-lg p-5 cursor-pointer hover:border-sky-400 hover:shadow-xs transition-colors"
        >
          <div className="flex items-center justify-between text-slate-600 text-xs font-medium">
            <span>Groups Active / Total</span>
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {activeGroups}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ {totalGroups} total</span>
          </div>
          <div className="mt-2 text-xs text-sky-800 font-medium flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-sky-50 rounded border border-sky-200">
              {formingGroups.length} forming in cluster
            </span>
          </div>
        </div>

        {/* Total Junior Youth */}
        <div
          onClick={() => onNavigate('participants')}
          className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-lg p-5 cursor-pointer hover:border-emerald-400 hover:shadow-xs transition-colors"
        >
          <div className="flex items-center justify-between text-slate-600 text-xs font-medium">
            <span>Junior Youth</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {totalParticipants}
            </span>
            <span className="text-xs text-slate-500">participants</span>
          </div>
          <div className="mt-2 text-xs text-emerald-800 font-medium flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-emerald-50 rounded border border-emerald-200">
              Ages 11 – 15 empowerment
            </span>
          </div>
        </div>

        {/* Active Animators */}
        <div
          onClick={() => onNavigate('animators')}
          className="bg-white border border-slate-200 border-l-4 border-l-purple-500 rounded-lg p-5 cursor-pointer hover:border-purple-400 hover:shadow-xs transition-colors"
        >
          <div className="flex items-center justify-between text-slate-600 text-xs font-medium">
            <span>Animators</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {activeAnimators}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ {totalAnimators} registered</span>
          </div>
          <div className="mt-2 text-xs text-purple-800 font-medium flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-purple-50 rounded border border-purple-200">
              Ruhi Book 5 training
            </span>
          </div>
        </div>

        {/* Attendance Rate */}
        <div
          onClick={() => onNavigate('meetings')}
          className="bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-lg p-5 cursor-pointer hover:border-amber-400 hover:shadow-xs transition-colors"
        >
          <div className="flex items-center justify-between text-slate-600 text-xs font-medium">
            <span>Cluster Attendance</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {overallAttendanceRate}%
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({totalAttendanceChecks} logs)
            </span>
          </div>
          <div className="mt-2 text-xs text-amber-800 font-medium flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-amber-50 rounded border border-amber-200">
              Consistent participation
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column: Overdue Follow-ups & Groups Needing Support */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Outstanding Follow-ups Alert */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Outstanding Follow-ups ({pendingTasks.length})
              </h3>
            </div>
            {overdueTasks.length > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-600 text-white rounded">
                {overdueTasks.length} Overdue
              </span>
            )}
          </div>

          <div className="mt-3 space-y-2">
            {pendingTasks.length === 0 ? (
              <div className="text-xs text-slate-500 py-3 text-center">
                All follow-up actions and home visits are up to date.
              </div>
            ) : (
              pendingTasks.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  onClick={() => onNavigate('tasks')}
                  className="p-2.5 bg-slate-50 hover:bg-sky-50/50 rounded border border-slate-200 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-900">{t.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Responsible: <strong>{t.assignedTo}</strong> · Due: <span className="font-mono">{t.dueDate}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      t.priority === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Groups Requiring Support Alert Section */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Groups Requiring Support ({groupsNeedingSupport.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigate('groups')}
              className="text-[11px] font-bold text-sky-700 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {groupsNeedingSupport.length === 0 ? (
              <div className="text-xs text-slate-500 py-3 text-center">
                All active groups have assigned animators and regular meetings.
              </div>
            ) : (
              groupsNeedingSupport.slice(0, 3).map((grp) => (
                <div
                  key={grp.id}
                  onClick={() => onNavigate('groups')}
                  className="p-2.5 bg-amber-50/50 hover:bg-amber-50 rounded border border-amber-200 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-900">{grp.name}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      {grp.neighborhood || 'Neighborhood unassigned'}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-200 text-amber-900 rounded">
                    {grp.animatorIds.length === 0 ? 'Needs Animator' : grp.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Two-Column Grid: Meetings & Study Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Upcoming Meetings */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">Upcoming Group Meetings</h2>
              </div>
              <button
                onClick={() => onNavigate('meetings')}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {upcomingMeetings.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  <p>No upcoming meetings scheduled yet.</p>
                  <button
                    onClick={onOpenNewMeeting}
                    className="mt-2 text-sky-700 font-semibold hover:underline"
                  >
                    Schedule a meeting
                  </button>
                </div>
              ) : (
                upcomingMeetings.map((m) => {
                  const grp = groups.find((g) => g.id === m.groupId);
                  return (
                    <div key={m.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-bold text-sky-900 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                            {grp ? grp.name : 'Junior Youth Group'}
                          </span>
                          <span className="text-xs font-semibold text-slate-800 ml-2">{m.sessionTopic || 'Study Session'}</span>
                        </div>
                        <span className="text-xs text-sky-800 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded">{m.date}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-2 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{m.time}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{m.location}</span>
                        </span>
                        {m.materialTitle && (
                          <span className="text-indigo-800 font-medium bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                            Text: {m.materialTitle}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-600">
            <span>{meetings.length} recorded meetings in total</span>
            <button
              onClick={() => onNavigate('meetings')}
              className="text-sky-700 font-semibold hover:underline"
            >
              Record Attendance
            </button>
          </div>
        </div>

        {/* Right Column: Active Study Sessions */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">Current Study Cycles</h2>
              </div>
              <button
                onClick={() => onNavigate('study')}
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {studyCycles.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  <p>No study cycles currently registered.</p>
                  <button
                    onClick={() => onNavigate('study')}
                    className="mt-2 text-indigo-700 font-semibold hover:underline"
                  >
                    Start a study cycle with a Junior Youth text
                  </button>
                </div>
              ) : (
                studyCycles.map((sc) => {
                  const grp = groups.find((g) => g.id === sc.groupId);
                  const progressPct =
                    sc.totalSections > 0
                      ? Math.round((sc.completedSections / sc.totalSections) * 100)
                      : 0;

                  return (
                    <div key={sc.id} className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-md">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-indigo-950">{sc.materialTitle}</span>
                        <span className="text-indigo-800 font-semibold bg-white px-2 py-0.5 rounded border border-indigo-200 font-mono text-[11px]">
                          {grp?.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1">
                        Current: <strong className="text-slate-800">{sc.currentSection || 'Lesson in progress'}</strong>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-indigo-900 font-mono font-bold">
                          {progressPct}%
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-600">
            <span>Explore authentic Junior Youth texts</span>
            <button
              onClick={() => onNavigate('materials')}
              className="text-indigo-700 font-semibold hover:underline"
            >
              Open Materials Library
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Two-Column: Service Projects & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Projects */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Active Service Projects</h2>
            </div>
            <button
              onClick={() => onNavigate('service')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {activeProjects.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs">
                <p>No active service projects registered.</p>
                <button
                  onClick={() => onNavigate('service')}
                  className="mt-2 text-emerald-700 font-semibold hover:underline"
                >
                  Plan a new community service project
                </button>
              </div>
            ) : (
              activeProjects.map((p) => {
                const grp = groups.find((g) => g.id === p.groupId);
                const completedTasks = p.tasks.filter((t) => t.completed).length;

                return (
                  <div key={p.id} className="p-3 border border-emerald-200 bg-emerald-50/30 rounded-md">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{p.projectName}</h4>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 capitalize">
                        {p.progressStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 line-clamp-2 mt-1">{p.description}</p>
                    <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between">
                      <span className="font-medium text-slate-800">Group: {grp?.name || 'Assigned group'}</span>
                      <span className="font-mono text-emerald-800 font-semibold bg-white px-2 py-0.5 rounded border border-emerald-200">
                        {completedTasks}/{p.tasks.length} tasks done
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Upcoming Camps and Events */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Camps & Cluster Gatherings</h2>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
            >
              <span>View schedule</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {upcomingEvents.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs">
                <p>No upcoming camps or cluster gatherings scheduled.</p>
                <button
                  onClick={() => onNavigate('events')}
                  className="mt-2 text-purple-700 font-semibold hover:underline"
                >
                  Create an event or camp
                </button>
              </div>
            ) : (
              upcomingEvents.map((ev) => (
                <div key={ev.id} className="p-3 border border-purple-200 bg-purple-50/30 rounded-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{ev.title}</h4>
                      <div className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-purple-600" />
                        <span>{ev.location}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-purple-800 font-mono font-bold bg-purple-100 px-2 py-0.5 rounded border border-purple-300">
                      {ev.startDate}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-600 font-medium">
                    <span className="text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                      {ev.registeredJyIds.length} youth registered
                    </span>
                    <span className="text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                      {ev.registeredAnimatorIds.length} animators
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <BahaiDivider />
    </div>
  );
};
