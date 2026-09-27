import React, { useState } from 'react';
import {
  Search,
  Users,
  HeartHandshake,
  BookOpen,
  Calendar,
  Sparkles,
  FileText,
  X,
  ArrowRight
} from 'lucide-react';
import {
  JuniorYouthGroup,
  JuniorYouthParticipant,
  Animator,
  Material,
  Meeting,
  ServiceProject,
  CampOrEvent,
  ReportData
} from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: JuniorYouthGroup[];
  participants: JuniorYouthParticipant[];
  animators: Animator[];
  materials: Material[];
  meetings: Meeting[];
  serviceProjects: ServiceProject[];
  events: CampOrEvent[];
  reports: ReportData[];
  onNavigateToTab: (tab: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  groups,
  participants,
  animators,
  materials,
  meetings,
  serviceProjects,
  events,
  reports,
  onNavigateToTab
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedGroups = q
    ? groups.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.neighborhood.toLowerCase().includes(q) ||
          g.location.toLowerCase().includes(q)
      )
    : [];

  const matchedParticipants = q
    ? participants.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.neighborhood.toLowerCase().includes(q) ||
          p.parentGuardianName.toLowerCase().includes(q)
      )
    : [];

  const matchedAnimators = q
    ? animators.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.contact.toLowerCase().includes(q) ||
          a.booksStudied.some((b) => b.toLowerCase().includes(q))
      )
    : [];

  const matchedMaterials = q
    ? materials.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.authorOrg.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.subjectCategory.toLowerCase().includes(q)
      )
    : [];

  const matchedMeetings = q
    ? meetings.filter(
        (m) =>
          m.sessionTopic.toLowerCase().includes(q) ||
          (m.materialTitle && m.materialTitle.toLowerCase().includes(q)) ||
          m.location.toLowerCase().includes(q)
      )
    : [];

  const matchedProjects = q
    ? serviceProjects.filter(
        (p) =>
          p.projectName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      )
    : [];

  const matchedEvents = q
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.activitiesDescription.toLowerCase().includes(q)
      )
    : [];

  const totalResults =
    matchedGroups.length +
    matchedParticipants.length +
    matchedAnimators.length +
    matchedMaterials.length +
    matchedMeetings.length +
    matchedProjects.length +
    matchedEvents.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-start justify-center p-4 pt-16">
      <div className="bg-white rounded-lg border border-slate-200 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search groups, participants, animators, materials, meetings, service projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm outline-none text-slate-900 placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded text-sm font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {!q ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Type keywords above to search all Junior Youth records, study texts, and activities.
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No matching records found for "{query}".
            </div>
          ) : (
            <>
              {/* Groups */}
              {matchedGroups.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-sky-900 bg-sky-50 px-2 py-1 rounded border border-sky-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-700" />
                    <span>Groups ({matchedGroups.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedGroups.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => {
                          onNavigateToTab('groups');
                          onClose();
                        }}
                        className="p-2 hover:bg-sky-50/50 border border-slate-200 rounded cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{g.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {g.neighborhood} · {g.meetingDay}, {g.meetingTime}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Participants */}
              {matchedParticipants.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-emerald-900 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Junior Youth Participants ({matchedParticipants.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedParticipants.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onNavigateToTab('participants');
                          onClose();
                        }}
                        className="p-2 hover:bg-emerald-50/50 border border-slate-200 rounded cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-900">
                            {p.name} <span className="text-emerald-800 font-semibold text-[10px] bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">({p.age} yrs)</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Neighborhood: {p.neighborhood} · Guardian: {p.parentGuardianName}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Animators */}
              {matchedAnimators.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-purple-900 bg-purple-50 px-2 py-1 rounded border border-purple-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5 text-purple-700" />
                    <span>Animators ({matchedAnimators.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedAnimators.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          onNavigateToTab('animators');
                          onClose();
                        }}
                        className="p-2 hover:bg-purple-50/50 border border-slate-200 rounded cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{a.name}</div>
                          <div className="text-[11px] text-slate-500">
                            Training: {a.trainingStatus.replace('_', ' ')} · Contact: {a.contact}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials */}
              {matchedMaterials.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-indigo-900 bg-indigo-50 px-2 py-1 rounded border border-indigo-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-700" />
                    <span>Materials & Texts ({matchedMaterials.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedMaterials.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          onNavigateToTab('materials');
                          onClose();
                        }}
                        className="p-2 hover:bg-indigo-50/50 border border-slate-200 rounded cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{m.title}</div>
                          <div className="text-[11px] text-slate-500">
                            {m.authorOrg} · {m.subjectCategory}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meetings */}
              {matchedMeetings.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-teal-900 bg-teal-50 px-2 py-1 rounded border border-teal-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-700" />
                    <span>Meetings ({matchedMeetings.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedMeetings.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          onNavigateToTab('meetings');
                          onClose();
                        }}
                        className="p-2 hover:bg-teal-50/50 border border-slate-200 rounded cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{m.sessionTopic}</div>
                          <div className="text-[11px] text-slate-500">
                            {m.date} at {m.time} · {m.location}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Projects */}
              {matchedProjects.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-emerald-900 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Service Projects ({matchedProjects.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedProjects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onNavigateToTab('service');
                          onClose();
                        }}
                        className="p-2 hover:bg-emerald-50/50 border border-slate-200 rounded cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{p.projectName}</div>
                          <div className="text-[11px] text-slate-500">
                            {p.date} · {p.location}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
