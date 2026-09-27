import React, { useState } from 'react';
import {
  JuniorYouthGroup,
  GroupTimelineEntry,
  Meeting,
  ServiceProject,
  CampOrEvent,
  StudyCycle,
  UserRole,
  TimelineEntryType
} from '../../types';
import {
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
  Plus,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  Flag,
  FileText
} from 'lucide-react';

interface GroupTimelineProps {
  group: JuniorYouthGroup;
  timelineEntries: GroupTimelineEntry[];
  meetings: Meeting[];
  serviceProjects: ServiceProject[];
  events: CampOrEvent[];
  studyCycles: StudyCycle[];
  currentRole: UserRole;
  onAddTimelineEntry: (entry: GroupTimelineEntry) => void;
}

export function GroupTimeline({
  group,
  timelineEntries,
  meetings,
  serviceProjects,
  events,
  studyCycles,
  currentRole,
  onAddTimelineEntry
}: GroupTimelineProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryType, setEntryType] = useState<TimelineEntryType>('milestone');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [entryDescription, setEntryDescription] = useState('');

  const groupMeetings = meetings.filter((m) => m.groupId === group.id);
  const groupProjects = serviceProjects.filter((p) => p.groupId === group.id);
  const groupCycles = studyCycles.filter((c) => c.groupId === group.id);
  const customEntries = timelineEntries.filter((e) => e.groupId === group.id);

  // Combine automated items into chronological timeline
  const allEvents: {
    id: string;
    date: string;
    title: string;
    type: string;
    description: string;
    badgeColor: string;
  }[] = [];

  // Group creation
  if (group.startDate) {
    allEvents.push({
      id: `start-${group.id}`,
      date: group.startDate,
      title: 'Group Established',
      type: 'creation',
      description: `Junior Youth Group '${group.name}' was formed in ${group.neighborhood || 'the neighborhood'}. Initial goals: ${group.goals || 'Moral and intellectual empowerment.'}`,
      badgeColor: 'bg-sky-600 text-white'
    });
  }

  // Meetings
  groupMeetings.forEach((m) => {
    allEvents.push({
      id: `m-${m.id}`,
      date: m.date,
      title: `Meeting: ${m.sessionTopic || 'Study Session'}`,
      type: 'meeting',
      description: `Held at ${m.location}. Text: ${m.materialTitle || 'N/A'}. Activities: ${m.activities || 'None'}. Reflection: ${m.reflection || 'No reflection logged.'}`,
      badgeColor: 'bg-indigo-600 text-white'
    });
  });

  // Service projects
  groupProjects.forEach((p) => {
    allEvents.push({
      id: `proj-${p.id}`,
      date: p.date,
      title: `Service Project: ${p.projectName}`,
      type: 'service_project',
      description: `${p.description}. Status: ${p.progressStatus}. Results: ${p.results || 'In progress'}`,
      badgeColor: 'bg-emerald-600 text-white'
    });
  });

  // Custom manual timeline entries
  customEntries.forEach((c) => {
    allEvents.push({
      id: c.id,
      date: c.date,
      title: c.title,
      type: c.type,
      description: c.description,
      badgeColor: c.type === 'challenge' ? 'bg-amber-600 text-white' : 'bg-purple-600 text-white'
    });
  });

  // Sort descending by date
  allEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryTitle.trim()) return;

    const newEntry: GroupTimelineEntry = {
      id: `time-${Date.now()}`,
      groupId: group.id,
      date: entryDate,
      title: entryTitle.trim(),
      type: entryType,
      description: entryDescription.trim(),
      authorRole: currentRole
    };

    onAddTimelineEntry(newEntry);
    setIsAddOpen(false);
    setEntryTitle('');
    setEntryDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>Group History & Chronological Timeline</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete milestone log tracking creation, lessons completed, service projects, challenges, and developments.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Timeline Note</span>
        </button>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="bg-sky-50/50 border border-sky-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-sky-950">Add Milestone or Event Note</h4>
            <button
              onClick={() => setIsAddOpen(false)}
              className="text-slate-400 hover:text-slate-700 text-xs font-mono"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Title / Milestone *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Completed Unit 1 of Wellspring of Joy"
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Entry Type</label>
                <select
                  value={entryType}
                  onChange={(e) => setEntryType(e.target.value as TimelineEntryType)}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                >
                  <option value="milestone">Milestone Achieved</option>
                  <option value="lesson_completed">Text / Lesson Completed</option>
                  <option value="service_project">Service Project Milestone</option>
                  <option value="camp">Camp / Gathering</option>
                  <option value="challenge">Challenge / Obstacle Overcome</option>
                  <option value="custom_note">Development Note</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                <input
                  type="text"
                  required
                  placeholder="What happened and what was learned?"
                  value={entryDescription}
                  onChange={(e) => setEntryDescription(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-3 py-1 border border-slate-300 rounded text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1 bg-sky-600 text-white rounded font-bold hover:bg-sky-700"
              >
                Save Timeline Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timeline Stream */}
      {allEvents.length === 0 ? (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-lg text-xs text-slate-500">
          No historical events recorded yet for this group.
        </div>
      ) : (
        <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 my-4">
          {allEvents.map((ev) => (
            <div key={ev.id} className="relative group">
              {/* Dot */}
              <div
                className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full ${ev.badgeColor} flex items-center justify-center text-[10px] font-bold shadow-xs`}
              >
                ✓
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-3.5 hover:border-sky-300 transition-colors shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{ev.title}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 capitalize">
                      {ev.type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {ev.date}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {ev.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
