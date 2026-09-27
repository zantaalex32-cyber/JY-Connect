import React, { useState } from 'react';
import { Meeting, GroupReflection, UserRole, JuniorYouthGroup } from '../../types';
import { FileText, Sparkles, CheckSquare, Shield, AlertCircle } from 'lucide-react';

interface ReflectionJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting | null;
  group: JuniorYouthGroup | null;
  existingReflection?: GroupReflection | null;
  currentRole: UserRole;
  onSaveReflection: (reflection: GroupReflection) => void;
}

export function ReflectionJournalModal({
  isOpen,
  onClose,
  meeting,
  group,
  existingReflection,
  currentRole,
  onSaveReflection
}: ReflectionJournalModalProps) {
  if (!isOpen || !meeting) return null;

  const [animatorName, setAnimatorName] = useState(existingReflection?.animatorName || '');
  const [whatHappened, setWhatHappened] = useState(existingReflection?.whatHappened || meeting.sessionTopic || '');
  const [whatWentWell, setWhatWentWell] = useState(existingReflection?.whatWentWell || '');
  const [challengesArose, setChallengesArose] = useState(existingReflection?.challengesArose || '');
  const [whatGroupLearned, setWhatGroupLearned] = useState(existingReflection?.whatGroupLearned || '');
  const [whatToTryNext, setWhatToTryNext] = useState(existingReflection?.whatToTryNext || '');
  const [supportNeeded, setSupportNeeded] = useState(existingReflection?.supportNeeded || '');
  const [followUpActions, setFollowUpActions] = useState(existingReflection?.followUpActions || '');
  const [isPrivateToCoordinators, setIsPrivateToCoordinators] = useState(
    existingReflection?.isPrivateToCoordinators ?? false
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reflection: GroupReflection = {
      id: existingReflection ? existingReflection.id : `refl-${Date.now()}`,
      meetingId: meeting.id,
      groupId: meeting.groupId,
      date: meeting.date,
      animatorName: animatorName.trim() || 'Animator',
      whatHappened: whatHappened.trim(),
      whatWentWell: whatWentWell.trim(),
      challengesArose: challengesArose.trim(),
      whatGroupLearned: whatGroupLearned.trim(),
      whatToTryNext: whatToTryNext.trim(),
      supportNeeded: supportNeeded.trim(),
      followUpActions: followUpActions.trim(),
      isPrivateToCoordinators
    };

    onSaveReflection(reflection);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-purple-700 font-bold uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>Animator Reflection Journal</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              {group?.name || 'Junior Youth Group'} — {meeting.date}
            </h2>
            <div className="text-xs text-slate-500">
              Topic: <strong>{meeting.sessionTopic || 'Weekly Session'}</strong> ({meeting.location})
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-mono text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Animator Name(s) Reflecting *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Layla Al-Mansoor"
              value={animatorName}
              onChange={(e) => setAnimatorName(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-900 mb-1">
                1. What happened during this gathering?
              </label>
              <textarea
                rows={2}
                required
                placeholder="Brief summary of opening prayers, text passage studied, and activities conducted..."
                value={whatHappened}
                onChange={(e) => setWhatHappened(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-emerald-950 mb-1">
                2. What went particularly well?
              </label>
              <textarea
                rows={2}
                placeholder="Moments of insight, sincere consultation, cooperative play, active participation..."
                value={whatWentWell}
                onChange={(e) => setWhatWentWell(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-amber-950 mb-1">
                3. What challenges or obstacles arose?
              </label>
              <textarea
                rows={2}
                placeholder="Shyness, restlessness, distractions, absent participants, timing issues..."
                value={challengesArose}
                onChange={(e) => setChallengesArose(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-indigo-950 mb-1">
                4. What did the group learn and understand?
              </label>
              <textarea
                rows={2}
                placeholder="Spiritual concepts grasped, new vocabulary defined, reflections on moral choices..."
                value={whatGroupLearned}
                onChange={(e) => setWhatGroupLearned(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-sky-950 mb-1">
                5. What should we try or adjust next week?
              </label>
              <textarea
                rows={2}
                placeholder="New game to introduce, pairing quiet youth with active friends, calligraphy activity..."
                value={whatToTryNext}
                onChange={(e) => setWhatToTryNext(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-rose-950 mb-1">
                6. What support is needed from cluster coordinators?
              </label>
              <textarea
                rows={2}
                placeholder="Additional books needed, home visit accompaniment, camp consultation..."
                value={supportNeeded}
                onChange={(e) => setSupportNeeded(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">
                7. Follow-up actions to create
              </label>
              <textarea
                rows={2}
                placeholder="Tasks to record (e.g. Call Tariq’s father, purchase drawing paper)..."
                value={followUpActions}
                onChange={(e) => setFollowUpActions(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivateToCoordinators}
              onChange={(e) => setIsPrivateToCoordinators(e.target.checked)}
              className="rounded text-purple-600"
            />
            <label htmlFor="isPrivate" className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>Mark this journal confidential (restricted to animators and cluster coordinators)</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-300 rounded text-slate-700 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded font-bold transition-colors shadow-xs"
            >
              Save Reflection Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
