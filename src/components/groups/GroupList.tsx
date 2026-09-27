import React, { useState } from 'react';
import {
  Plus,
  Users,
  MapPin,
  Clock,
  Calendar,
  Edit2,
  Trash2,
  AlertCircle,
  Search,
  BookOpen,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  History
} from 'lucide-react';
import {
  JuniorYouthGroup,
  JuniorYouthParticipant,
  Animator,
  Meeting,
  ServiceProject,
  CampOrEvent,
  StudyCycle,
  GroupTimelineEntry,
  UserRole
} from '../../types';
import { BahaiNinePointedStar } from '../common/BahaiArt';
import { GroupTimeline } from './GroupTimeline';

interface GroupListProps {
  groups: JuniorYouthGroup[];
  participants: JuniorYouthParticipant[];
  animators: Animator[];
  meetings: Meeting[];
  serviceProjects: ServiceProject[];
  events?: CampOrEvent[];
  studyCycles?: StudyCycle[];
  timelineEntries?: GroupTimelineEntry[];
  currentRole: UserRole;
  onSaveGroup: (group: JuniorYouthGroup) => void;
  onDeleteGroup: (groupId: string) => void;
  onNavigateToParticipants: (groupId: string) => void;
  onNavigateToMeetings: (groupId: string) => void;
  onAddTimelineEntry?: (entry: GroupTimelineEntry) => void;
}

