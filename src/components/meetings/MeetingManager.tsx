import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertCircle,
  Edit2,
  Trash2,
  BookOpen,
  MapPin,
  TrendingUp,
  RotateCw,
  Users
} from 'lucide-react';
import {
  Meeting,
  JuniorYouthGroup,
  JuniorYouthParticipant,
  Material,
  AttendanceStatus,
  UserRole
} from '../../types';
import { BahaiNinePointedStar } from '../common/BahaiArt';

interface MeetingManagerProps {
  meetings: Meeting[];
  groups: JuniorYouthGroup[];
  participants: JuniorYouthParticipant[];
  materials: Material[];
  currentRole: UserRole;
  onSaveMeeting: (meeting: Meeting) => void;
  onDeleteMeeting: (meetingId: string) => void;
  onUpdateAttendance: (meetingId: string, participantId: string, status: AttendanceStatus) => void;
}

export const MeetingManager: React.FC<MeetingManagerProps> = ({
  meetings,
  groups,
  participants,
  materials,
  currentRole,
  onSaveMeeting,
  onDeleteMeeting,
  onUpdateAttendance
}) => {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  const canEdit = currentRole === 'admin' || currentRole === 'coordinator' || currentRole === 'animator';

  // Form State
  const [formData, setFormData] = useState<Partial<Meeting>>({
    groupId: groups[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    location: '',
    sessionTopic: '',
    materialId: '',
    materialTitle: '',
    unitOrLesson: '',
    activities: '',
    attendance: {},
    reflection: '',
    followUpActions: '',
    notes: '',
    isRecurring: false,
    recurringPattern: 'weekly'
  });

  const filteredMeetings = meetings
    .filter((m) => groupFilter === 'all' || m.groupId === groupFilter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleOpenCreateModal = () => {
    const defaultGroup = groups[0];
    setFormData({
      id: 'meet-' + Date.now(),
      groupId: defaultGroup?.id || '',
      date: new Date().toISOString().split('T')[0],
      time: defaultGroup?.meetingTime?.split('-')[0]?.trim() || '10:00 AM',
      location: defaultGroup?.meetingVenue || defaultGroup?.location || '',
      sessionTopic: '',
      materialId: materials[0]?.id || '',
      materialTitle: materials[0]?.title || '',
      unitOrLesson: 'Lesson 1',
      activities: 'Opening reflection, reading passage, pair discussion, cooperative game',
      attendance: {},
      reflection: '',
      followUpActions: '',
      notes: '',
      isRecurring: false,
      recurringPattern: 'weekly'
    });
    setIsEditing(true);
    setSelectedMeeting(null);
  };

  const handleOpenEditModal = (m: Meeting) => {
    setFormData({ ...m });
    setIsEditing(true);
    setSelectedMeeting(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.groupId) return;

    const selectedMat = materials.find((m) => m.id === formData.materialId);

    const meetingToSave: Meeting = {
      id: formData.id || 'meet-' + Date.now(),
      groupId: formData.groupId,
      date: formData.date || new Date().toISOString().split('T')[0],
      time: formData.time || '10:00 AM',
      location: formData.location || '',
      sessionTopic: formData.sessionTopic || 'Junior Youth Study Session',
      materialId: formData.materialId,
      materialTitle: selectedMat ? selectedMat.title : formData.materialTitle,
      unitOrLesson: formData.unitOrLesson || '',
      activities: formData.activities || '',
      attendance: formData.attendance || {},
      reflection: formData.reflection || '',
      followUpActions: formData.followUpActions || '',
      notes: formData.notes || '',
      isRecurring: Boolean(formData.isRecurring),
      recurringPattern: formData.recurringPattern || 'weekly'
    };

    onSaveMeeting(meetingToSave);
    setIsEditing(false);
  };

  // Quick Attendance Status Toggle
  const handleQuickStatus = (meeting: Meeting, participantId: string, status: AttendanceStatus) => {
    onUpdateAttendance(meeting.id, participantId, status);
    if (selectedMeeting?.id === meeting.id) {
      setSelectedMeeting({
        ...selectedMeeting,
        attendance: {
          ...selectedMeeting.attendance,
          [participantId]: status
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
              Meetings & Attendance Tracker
            </h1>
            <BahaiNinePointedStar size={16} color="#0284c7" />
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Record meeting plans, track attendance with dignity, and document group reflections.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>Schedule Meeting</span>
          </button>
        )}
      </div>

      {/* Filter and Overview */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Select Group:</span>
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
          >
            <option value="all">All Groups ({meetings.length} meetings)</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span>Attendance Legend:</span>
          <span className="text-emerald-700 font-medium">● Present</span>
          <span className="text-red-700 font-medium">● Absent</span>
          <span className="text-amber-700 font-medium">● Late</span>
          <span className="text-sky-700 font-medium">● Excused</span>
        </div>
      </div>

      {/* Meetings List / Cards */}
      {filteredMeetings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">No meetings recorded yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {meetings.length === 0
              ? 'Schedule your first Junior Youth meeting to plan the session and mark participant attendance.'
              : 'No meetings found for the selected group filter.'}
          </p>
          {canEdit && meetings.length === 0 && (
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
            >
              + Schedule First Meeting
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMeetings.map((meeting) => {
            const group = groups.find((g) => g.id === meeting.groupId);
            const groupMembers = participants.filter((p) => p.groupId === meeting.groupId);

            // Compute meeting attendance rate
            const markedEntries = Object.entries(meeting.attendance || {});
            const presentCount = markedEntries.filter(
              ([_, st]) => st === 'present' || st === 'late'
            ).length;
            const totalMarked = groupMembers.length > 0 ? groupMembers.length : markedEntries.length;
            const attendancePct =
              totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0;

            return (
              <div
                key={meeting.id}
                className="bg-white border border-slate-200 rounded-lg p-5 hover:border-sky-300 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                        {group?.name || 'Junior Youth Group'}
                      </span>
                      {meeting.isRecurring && (
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <RotateCw className="w-3 h-3 text-slate-400" />
                          <span>Recurring ({meeting.recurringPattern})</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {meeting.sessionTopic || 'Empowerment Study Session'}
                    </h3>
                    <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1 font-mono font-medium text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {meeting.date} at {meeting.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {meeting.location || 'Meeting Venue'}
                      </span>
                      {meeting.materialTitle && (
                        <span className="flex items-center gap-1 text-slate-700 font-medium">
                          <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                          {meeting.materialTitle} {meeting.unitOrLesson ? `(${meeting.unitOrLesson})` : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Attendance Summary Badge & Action Controls */}
                  <div className="flex items-center gap-3">
                    <div className={`rounded px-3 py-1.5 text-center border ${
                      attendancePct >= 80
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : attendancePct >= 50
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}>
                      <div className="text-[10px] uppercase font-bold tracking-wider">
                        Attendance
                      </div>
                      <div className="text-sm font-bold font-mono tabular-nums">
                        {presentCount}/{totalMarked}{' '}
                        <span className="text-xs font-normal">({attendancePct}%)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedMeeting(meeting)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-sky-600 rounded hover:bg-sky-700 shadow-xs transition-colors"
                    >
                      Open Attendance
                    </button>

                    {canEdit && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(meeting)}
                          title="Edit Meeting Details"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmationId(meeting.id)}
                          title="Delete Meeting"
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline Quick Attendance Marking Row for Group Members */}
                {groupMembers.length > 0 ? (
                  <div className="mt-3 pt-2">
                    <div className="text-[11px] font-semibold text-slate-500 mb-2">
                      Mark Participants (Click status to update):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      {groupMembers.map((member) => {
                        const status = meeting.attendance[member.id] || 'present';
                        return (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                          >
                            <span className="font-semibold text-slate-900 truncate mr-2">
                              {member.name}
                            </span>
                            <div className="flex items-center gap-1">
                              {(['present', 'late', 'absent', 'excused'] as AttendanceStatus[]).map(
                                (st) => (
                                  <button
                                    key={st}
                                    onClick={() => handleQuickStatus(meeting, member.id, st)}
                                    title={`Mark ${st}`}
                                    className={`px-1.5 py-0.5 text-[10px] font-semibold rounded uppercase ${
                                      status === st
                                        ? st === 'present'
                                          ? 'bg-emerald-600 text-white'
                                          : st === 'late'
                                          ? 'bg-amber-600 text-white'
                                          : st === 'absent'
                                          ? 'bg-red-600 text-white'
                                          : 'bg-sky-600 text-white'
                                        : 'bg-white text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {st[0]}
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-slate-500 italic">
                    No participants currently enrolled in this group. Enroll participants in the Junior Youth tab to track attendance.
                  </div>
                )}

                {/* Reflection & Follow-up teaser */}
                {(meeting.reflection || meeting.followUpActions) && (
                  <div className="mt-3 pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {meeting.reflection && (
                      <div>
                        <span className="font-semibold text-slate-800">Animator Reflection: </span>
                        <span className="text-slate-600">{meeting.reflection}</span>
                      </div>
                    )}
                    {meeting.followUpActions && (
                      <div>
                        <span className="font-semibold text-slate-800">Follow-up: </span>
                        <span className="text-slate-600">{meeting.followUpActions}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Meeting Full Attendance & Reflection Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-700">
                  Meeting Session & Attendance Record
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedMeeting.sessionTopic || 'Study Session'}
                </h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  {groups.find((g) => g.id === selectedMeeting.groupId)?.name} · {selectedMeeting.date}
                </div>
              </div>
              <button
                onClick={() => setSelectedMeeting(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Attendance Roster */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Participant Attendance Sheet
              </h3>
              {participants.filter((p) => p.groupId === selectedMeeting.groupId).length === 0 ? (
                <p className="text-xs text-slate-500 italic p-4 bg-slate-50 border border-slate-200 rounded">
                  No participants are assigned to this group yet. Add participants to mark attendance.
                </p>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded">
                  {participants
                    .filter((p) => p.groupId === selectedMeeting.groupId)
                    .map((p) => {
                      const status = selectedMeeting.attendance[p.id] || 'present';
                      return (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-3 text-xs hover:bg-slate-50"
                        >
                          <div>
                            <span className="font-semibold text-slate-900">{p.name}</span>
                            <span className="text-slate-400 ml-2">({p.neighborhood})</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {(
                              [
                                { status: 'present', label: 'Present', color: 'emerald' },
                                { status: 'late', label: 'Late', color: 'amber' },
                                { status: 'absent', label: 'Absent', color: 'red' },
                                { status: 'excused', label: 'Excused', color: 'sky' }
                              ] as const
                            ).map((st) => (
                              <button
                                key={st.status}
                                onClick={() => handleQuickStatus(selectedMeeting, p.id, st.status)}
                                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                                  status === st.status
                                    ? 'bg-slate-900 text-white font-semibold'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                {st.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Reflection Notes */}
            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-semibold text-slate-900">Session Activities</h4>
                <p className="text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                  {selectedMeeting.activities || 'No activities logged.'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Animator Reflection & Insights</h4>
                <p className="text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                  {selectedMeeting.reflection || 'No reflection notes recorded yet.'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Follow-up Tasks</h4>
                <p className="text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                  {selectedMeeting.followUpActions || 'No follow-up items recorded.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedMeeting(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule / Edit Meeting Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {formData.id && meetings.some((m) => m.id === formData.id)
                  ? 'Edit Meeting Details'
                  : 'Schedule Junior Youth Meeting'}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Group <span className="text-red-600">*</span>
                  </label>
                  <select
                    required
                    value={formData.groupId || ''}
                    onChange={(e) => {
                      const g = groups.find((grp) => grp.id === e.target.value);
                      setFormData({
                        ...formData,
                        groupId: e.target.value,
                        location: g?.meetingVenue || g?.location || formData.location
                      });
                    }}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Session Topic</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Confirmations & Perseverance"
                    value={formData.sessionTopic || ''}
                    onChange={(e) => setFormData({ ...formData, sessionTopic: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Time</label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={formData.time || ''}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Unit / Lesson</label>
                  <input
                    type="text"
                    placeholder="e.g. Lesson 5"
                    value={formData.unitOrLesson || ''}
                    onChange={(e) => setFormData({ ...formData, unitOrLesson: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Material / Text</label>
                  <select
                    value={formData.materialId || ''}
                    onChange={(e) => {
                      const m = materials.find((mat) => mat.id === e.target.value);
                      setFormData({
                        ...formData,
                        materialId: e.target.value,
                        materialTitle: m ? m.title : ''
                      });
                    }}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    <option value="">Select Text...</option>
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Venue / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Community Centre Room 2B"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Recurring Option */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isRecurring || false}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  />
                  <span>Recurring Weekly Meeting</span>
                </label>
                {formData.isRecurring && (
                  <select
                    value={formData.recurringPattern || 'weekly'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recurringPattern: e.target.value as any
                      })
                    }
                    className="px-2 py-1 border border-slate-300 rounded bg-white"
                  >
                    <option value="weekly">Every Week</option>
                    <option value="biweekly">Every 2 Weeks</option>
                    <option value="monthly">Monthly</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Activities Planned
                </label>
                <textarea
                  rows={2}
                  placeholder="Opening prayer/reflection, text study, discussion questions, cooperative games..."
                  value={formData.activities || ''}
                  onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Reflection & Insights
                  </label>
                  <textarea
                    rows={2}
                    placeholder="How did the consultation go? What virtues emerged?"
                    value={formData.reflection || ''}
                    onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Follow-up Actions
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Actions before next meeting, supplies to bring, parents to contact..."
                    value={formData.followUpActions || ''}
                    onChange={(e) => setFormData({ ...formData, followUpActions: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800"
                >
                  Save Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-sm w-full p-5 space-y-4">
            <h3 className="font-bold text-sm text-red-600">Delete Meeting Record?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete this meeting? Its associated attendance logs will be removed.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmationId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteMeeting(deleteConfirmationId);
                  setDeleteConfirmationId(null);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
