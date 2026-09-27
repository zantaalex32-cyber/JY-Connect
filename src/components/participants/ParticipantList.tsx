import React, { useState } from 'react';
import {
  Plus,
  Search,
  Users,
  Shield,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Phone,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle,
  FileText
} from 'lucide-react';
import {
  JuniorYouthParticipant,
  JuniorYouthGroup,
  UserRole
} from '../../types';
import { BahaiNinePointedStar } from '../common/BahaiArt';

interface ParticipantListProps {
  participants: JuniorYouthParticipant[];
  groups: JuniorYouthGroup[];
  currentRole: UserRole;
  privacyProtectionEnabled: boolean;
  onSaveParticipant: (participant: JuniorYouthParticipant) => void;
  onDeleteParticipant: (participantId: string) => void;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  groups,
  currentRole,
  privacyProtectionEnabled,
  onSaveParticipant,
  onDeleteParticipant
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [selectedParticipant, setSelectedParticipant] = useState<JuniorYouthParticipant | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [revealContactId, setRevealContactId] = useState<string | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  const canEdit = currentRole === 'admin' || currentRole === 'coordinator' || currentRole === 'animator';
  const canDelete = currentRole === 'admin' || currentRole === 'coordinator';

  // Form State
  const [formData, setFormData] = useState<Partial<JuniorYouthParticipant>>({
    name: '',
    age: 12,
    dateOfBirth: '',
    groupId: groups[0]?.id || '',
    neighborhood: '',
    parentGuardianName: '',
    parentGuardianContact: '',
    dateJoined: new Date().toISOString().split('T')[0],
    attendanceCount: 0,
    absencesCount: 0,
    participationNotes: '',
    activitiesJoined: [],
    serviceProjectsJoined: [],
    notes: ''
  });

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.parentGuardianName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = groupFilter === 'all' || p.groupId === groupFilter;
    return matchesSearch && matchesGroup;
  });

  const handleOpenCreateModal = () => {
    setFormData({
      id: 'jy-' + Date.now(),
      name: '',
      age: 12,
      dateOfBirth: '',
      groupId: groups[0]?.id || '',
      neighborhood: '',
      parentGuardianName: '',
      parentGuardianContact: '',
      dateJoined: new Date().toISOString().split('T')[0],
      attendanceCount: 0,
      absencesCount: 0,
      participationNotes: '',
      activitiesJoined: [],
      serviceProjectsJoined: [],
      notes: ''
    });
    setIsEditing(true);
    setSelectedParticipant(null);
  };

  const handleOpenEditModal = (p: JuniorYouthParticipant) => {
    setFormData({ ...p });
    setIsEditing(true);
    setSelectedParticipant(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const participantToSave: JuniorYouthParticipant = {
      id: formData.id || 'jy-' + Date.now(),
      name: formData.name.trim(),
      age: Number(formData.age) || 12,
      dateOfBirth: formData.dateOfBirth,
      groupId: formData.groupId || '',
      neighborhood: formData.neighborhood || '',
      parentGuardianName: formData.parentGuardianName || '',
      parentGuardianContact: formData.parentGuardianContact || '',
      dateJoined: formData.dateJoined || new Date().toISOString().split('T')[0],
      attendanceCount: formData.attendanceCount || 0,
      absencesCount: formData.absencesCount || 0,
      participationNotes: formData.participationNotes || '',
      activitiesJoined: formData.activitiesJoined || [],
      serviceProjectsJoined: formData.serviceProjectsJoined || [],
      notes: formData.notes || ''
    };

    onSaveParticipant(participantToSave);
    setIsEditing(false);
  };

  // Mask contact if privacy enabled and not revealed
  const getMaskedContact = (id: string, contact: string) => {
    if (!contact) return 'Not recorded';
    if (!privacyProtectionEnabled) return contact;
    if (revealContactId === id || currentRole === 'admin') return contact;
    // Mask middle digits
    return contact.replace(/(\d{3})\d+(\d{2})/, '$1-•••-••$2');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
              Junior Youth Profiles
            </h1>
            <BahaiNinePointedStar size={16} color="#0284c7" />
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Individual participant records, guardian contacts, participation notes, and privacy protections.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>Add Participant</span>
          </button>
        )}
      </div>

      {/* Privacy Notice Banner */}
      <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-xs text-sky-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-sky-700 shrink-0" />
          <span>
            <strong>Minor Privacy Safeguards:</strong> Personal guardian contacts are masked by default. Only authorized animators and coordinators can unmask contact records.
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by participant name, neighborhood, or guardian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
          />
        </div>

        {/* Group Selector Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Filter Group:</span>
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">All Groups ({participants.length})</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Participant List Table / Cards */}
      {filteredParticipants.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <Users className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">No Junior Youth profiles found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {participants.length === 0
              ? 'Your community database currently has no participants enrolled. Add your first participant to begin tracking.'
              : 'No participants matched your current search filters.'}
          </p>
          {canEdit && participants.length === 0 && (
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
            >
              + Add First Participant
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Name & Age</th>
                  <th className="px-4 py-3">Assigned Group</th>
                  <th className="px-4 py-3">Neighborhood</th>
                  <th className="px-4 py-3">Parent / Guardian</th>
                  <th className="px-4 py-3">Guardian Contact</th>
                  <th className="px-4 py-3">Joined Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredParticipants.map((p, idx) => {
                  const grp = groups.find((g) => g.id === p.groupId);
                  const isRevealed = revealContactId === p.id;
                  const avatarColors = [
                    'bg-sky-600',
                    'bg-emerald-600',
                    'bg-indigo-600',
                    'bg-purple-600',
                    'bg-amber-600',
                    'bg-rose-600',
                    'bg-teal-600'
                  ];
                  const userColor = avatarColors[idx % avatarColors.length];

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      {/* Name & Age */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full ${userColor} text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-xs`}>
                            {p.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{p.name}</span>
                              <span className="text-sky-800 bg-sky-50 border border-sky-200 px-1.5 py-0.2 rounded text-[10px] font-bold">
                                {p.age} yrs
                              </span>
                            </div>
                            {p.dateOfBirth && (
                              <div className="text-[11px] text-slate-400">DOB: {p.dateOfBirth}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Group */}
                      <td className="px-4 py-3">
                        {grp ? (
                          <span className="font-semibold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[11px]">
                            {grp.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Neighborhood */}
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-700">{p.neighborhood || '—'}</span>
                      </td>

                      {/* Parent/Guardian */}
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-800">
                          {p.parentGuardianName || '—'}
                        </span>
                      </td>

                      {/* Guardian Contact (Privacy Safe) */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                            {getMaskedContact(p.id, p.parentGuardianContact)}
                          </span>
                          {p.parentGuardianContact && (
                            <button
                              onClick={() => setRevealContactId(isRevealed ? null : p.id)}
                              title={isRevealed ? 'Hide contact' : 'Reveal contact'}
                              className="text-slate-500 hover:text-slate-800 p-0.5"
                            >
                              {isRevealed ? (
                                <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                              ) : (
                                <Eye className="w-3.5 h-3.5 text-sky-600" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="px-4 py-3 font-mono text-slate-500">
                        {p.dateJoined || '—'}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedParticipant(p)}
                            title="View Full Profile & Notes"
                            className="p-1 text-sky-700 hover:bg-sky-50 rounded"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              title="Edit Profile"
                              className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => setDeleteConfirmationId(p.id)}
                              title="Delete Profile"
                              className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Participant Profile Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-700">
                  Junior Youth Profile
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedParticipant.name} ({selectedParticipant.age} years)
                </h2>
                <div className="text-xs text-slate-500">
                  Group: {groups.find((g) => g.id === selectedParticipant.groupId)?.name || 'Unassigned'}
                </div>
              </div>
              <button
                onClick={() => setSelectedParticipant(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 font-medium">Guardian Information</span>
                <p className="text-slate-900 font-semibold mt-1">
                  {selectedParticipant.parentGuardianName || 'None listed'}
                </p>
                <p className="text-slate-600 font-mono mt-0.5">
                  {selectedParticipant.parentGuardianContact || 'No contact provided'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 font-medium">Neighborhood & Enrolment</span>
                <p className="text-slate-900 font-semibold mt-1">
                  {selectedParticipant.neighborhood || 'Neighborhood not specified'}
                </p>
                <p className="text-slate-600 font-mono mt-0.5">
                  Joined: {selectedParticipant.dateJoined}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-semibold text-slate-900">Participation & Strengths</h4>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  {selectedParticipant.participationNotes || 'No participation observations recorded yet.'}
                </p>
              </div>

              {selectedParticipant.notes && (
                <div>
                  <h4 className="font-semibold text-slate-900">Confidential Animator Notes</h4>
                  <p className="text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                    {selectedParticipant.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedParticipant(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded"
              >
                Close
              </button>
              {canEdit && (
                <button
                  onClick={() => {
                    handleOpenEditModal(selectedParticipant);
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Participant Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {formData.id && participants.some((p) => p.id === formData.id)
                  ? 'Edit Participant Profile'
                  : 'Add Junior Youth Participant'}
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
                    Participant Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full or preferred name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Age</label>
                  <input
                    type="number"
                    min="10"
                    max="16"
                    value={formData.age || 12}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Assigned Group</label>
                  <select
                    value={formData.groupId || ''}
                    onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    <option value="">Unassigned</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block font-semibold text-slate-800 mb-1">Date Joined</label>
                  <input
                    type="date"
                    value={formData.dateJoined || ''}
                    onChange={(e) => setFormData({ ...formData, dateJoined: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Parent / Guardian</label>
                  <input
                    type="text"
                    placeholder="Guardian full name"
                    value={formData.parentGuardianName || ''}
                    onChange={(e) => setFormData({ ...formData, parentGuardianName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Guardian Phone/Contact</label>
                  <input
                    type="tel"
                    placeholder="e.g. 082-555-0192"
                    value={formData.parentGuardianContact || ''}
                    onChange={(e) => setFormData({ ...formData, parentGuardianContact: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Participation & Strengths</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Active in consultations, artistic, leads singing..."
                  value={formData.participationNotes || ''}
                  onChange={(e) => setFormData({ ...formData, participationNotes: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Confidential Notes</label>
                <textarea
                  rows={2}
                  placeholder="Private observations for animator/coordinator guidance..."
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
                  Save Profile
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
            <h3 className="font-bold text-sm text-red-600">Delete Participant Profile?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to remove this participant profile? This action will permanently remove their records.
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
                  onDeleteParticipant(deleteConfirmationId);
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
