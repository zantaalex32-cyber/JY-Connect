import React, { useState } from 'react';
import {
  Plus,
  Search,
  HeartHandshake,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  Edit2,
  Trash2,
  Award,
  Calendar,
  BookOpen,
  Users
} from 'lucide-react';
import {
  Animator,
  JuniorYouthGroup,
  TrainingStatus,
  UserRole
} from '../../types';
import { BahaiNinePointedStar } from '../common/BahaiArt';

interface AnimatorListProps {
  animators: Animator[];
  groups: JuniorYouthGroup[];
  currentRole: UserRole;
  onSaveAnimator: (animator: Animator) => void;
  onDeleteAnimator: (animatorId: string) => void;
}

export const AnimatorList: React.FC<AnimatorListProps> = ({
  animators,
  groups,
  currentRole,
  onSaveAnimator,
  onDeleteAnimator
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trainingFilter, setTrainingFilter] = useState<string>('all');
  const [selectedAnimator, setSelectedAnimator] = useState<Animator | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  const canEdit = currentRole === 'admin' || currentRole === 'coordinator';

  // Form State
  const [formData, setFormData] = useState<Partial<Animator>>({
    name: '',
    contact: '',
    email: '',
    groupIds: [],
    trainingStatus: 'book_5_completed',
    booksStudied: ['Ruhi Book 1', 'Ruhi Book 5'],
    experienceYears: 1,
    availability: 'weekends',
    responsibilities: 'Weekly session facilitation, group consultation, parent contact',
    activities: '',
    notes: ''
  });

  const trainingLabels: Record<TrainingStatus, string> = {
    fully_certified: 'Fully Certified (Books 1, 5, 7+)',
    book_5_completed: 'Ruhi Book 5 Completed',
    in_training: 'Currently in Book 5 Training',
    orientation: 'Youth Orientation'
  };

  // Find groups needing animators
  const groupsNeedingAnimators = groups.filter((g) => g.animatorIds.length === 0);

  const filteredAnimators = animators.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTraining = trainingFilter === 'all' || a.trainingStatus === trainingFilter;
    return matchesSearch && matchesTraining;
  });

  const handleOpenCreateModal = () => {
    setFormData({
      id: 'anim-' + Date.now(),
      name: '',
      contact: '',
      email: '',
      groupIds: [],
      trainingStatus: 'book_5_completed',
      booksStudied: ['Ruhi Book 1', 'Ruhi Book 5'],
      experienceYears: 1,
      availability: 'weekends',
      responsibilities: 'Weekly session facilitation, group consultation, parent contact',
      activities: '',
      notes: ''
    });
    setIsEditing(true);
    setSelectedAnimator(null);
  };

  const handleOpenEditModal = (a: Animator) => {
    setFormData({ ...a });
    setIsEditing(true);
    setSelectedAnimator(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const animatorToSave: Animator = {
      id: formData.id || 'anim-' + Date.now(),
      name: formData.name.trim(),
      contact: formData.contact || '',
      email: formData.email || '',
      groupIds: formData.groupIds || [],
      trainingStatus: formData.trainingStatus || 'book_5_completed',
      booksStudied: formData.booksStudied || ['Ruhi Book 5'],
      experienceYears: Number(formData.experienceYears) || 0,
      availability: formData.availability || 'weekends',
      responsibilities: formData.responsibilities || '',
      activities: formData.activities || '',
      notes: formData.notes || ''
    };

    onSaveAnimator(animatorToSave);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
              Animators & Mentors Directory
            </h1>
            <BahaiNinePointedStar size={16} color="#0284c7" />
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Support, train, and assign animators guiding Junior Youth spiritual empowerment groups.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>Register Animator</span>
          </button>
        )}
      </div>

      {/* Cluster Animator Gap Analysis Widget */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-sky-600" />
              <span>Cluster Animator Coverage Overview</span>
            </div>
            <p className="text-xs text-slate-600">
              {animators.length} total animators registered across {groups.length} groups.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {groupsNeedingAnimators.length > 0 ? (
              <div className="bg-amber-50 border border-amber-300 rounded px-3 py-1.5 text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>
                  <strong>{groupsNeedingAnimators.length} group(s)</strong> require animator assignment: {groupsNeedingAnimators.map((g) => g.name).join(', ')}
                </span>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-300 rounded px-3 py-1.5 text-emerald-900 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>All active groups currently have assigned animators</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by animator name, contact, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
          />
        </div>

        {/* Training Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Training Status:</span>
          <select
            value={trainingFilter}
            onChange={(e) => setTrainingFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">All Statuses ({animators.length})</option>
            <option value="fully_certified">Fully Certified</option>
            <option value="book_5_completed">Book 5 Completed</option>
            <option value="in_training">In Training</option>
            <option value="orientation">Orientation</option>
          </select>
        </div>
      </div>

      {/* Animators Grid */}
      {filteredAnimators.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <HeartHandshake className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">No animators found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {animators.length === 0
              ? 'Your community database has no animators registered yet. Register your first animator below.'
              : 'No animators match your current search query.'}
          </p>
          {canEdit && animators.length === 0 && (
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
            >
              + Register First Animator
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAnimators.map((animator, idx) => {
            const assignedGroups = groups.filter((g) => animator.groupIds.includes(g.id));
            const avatarColors = [
              'bg-teal-600',
              'bg-indigo-600',
              'bg-sky-600',
              'bg-purple-600',
              'bg-emerald-600',
              'bg-amber-600'
            ];
            const animColor = avatarColors[idx % avatarColors.length];

            return (
              <div
                key={animator.id}
                className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-sky-400 hover:shadow-xs transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className={`w-9 h-9 rounded-lg ${animColor} text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-xs`}>
                        {animator.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{animator.name}</h3>
                        <div className="text-[11px] text-slate-500 mt-0.5 capitalize">
                          Availability: <span className="font-semibold text-slate-700">{animator.availability}</span> · {animator.experienceYears} yr(s) exp
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${
                        animator.trainingStatus === 'fully_certified'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : animator.trainingStatus === 'book_5_completed'
                          ? 'bg-sky-100 text-sky-800 border-sky-300'
                          : animator.trainingStatus === 'in_training'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-purple-100 text-purple-800 border-purple-300'
                      }`}
                    >
                      {animator.trainingStatus.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Contacts */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                    {animator.contact && (
                      <div className="flex items-center gap-1.5 font-mono text-slate-800">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{animator.contact}</span>
                      </div>
                    )}
                    {animator.email && (
                      <div className="flex items-center gap-1.5 truncate text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="truncate">{animator.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Assigned Groups */}
                  <div className="mt-3 pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-500 font-semibold">Assigned Groups: </span>
                    {assignedGroups.length === 0 ? (
                      <span className="text-amber-800 font-medium italic">Available for assignment</span>
                    ) : (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {assignedGroups.map((g) => (
                          <span
                            key={g.id}
                            className="bg-indigo-50 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded text-[11px] font-semibold"
                          >
                            {g.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Studied Books */}
                  <div className="mt-2.5 text-[11px] text-slate-700 flex flex-wrap items-center gap-1">
                    <span className="text-slate-500 font-medium">Courses:</span>
                    {animator.booksStudied.map((b, i) => (
                      <span key={i} className="bg-slate-100 text-slate-800 px-1.5 py-0.2 rounded border border-slate-200 text-[10px] font-medium">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedAnimator(animator)}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-900"
                  >
                    View Details
                  </button>

                  <div className="flex items-center gap-1">
                    {canEdit && (
                      <button
                        onClick={() => handleOpenEditModal(animator)}
                        title="Edit Animator"
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {canEdit && (
                      <button
                        onClick={() => setDeleteConfirmationId(animator.id)}
                        title="Delete Animator"
                        className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded"
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

      {/* Animator Details Modal */}
      {selectedAnimator && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-700">
                  Animator Record
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">{selectedAnimator.name}</h2>
                <div className="text-xs text-slate-500">
                  Training: {trainingLabels[selectedAnimator.trainingStatus]}
                </div>
              </div>
              <button
                onClick={() => setSelectedAnimator(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                <div className="font-semibold text-slate-800">Contact & Availability</div>
                <div className="text-slate-700">Phone: {selectedAnimator.contact || 'None'}</div>
                <div className="text-slate-700">Email: {selectedAnimator.email || 'None'}</div>
                <div className="text-slate-700 capitalize">
                  Availability: {selectedAnimator.availability}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Institute Courses & Materials Studied</h4>
                <p className="text-slate-600 mt-0.5">{selectedAnimator.booksStudied.join(', ')}</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Responsibilities</h4>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  {selectedAnimator.responsibilities || 'Weekly meetings, study cycles, and service project coordination.'}
                </p>
              </div>

              {selectedAnimator.notes && (
                <div>
                  <h4 className="font-semibold text-slate-900">Coordinator Notes</h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                    {selectedAnimator.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedAnimator(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded"
              >
                Close
              </button>
              {canEdit && (
                <button
                  onClick={() => handleOpenEditModal(selectedAnimator)}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800"
                >
                  Edit Record
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Animator Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {formData.id && animators.some((a) => a.id === formData.id)
                  ? 'Edit Animator Information'
                  : 'Register New Animator'}
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
                  Animator Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 082-444-1234"
                    value={formData.contact || ''}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. animator@example.org"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Training Status</label>
                  <select
                    value={formData.trainingStatus || 'book_5_completed'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trainingStatus: e.target.value as TrainingStatus
                      })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    <option value="fully_certified">Fully Certified (Books 1, 5, 7)</option>
                    <option value="book_5_completed">Ruhi Book 5 Completed</option>
                    <option value="in_training">In Book 5 Training</option>
                    <option value="orientation">Youth Orientation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Availability</label>
                  <select
                    value={formData.availability || 'weekends'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availability: e.target.value as any
                      })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    <option value="weekends">Weekends</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="flexible">Flexible</option>
                    <option value="limited">Limited</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Assign to Junior Youth Groups
                </label>
                {groups.length === 0 ? (
                  <p className="text-slate-500 italic">No groups registered yet.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 border border-slate-200 p-2 rounded max-h-32 overflow-y-auto">
                    {groups.map((g) => {
                      const isAssigned = (formData.groupIds || []).includes(g.id);
                      return (
                        <label
                          key={g.id}
                          className="flex items-center gap-2 text-slate-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isAssigned}
                            onChange={(e) => {
                              const currentIds = formData.groupIds || [];
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  groupIds: [...currentIds, g.id]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  groupIds: currentIds.filter((id) => id !== g.id)
                                });
                              }
                            }}
                          />
                          <span>{g.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Books & Materials Studied (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ruhi Book 1, Ruhi Book 5, Ruhi Book 7"
                  value={(formData.booksStudied || []).join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      booksStudied: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Coordinator & Mentor Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Support needs, observations, partner preferences..."
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
                  Save Animator
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
            <h3 className="font-bold text-sm text-red-600">Remove Animator Record?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to remove this animator? This will remove them from active group assignments.
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
                  onDeleteAnimator(deleteConfirmationId);
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
