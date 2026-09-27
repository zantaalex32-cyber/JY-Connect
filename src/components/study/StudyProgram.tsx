import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  CheckCircle,
  HelpCircle,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import {
  StudyCycle,
  JuniorYouthGroup,
  Material,
  UserRole
} from '../../types';
import { BahaiNinePointedStar } from '../common/BahaiArt';

interface StudyProgramProps {
  studyCycles: StudyCycle[];
  groups: JuniorYouthGroup[];
  materials: Material[];
  currentRole: UserRole;
  onSaveStudyCycle: (cycle: StudyCycle) => void;
  onDeleteStudyCycle: (cycleId: string) => void;
  onNavigateToMaterials: () => void;
}

export const StudyProgram: React.FC<StudyProgramProps> = ({
  studyCycles,
  groups,
  materials,
  currentRole,
  onSaveStudyCycle,
  onDeleteStudyCycle,
  onNavigateToMaterials
}) => {
  const [selectedCycle, setSelectedCycle] = useState<StudyCycle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [newQuestionInput, setNewQuestionInput] = useState('');
  const [newReflectionInput, setNewReflectionInput] = useState('');

  const canEdit = currentRole === 'admin' || currentRole === 'coordinator' || currentRole === 'animator';

  // Form State
  const [formData, setFormData] = useState<Partial<StudyCycle>>({
    groupId: groups[0]?.id || '',
    materialId: materials[0]?.id || '',
    materialTitle: materials[0]?.title || '',
    currentSection: 'Lesson 1',
    totalSections: 14,
    completedSections: 0,
    scheduledSessionsCount: 14,
    completedSessionsCount: 0,
    startDate: new Date().toISOString().split('T')[0],
    targetCompletionDate: '',
    notes: '',
    discussionQuestions: [],
    reflections: []
  });

  const filteredCycles = studyCycles.filter(
    (sc) => groupFilter === 'all' || sc.groupId === groupFilter
  );

  const handleOpenCreateModal = () => {
    const firstGroup = groups[0];
    const firstMat = materials[0];

    setFormData({
      id: 'cycle-' + Date.now(),
      groupId: firstGroup?.id || '',
      materialId: firstMat?.id || '',
      materialTitle: firstMat?.title || '',
      currentSection: 'Lesson 1',
      totalSections: 14,
      completedSections: 0,
      scheduledSessionsCount: 14,
      completedSessionsCount: 0,
      startDate: new Date().toISOString().split('T')[0],
      targetCompletionDate: '',
      notes: '',
      discussionQuestions: [
        'How does the central theme of this lesson relate to our friendships?',
        'What moral choices did the characters make in the story?'
      ],
      reflections: []
    });
    setIsEditing(true);
    setSelectedCycle(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.groupId || !formData.materialId) return;

    const chosenMat = materials.find((m) => m.id === formData.materialId);

    const cycleToSave: StudyCycle = {
      id: formData.id || 'cycle-' + Date.now(),
      groupId: formData.groupId,
      materialId: formData.materialId,
      materialTitle: chosenMat ? chosenMat.title : formData.materialTitle || 'Junior Youth Text',
      currentSection: formData.currentSection || 'Lesson 1',
      totalSections: Number(formData.totalSections) || 12,
      completedSections: Number(formData.completedSections) || 0,
      scheduledSessionsCount: Number(formData.scheduledSessionsCount) || 12,
      completedSessionsCount: Number(formData.completedSessionsCount) || 0,
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      targetCompletionDate: formData.targetCompletionDate,
      notes: formData.notes || '',
      discussionQuestions: formData.discussionQuestions || [],
      reflections: formData.reflections || []
    };

    onSaveStudyCycle(cycleToSave);
    setIsEditing(false);
  };

  const handleAddQuestionToCycle = (cycle: StudyCycle) => {
    if (!newQuestionInput.trim()) return;
    const updated = {
      ...cycle,
      discussionQuestions: [...cycle.discussionQuestions, newQuestionInput.trim()]
    };
    onSaveStudyCycle(updated);
    setSelectedCycle(updated);
    setNewQuestionInput('');
  };

  const handleAddReflectionToCycle = (cycle: StudyCycle) => {
    if (!newReflectionInput.trim()) return;
    const updated = {
      ...cycle,
      reflections: [...cycle.reflections, newReflectionInput.trim()]
    };
    onSaveStudyCycle(updated);
    setSelectedCycle(updated);
    setNewReflectionInput('');
  };

  const handleIncrementSection = (cycle: StudyCycle) => {
    if (cycle.completedSections >= cycle.totalSections) return;
    const nextCompleted = cycle.completedSections + 1;
    const updated = {
      ...cycle,
      completedSections: nextCompleted,
      completedSessionsCount: cycle.completedSessionsCount + 1,
      currentSection: `Lesson ${nextCompleted + 1}`
    };
    onSaveStudyCycle(updated);
    if (selectedCycle?.id === cycle.id) {
      setSelectedCycle(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
              Structured Study Program
            </h1>
            <BahaiNinePointedStar size={16} color="#0284c7" />
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Organize study cycles of Junior Youth texts, schedule lessons, and record group reflections.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onNavigateToMaterials}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          >
            Materials Library
          </button>
          {canEdit && (
            <button
              onClick={handleOpenCreateModal}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-sky-400" />
              <span>Create Study Cycle</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500 font-medium">Filter by Group:</span>
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <option value="all">All Groups ({studyCycles.length} cycles)</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {/* Study Cycles List */}
      {filteredCycles.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">No study cycles registered</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {studyCycles.length === 0
              ? 'Begin by creating a study cycle for a Junior Youth group, selecting a text such as Breezes of Confirmation or Wellspring of Joy.'
              : 'No study cycles match your selected filter.'}
          </p>
          {canEdit && studyCycles.length === 0 && (
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
            >
              + Create First Study Cycle
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCycles.map((cycle) => {
            const grp = groups.find((g) => g.id === cycle.groupId);
            const progress =
              cycle.totalSections > 0
                ? Math.round((cycle.completedSections / cycle.totalSections) * 100)
                : 0;

            return (
              <div
                key={cycle.id}
                className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-sky-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                        {grp ? grp.name : 'Junior Youth Group'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                        {cycle.materialTitle}
                      </h3>
                      <div className="text-xs text-slate-600 mt-0.5 font-medium">
                        Current: <strong className="text-slate-900">{cycle.currentSection}</strong>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-900 font-mono tabular-nums bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 inline-block">
                        {progress}%
                      </span>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                        {cycle.completedSections} / {cycle.totalSections} lessons
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar (Solid colors only) */}
                  <div className="mt-3 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${progress}%` }} />
                  </div>

                  {/* Details */}
                  <div className="mt-3 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Started: <strong className="text-slate-800 font-mono">{cycle.startDate}</strong></span>
                      {cycle.targetCompletionDate && (
                        <span>Target: <strong className="text-slate-800 font-mono">{cycle.targetCompletionDate}</strong></span>
                      )}
                    </div>
                    {cycle.notes && (
                      <p className="mt-2 text-[11px] text-slate-500 line-clamp-2 italic">
                        "{cycle.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedCycle(cycle)}
                    className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded border border-sky-200 transition-colors"
                  >
                    <span>Discussion & Reflection ({cycle.discussionQuestions.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {canEdit && cycle.completedSections < cycle.totalSections && (
                      <button
                        onClick={() => handleIncrementSection(cycle)}
                        className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded hover:bg-emerald-100 transition-colors"
                      >
                        + Mark Lesson Done
                      </button>
                    )}
                    {canEdit && (
                      <button
                        onClick={() => onDeleteStudyCycle(cycle.id)}
                        title="Delete Study Cycle"
                        className="p-1.5 text-slate-400 hover:text-red-700 rounded"
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

      {/* Detail & Reflection Modal */}
      {selectedCycle && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-700">
                  Study Cycle Consultation
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedCycle.materialTitle}
                </h2>
                <div className="text-xs text-slate-500">
                  Group: {groups.find((g) => g.id === selectedCycle.groupId)?.name} · Current:{' '}
                  {selectedCycle.currentSection}
                </div>
              </div>
              <button
                onClick={() => setSelectedCycle(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Discussion Questions ({selectedCycle.discussionQuestions.length})
              </h4>
              <div className="space-y-1.5">
                {selectedCycle.discussionQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 flex items-start gap-2"
                  >
                    <span className="font-bold text-sky-700">{idx + 1}.</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>

              {canEdit && (
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add a new consultation question for this lesson..."
                    value={newQuestionInput}
                    onChange={(e) => setNewQuestionInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddQuestionToCycle(selectedCycle)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 whitespace-nowrap"
                  >
                    Add Question
                  </button>
                </div>
              )}
            </div>

            {/* Reflections List */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Group Reflections & Insights
              </h4>
              <div className="space-y-2">
                {selectedCycle.reflections.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No reflections recorded yet.</p>
                ) : (
                  selectedCycle.reflections.map((r, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-sky-50 border border-sky-100 rounded text-xs text-slate-800"
                    >
                      {r}
                    </div>
                  ))
                )}
              </div>

              {canEdit && (
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Record an insight from the youth's study session..."
                    value={newReflectionInput}
                    onChange={(e) => setNewReflectionInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddReflectionToCycle(selectedCycle)}
                    className="px-3 py-1.5 text-xs font-semibold text-sky-900 bg-sky-100 rounded hover:bg-sky-200 whitespace-nowrap"
                  >
                    Add Reflection
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedCycle(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Cycle Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">Create Study Cycle</h2>
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
                    onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
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
                  <label className="block font-semibold text-slate-800 mb-1">
                    Material / Text <span className="text-red-600">*</span>
                  </label>
                  <select
                    required
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
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Starting Section</label>
                  <input
                    type="text"
                    placeholder="Lesson 1"
                    value={formData.currentSection || ''}
                    onChange={(e) => setFormData({ ...formData, currentSection: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Total Sections</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.totalSections || 14}
                    onChange={(e) =>
                      setFormData({ ...formData, totalSections: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={formData.targetCompletionDate || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, targetCompletionDate: e.target.value })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Study Cycle Objectives & Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Goals for this text, concepts youth are exploring..."
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
                  Create Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
