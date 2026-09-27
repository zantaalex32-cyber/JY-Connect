import React, { useState } from 'react';
import {
  Meeting,
  JuniorYouthGroup,
  JuniorYouthParticipant,
  StudyCycle,
  ServiceProject,
  CampOrEvent,
  FollowUpTask,
  AttendanceStatus,
  UserRole
} from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowRight,
  CheckSquare,
  MessageCircle,
  FileText,
  AlertCircle
} from 'lucide-react';

interface MyWeekViewProps {
  meetings: Meeting[];
  groups: JuniorYouthGroup[];
  participants: JuniorYouthParticipant[];
  studyCycles: StudyCycle[];
  serviceProjects: ServiceProject[];
  events: CampOrEvent[];
  tasks: FollowUpTask[];
  currentRole: UserRole;
  onUpdateAttendance: (meetingId: string, participantId: string, status: AttendanceStatus) => void;
  onOpenReflection: (meeting: Meeting) => void;
  onNavigateTab: (tab: string) => void;
  whatsappContact: string;
}

export function MyWeekView({
  meetings,
  groups,
  participants,
  studyCycles,
  serviceProjects,
  events,
  tasks,
  currentRole,
  onUpdateAttendance,
  onOpenReflection,
  onNavigateTab,
  whatsappContact
}: MyWeekViewProps) {
  // Checklists state (pre-meeting preparation)
  const [prepChecks, setPrepChecks] = useState<Record<string, boolean>>({
    review_text: true,
    prepare_art: false,
    confirm_venue: true,
    call_parents: false
  });

  const togglePrep = (key: string) => {
    setPrepChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Find this week's meetings (next 7 days)
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const thisWeekMeetings = meetings.filter((m) => {
    const d = new Date(m.date);
    return d >= new Date(today.setHours(0, 0, 0, 0)) && d <= nextWeek;
  });

  // Pick first meeting of the week for interactive workflow
  const activeMeeting = thisWeekMeetings[0] || meetings[0];
  const activeGroup = activeMeeting ? groups.find((g) => g.id === activeMeeting.groupId) : groups[0];
  const activeParticipants = activeGroup
    ? participants.filter((p) => p.groupId === activeGroup.id)
    : [];
  const activeStudy = activeGroup
    ? studyCycles.find((sc) => sc.groupId === activeGroup.id)
    : undefined;

  const thisWeekTasks = tasks.filter((t) => t.status !== 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-sky-100 text-sky-900 uppercase tracking-wider">
              Animator Workspace
            </span>
            <span className="text-xs text-slate-500 font-mono">Week of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">My Week: Accompanying the Junior Youth</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Your structured flow for pre-meeting preparation, during-session facilitation, and post-meeting reflection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/${whatsappContact.replace(/\D/g, '')}?text=Hello%20Coordinator,%20reporting%20from%20this%20week's%20Junior%20Youth%20session.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Coordinator WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 border-l-4 border-l-sky-500 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-bold text-sky-900">Upcoming Gatherings</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {thisWeekMeetings.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">sessions scheduled</div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-900">Youth to Welcome</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {activeParticipants.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">active participants</div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-purple-500 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-bold text-purple-900">Current Text</div>
          <div className="text-xs font-bold text-slate-900 mt-1 truncate">
            {activeStudy?.materialTitle || 'Breezes of Confirmation'}
          </div>
          <div className="text-[11px] text-purple-700 font-medium mt-0.5">
            {activeStudy?.currentSection || 'Lesson 4'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-bold text-amber-900">Pending Tasks</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {thisWeekTasks.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">follow-up commitments</div>
        </div>
      </div>

      {/* Interactive 3-Stage Meeting Accompaniment Workflow */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
              Active Facilitation Cycle
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              {activeGroup ? activeGroup.name : 'Weekly Junior Youth Gathering'}
            </h2>
          </div>
          {activeMeeting && (
            <div className="text-right text-xs">
              <span className="text-sky-300 font-bold font-mono">{activeMeeting.date}</span> at {activeMeeting.time}
              <div className="text-slate-400 text-[11px]">{activeMeeting.location}</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Phase 1: Before the Meeting */}
          <div className="p-5 space-y-4 bg-sky-50/20">
            <div className="flex items-center gap-2 border-b border-sky-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h3 className="text-xs font-bold text-sky-950 uppercase tracking-wider">
                Before Meeting: Preparation
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              Prepare the spiritual and physical environment for meaningful consultation and mutual learning.
            </p>

            <div className="space-y-2 text-xs">
              <label
                onClick={() => togglePrep('review_text')}
                className="flex items-center gap-2.5 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:border-sky-300 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={prepChecks.review_text}
                  onChange={() => {}}
                  className="rounded text-sky-600 w-4 h-4"
                />
                <span className={prepChecks.review_text ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                  Review text passage & questions ({activeStudy?.materialTitle || 'Breezes of Confirmation'})
                </span>
              </label>

              <label
                onClick={() => togglePrep('prepare_art')}
                className="flex items-center gap-2.5 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:border-sky-300 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={prepChecks.prepare_art}
                  onChange={() => {}}
                  className="rounded text-sky-600 w-4 h-4"
                />
                <span className={prepChecks.prepare_art ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                  Prepare cooperative game & arts/craft materials
                </span>
              </label>

              <label
                onClick={() => togglePrep('confirm_venue')}
                className="flex items-center gap-2.5 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:border-sky-300 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={prepChecks.confirm_venue}
                  onChange={() => {}}
                  className="rounded text-sky-600 w-4 h-4"
                />
                <span className={prepChecks.confirm_venue ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                  Confirm venue readiness & seating arrangement
                </span>
              </label>

              <label
                onClick={() => togglePrep('call_parents')}
                className="flex items-center gap-2.5 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:border-sky-300 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={prepChecks.call_parents}
                  onChange={() => {}}
                  className="rounded text-sky-600 w-4 h-4"
                />
                <span className={prepChecks.call_parents ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                  Follow up with parents regarding consent or absence
                </span>
              </label>
            </div>

            <button
              onClick={() => onNavigateTab('materials')}
              className="w-full text-center py-1.5 bg-white border border-sky-300 hover:bg-sky-50 text-sky-800 rounded font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span>Open Materials Study Guides</span>
            </button>
          </div>

          {/* Phase 2: During the Meeting */}
          <div className="p-5 space-y-4 bg-emerald-50/20">
            <div className="flex items-center gap-2 border-b border-emerald-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                During Meeting: Facilitation
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              Mark attendance and accompany the youth through study, prayer, recreation, and fellowship.
            </p>

            {/* Quick Attendance Roster */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>1-Tap Attendance</span>
                <span className="text-[11px] text-emerald-800 font-mono">
                  {activeParticipants.length} registered
                </span>
              </div>

              {activeParticipants.length === 0 ? (
                <div className="p-3 bg-white border border-slate-200 rounded text-center text-xs text-slate-500">
                  No youth enrolled yet in this group.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {activeParticipants.map((p) => {
                    const currentStatus = activeMeeting?.attendance[p.id] || 'present';

                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 bg-white rounded border border-slate-200 text-xs"
                      >
                        <span className="font-semibold text-slate-900 truncate max-w-[130px]">
                          {p.name}
                        </span>

                        <div className="flex items-center gap-1">
                          {(['present', 'absent', 'excused'] as AttendanceStatus[]).map((st) => (
                            <button
                              key={st}
                              onClick={() => {
                                if (activeMeeting) {
                                  onUpdateAttendance(activeMeeting.id, p.id, st);
                                }
                              }}
                              className={`px-1.5 py-0.5 text-[10px] font-bold rounded border capitalize ${
                                currentStatus === st
                                  ? st === 'present'
                                    ? 'bg-emerald-600 text-white border-emerald-700'
                                    : st === 'absent'
                                    ? 'bg-rose-600 text-white border-rose-700'
                                    : 'bg-amber-500 text-white border-amber-600'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {st[0].toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-2.5 bg-white border border-emerald-200 rounded text-xs">
              <span className="font-bold text-slate-800">Study Progress: </span>
              <span className="text-emerald-900 font-mono">
                {activeStudy?.currentSection || 'Lesson in progress'}
              </span>
            </div>
          </div>

          {/* Phase 3: After the Meeting */}
          <div className="p-5 space-y-4 bg-purple-50/20">
            <div className="flex items-center gap-2 border-b border-purple-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                After Meeting: Reflection
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              Record insights, note challenges, and create commitments to maintain momentum for next week.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  if (activeMeeting) {
                    onOpenReflection(activeMeeting);
                  }
                }}
                className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white rounded font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Fill Meeting Reflection Journal</span>
              </button>

              <button
                onClick={() => onNavigateTab('tasks')}
                className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckSquare className="w-4 h-4 text-purple-600" />
                <span>Create Follow-up Action</span>
              </button>

              <button
                onClick={() => onNavigateTab('service')}
                className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Plan Community Service Project</span>
              </button>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 border-t border-purple-100 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>Prompt reflections help coordinators offer timely encouragement.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Week's Follow-up Tasks */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">My Action Items This Week</h3>
          </div>
          <button
            onClick={() => onNavigateTab('tasks')}
            className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
          >
            <span>All Tasks</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {thisWeekTasks.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            No pending tasks for this week. All caught up!
          </div>
        ) : (
          <div className="mt-3 divide-y divide-slate-100">
            {thisWeekTasks.map((t) => (
              <div key={t.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{t.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>Due: <strong className="text-slate-700 font-mono">{t.dueDate}</strong></span>
                    <span>·</span>
                    <span className="capitalize">{t.priority} priority</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {t.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