export const GroupList: React.FC<GroupListProps> = ({
  groups,
  participants,
  animators,
  meetings,
  serviceProjects,
  events = [],
  studyCycles = [],
  timelineEntries = [],
  currentRole,
  onSaveGroup,
  onDeleteGroup,
  onNavigateToParticipants,
  onNavigateToMeetings,
  onAddTimelineEntry
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'forming' | 'paused' | 'concluded'>('all');
  const [selectedGroup, setSelectedGroup] = useState<JuniorYouthGroup | null>(null);
  const [timelineGroup, setTimelineGroup] = useState<JuniorYouthGroup | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  // Form State for create/edit
  const [formData, setFormData] = useState<Partial<JuniorYouthGroup>>({
    name: '',
    location: '',
    neighborhood: '',
    areaOfActivity: '',
    meetingVenue: '',
    meetingDay: 'Saturday',
    meetingTime: '10:00 AM - 12:00 PM',
    animatorIds: [],
    startDate: new Date().toISOString().split('T')[0],
    status: 'active',
    goals: '',
    notes: '',
    activitiesSummary: ''
  });

  const canEdit = currentRole === 'admin' || currentRole === 'coordinator' || currentRole === 'animator';
  const canDelete = currentRole === 'admin' || currentRole === 'coordinator';

  // Filter groups
  const filteredGroups = groups.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreateModal = () => {
    setFormData({
      id: 'grp-' + Date.now(),
      name: '',
      location: '',
      neighborhood: '',
      areaOfActivity: '',
      meetingVenue: '',
      meetingDay: 'Saturday',
      meetingTime: '10:00 AM - 12:00 PM',
      animatorIds: [],
      jyParticipantIds: [],
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      goals: '',
      notes: '',
      activitiesSummary: ''
    });
    setIsEditing(true);
    setSelectedGroup(null);
  };

  const handleOpenEditModal = (group: JuniorYouthGroup) => {
    setFormData({ ...group });
    setIsEditing(true);
    setSelectedGroup(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const groupToSave: JuniorYouthGroup = {
      id: formData.id || 'grp-' + Date.now(),
      name: formData.name.trim(),
      location: formData.location || '',
      neighborhood: formData.neighborhood || '',
      areaOfActivity: formData.areaOfActivity || '',
      meetingVenue: formData.meetingVenue || '',
      meetingDay: formData.meetingDay || 'Saturday',
      meetingTime: formData.meetingTime || '10:00 AM',
      animatorIds: formData.animatorIds || [],
      jyParticipantIds: formData.jyParticipantIds || [],
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      status: formData.status || 'active',
      goals: formData.goals || '',
      notes: formData.notes || '',
      activitiesSummary: formData.activitiesSummary || '',
      currentMaterialId: formData.currentMaterialId,
      currentSection: formData.currentSection
    };

    onSaveGroup(groupToSave);
    setIsEditing(false);
  };

  const handleConfirmDelete = (id: string) => {
    onDeleteGroup(id);
    setDeleteConfirmationId(null);
    if (selectedGroup?.id === id) {
      setSelectedGroup(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
              Junior Youth Groups
            </h1>
            <BahaiNinePointedStar size={16} color="#0284c7" />
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage local groups, meeting venues, animator assignments, and service cycles.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>Create New Group</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by group name, neighborhood, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
          />
        </div>

        {/* Status Filter Tabs (Solid buttons, no pills) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600">
          {(['all', 'active', 'forming', 'paused', 'concluded'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Groups List or Empty State */}
      {filteredGroups.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <Users className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">No Junior Youth groups found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {groups.length === 0
              ? 'Your community database currently has no groups registered. Click below to add your first group.'
              : 'No groups matched your active search or status filter.'}
          </p>
          {canEdit && groups.length === 0 && (
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
            >
              + Create First Group
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group, idx) => {
            const groupParticipants = participants.filter((p) => p.groupId === group.id);
            const groupAnimators = animators.filter((a) => group.animatorIds.includes(a.id));
            const groupMeetings = meetings.filter((m) => m.groupId === group.id);
            const groupProjects = serviceProjects.filter((p) => p.groupId === group.id);
            const hasNoAnimators = group.animatorIds.length === 0;

            const avatarColors = [
              'bg-sky-600',
              'bg-emerald-600',
              'bg-indigo-600',
              'bg-purple-600',
              'bg-amber-600',
              'bg-teal-600',
              'bg-rose-600'
            ];
            const groupColor = avatarColors[idx % avatarColors.length];

            return (
              <div
                key={group.id}
                className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-sky-400 hover:shadow-xs transition-colors"
              >
                <div>
                  {/* Card Header: Avatar, Title & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className={`w-9 h-9 rounded-lg ${groupColor} text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-xs`}>
                        {group.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{group.name}</h3>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-sky-600 shrink-0" />
                          <span>{group.neighborhood || group.location || 'Neighborhood unassigned'}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${
                        group.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : group.status === 'forming'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {group.status}
                    </span>
                  </div>

                  {/* Warning if no animators assigned */}
                  {hasNoAnimators && (
                    <div className="mt-2.5 text-[11px] text-amber-900 bg-amber-100/70 border border-amber-300 font-medium rounded px-2.5 py-1 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Needs animator assignment</span>
                    </div>
                  )}

                  {/* Key metadata lines */}
                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        {group.meetingDay}, {group.meetingTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{group.meetingVenue || 'Venue not specified'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span>
                        <strong className="text-slate-900 font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                          {groupParticipants.length}
                        </strong>{' '}
                        Junior Youth enrolled
                      </span>
                    </div>
                  </div>

                  {/* Animators list */}
                  <div className="mt-3 pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-500 font-semibold">Animators: </span>
                    {groupAnimators.length === 0 ? (
                      <span className="text-amber-800 font-medium italic">None assigned</span>
                    ) : (
                      <span className="text-slate-800 font-semibold">
                        {groupAnimators.map((a) => a.name).join(', ')}
                      </span>
                    )}
                  </div>

                  {/* Goals or notes teaser */}
                  {group.goals && (
                    <p className="mt-2 text-[11px] text-slate-500 line-clamp-2 italic">
                      "{group.goals}"
                    </p>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedGroup(group)}
                    className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded border border-sky-200 transition-colors"
                  >
                    <span>View Group Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setTimelineGroup(group)}
                      title="Group Timeline & History"
                      className="p-1.5 text-slate-600 hover:text-sky-800 hover:bg-sky-50 rounded"
                    >
                      <History className="w-3.5 h-3.5" />
                    </button>
                    {canEdit && (
                      <button
                        onClick={() => handleOpenEditModal(group)}
                        title="Edit Group"
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => setDeleteConfirmationId(group.id)}
                        title="Delete Group"
                        className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Group Detail Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-700">
                  Junior Youth Group Profile
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">{selectedGroup.name}</h2>
                <div className="text-xs text-slate-500 mt-1">
                  Status: <strong className="capitalize text-slate-800">{selectedGroup.status}</strong> · Started {selectedGroup.startDate}
                </div>
              </div>
              <button
                onClick={() => setSelectedGroup(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Grid of Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 font-medium">Meeting Schedule</span>
                <p className="text-slate-900 font-semibold mt-1">
                  {selectedGroup.meetingDay}, {selectedGroup.meetingTime}
                </p>
                <p className="text-slate-600 mt-0.5">{selectedGroup.meetingVenue || 'Venue not specified'}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 font-medium">Neighborhood & Cluster Area</span>
                <p className="text-slate-900 font-semibold mt-1">
                  {selectedGroup.neighborhood || selectedGroup.location}
                </p>
                <p className="text-slate-600 mt-0.5">{selectedGroup.areaOfActivity || 'Cluster territory'}</p>
              </div>
            </div>

            {/* Goals and Activities */}
            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-semibold text-slate-900">Group Goals & Vision</h4>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  {selectedGroup.goals || 'No specific goals set yet.'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Activities Summary</h4>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  {selectedGroup.activitiesSummary || 'Study of Junior Youth texts, cooperative games, community service.'}
                </p>
              </div>
              {selectedGroup.notes && (
                <div>
                  <h4 className="font-semibold text-slate-900">Consultation Notes</h4>
                  <p className="text-slate-600 mt-1 leading-relaxed">{selectedGroup.notes}</p>
                </div>
              )}
            </div>

            {/* Quick Links inside group detail */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  onNavigateToParticipants(selectedGroup.id);
                  setSelectedGroup(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 border border-sky-200 rounded hover:bg-sky-100 transition-colors flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>View {participants.filter((p) => p.groupId === selectedGroup.id).length} Participants</span>
              </button>

              <button
                onClick={() => {
                  onNavigateToMeetings(selectedGroup.id);
                  setSelectedGroup(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-300 rounded hover:bg-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>View Meetings & Attendance</span>
              </button>

              <button
                onClick={() => {
                  setTimelineGroup(selectedGroup);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 border border-sky-200 rounded hover:bg-sky-100 transition-colors flex items-center gap-1.5"
              >
                <History className="w-3.5 h-3.5" />
                <span>Group History & Timeline</span>
              </button>

              {canEdit && (
                <button
                  onClick={() => handleOpenEditModal(selectedGroup)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 ml-auto transition-colors"
                >
                  Edit Details
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Group Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {formData.id && groups.some((g) => g.id === formData.id)
                  ? 'Edit Junior Youth Group'
                  : 'Register New Junior Youth Group'}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Group Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Breezes of Hope Group"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Neighborhood</label>
                  <input
                    type="text"
                    placeholder="e.g. North Ward"
                    value={formData.neighborhood || ''}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Location / City</label>
                  <input
                    type="text"
                    placeholder="e.g. Community Centre"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Meeting Day</label>
                  <select
                    value={formData.meetingDay || 'Saturday'}
                    onChange={(e) => setFormData({ ...formData, meetingDay: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                      (d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Meeting Time</label>
                  <input
                    type="text"
                    placeholder="10:00 AM - 12:00 PM"
                    value={formData.meetingTime || ''}
                    onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Status</label>
                  <select
                    value={formData.status || 'active'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any
                      })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="forming">Forming</option>
                    <option value="paused">Paused</option>
                    <option value="concluded">Concluded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Meeting Venue</label>
                <input
                  type="text"
                  placeholder="e.g. Room 2B, North Ward Community Centre"
                  value={formData.meetingVenue || ''}
                  onChange={(e) => setFormData({ ...formData, meetingVenue: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Assign Animators
                </label>
                {animators.length === 0 ? (
                  <p className="text-slate-500 italic">
                    No animators in directory yet. You can register animators in the Animators tab.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 border border-slate-200 p-2 rounded max-h-32 overflow-y-auto">
                    {animators.map((a) => {
                      const isAssigned = (formData.animatorIds || []).includes(a.id);
                      return (
                        <label
                          key={a.id}
                          className="flex items-center gap-2 text-slate-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isAssigned}
                            onChange={(e) => {
                              const currentIds = formData.animatorIds || [];
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  animatorIds: [...currentIds, a.id]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  animatorIds: currentIds.filter((id) => id !== a.id)
                                });
                              }
                            }}
                          />
                          <span>{a.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Goals & Vision</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Complete Breezes of Confirmation and organize a community tree-planting project."
                  value={formData.goals || ''}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  placeholder="Additional notes for coordinators and animators..."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
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
                  Save Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>Confirm Deletion</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this Junior Youth group? This action will remove the group from active listings.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmationId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDelete(deleteConfirmationId)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 rounded hover:bg-red-700"
              >
                Delete Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Timeline Modal */}
      {timelineGroup && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-sky-700" />
                <h2 className="text-base font-bold text-slate-900">
                  {timelineGroup.name} — Group History & Timeline
                </h2>
              </div>
              <button
                onClick={() => setTimelineGroup(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <GroupTimeline
              group={timelineGroup}
              timelineEntries={timelineEntries}
              meetings={meetings}
              serviceProjects={serviceProjects}
              events={events}
              studyCycles={studyCycles}
              currentRole={currentRole}
              onAddTimelineEntry={(entry) => {
                if (onAddTimelineEntry) onAddTimelineEntry(entry);
              }}
            />

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setTimelineGroup(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800"
              >
                Close Timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
