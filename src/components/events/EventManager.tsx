import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  MapPin,
  Clock,
  Users,
  HeartHandshake,
  Edit2,
  Trash2,
  Megaphone,
  CheckCircle,
  Sparkles,
  FileText
} from 'lucide-react';
import {
  CampOrEvent,
  EventType,
  JuniorYouthParticipant,
  Animator,
  UserRole
} from '../../types';
import { BahaiNinePointedStar } from '../common/BahaiArt';

interface EventManagerProps {
  events: CampOrEvent[];
  participants: JuniorYouthParticipant[];
  animators: Animator[];
  currentRole: UserRole;
  onSaveEvent: (event: CampOrEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const EventManager: React.FC<EventManagerProps> = ({
  events,
  participants,
  animators,
  currentRole,
  onSaveEvent,
  onDeleteEvent
}) => {
  const [selectedEvent, setSelectedEvent] = useState<CampOrEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [newScheduleTime, setNewScheduleTime] = useState('');
  const [newScheduleActivity, setNewScheduleActivity] = useState('');

  const canEdit = currentRole === 'admin' || currentRole === 'coordinator';

  // Form State
  const [formData, setFormData] = useState<Partial<CampOrEvent>>({
    title: '',
    type: 'camp',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    location: '',
    registeredJyIds: [],
    registeredAnimatorIds: [],
    schedule: [
      { time: '09:00 AM', activity: 'Registration & Welcome Prayers' },
      { time: '10:00 AM', activity: 'Study Session & Arts' },
      { time: '02:00 PM', activity: 'Cooperative Sports & Service' }
    ],
    activitiesDescription: '',
    announcements: [],
    status: 'upcoming'
  });

  const eventTypeLabels: Record<EventType, string> = {
    camp: 'Junior Youth Camp',
    animator_training: 'Animator Training',
    cluster_activity: 'Cluster Activity',
    reflection_meeting: 'Reflection Meeting',
    sports_day: 'Cooperative Sports Day',
    service_day: 'Service Day',
    gathering: 'Community Gathering'
  };

  const filteredEvents = events.filter(
    (ev) => typeFilter === 'all' || ev.type === typeFilter
  );

  const handleOpenCreateModal = () => {
    setFormData({
      id: 'ev-' + Date.now(),
      title: '',
      type: 'camp',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      location: '',
      registeredJyIds: [],
      registeredAnimatorIds: [],
      schedule: [
        { time: '09:00 AM', activity: 'Registration & Opening Reflections' },
        { time: '10:15 AM', activity: 'Text Study & Consultation' },
        { time: '01:30 PM', activity: 'Arts & Cooperative Games' }
      ],
      activitiesDescription: '',
      announcements: ['Bring notebooks and comfortable clothes.'],
      status: 'upcoming'
    });
    setIsEditing(true);
    setSelectedEvent(null);
  };

  const handleOpenEditModal = (ev: CampOrEvent) => {
    setFormData({ ...ev });
    setIsEditing(true);
    setSelectedEvent(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    const eventToSave: CampOrEvent = {
      id: formData.id || 'ev-' + Date.now(),
      title: formData.title.trim(),
      type: formData.type || 'camp',
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate || formData.startDate || new Date().toISOString().split('T')[0],
      location: formData.location || '',
      registeredJyIds: formData.registeredJyIds || [],
      registeredAnimatorIds: formData.registeredAnimatorIds || [],
      schedule: formData.schedule || [],
      activitiesDescription: formData.activitiesDescription || '',
      announcements: formData.announcements || [],
      status: formData.status || 'upcoming'
    };

    onSaveEvent(eventToSave);
    setIsEditing(false);
  };

  const handleAddAnnouncement = (event: CampOrEvent) => {
    if (!newAnnouncement.trim()) return;
    const updated = {
      ...event,
      announcements: [...event.announcements, newAnnouncement.trim()]
    };
    onSaveEvent(updated);
    setSelectedEvent(updated);
    setNewAnnouncement('');
  };

  const handleAddScheduleItem = (event: CampOrEvent) => {
    if (!newScheduleTime.trim() || !newScheduleActivity.trim()) return;
    const updated = {
      ...event,
      schedule: [
        ...event.schedule,
        { time: newScheduleTime.trim(), activity: newScheduleActivity.trim() }
      ]
    };
    onSaveEvent(updated);
    setSelectedEvent(updated);
    setNewScheduleTime('');
    setNewScheduleActivity('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
              Camps & Cluster Gatherings
            </h1>
            <BahaiNinePointedStar size={16} color="#0284c7" />
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Organize youth camps, animator reflection meetings, cooperative sports days, and cluster milestones.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>Create Camp / Event</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500 font-medium">Filter Type:</span>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <option value="all">All Events ({events.length})</option>
          {Object.entries(eventTypeLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">No events or camps found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {events.length === 0
              ? 'Schedule your first cluster youth camp, reflection gathering, or sports day.'
              : 'No events match your current filter.'}
          </p>
          {canEdit && events.length === 0 && (
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
            >
              + Create First Event
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((ev) => {
            return (
              <div
                key={ev.id}
                className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-sky-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${
                        ev.type === 'camp'
                          ? 'bg-teal-100 text-teal-900 border-teal-300'
                          : ev.type === 'animator_training'
                          ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                          : ev.type === 'sports_day'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : ev.type === 'service_day'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : ev.type === 'reflection_meeting'
                          ? 'bg-purple-100 text-purple-900 border-purple-300'
                          : 'bg-sky-100 text-sky-900 border-sky-300'
                      }`}>
                        {eventTypeLabels[ev.type] || 'Event'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5">{ev.title}</h3>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1 font-mono font-medium text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {ev.startDate === ev.endDate ? ev.startDate : `${ev.startDate} to ${ev.endDate}`}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${
                        ev.status === 'upcoming'
                          ? 'bg-sky-100 text-sky-800 border-sky-300'
                          : ev.status === 'ongoing'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {ev.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{ev.location || 'Location to be announced'}</span>
                  </div>

                  <p className="mt-2.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {ev.activitiesDescription || 'Consultation, moral text study, community service, and recreation.'}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.registeredJyIds.length} youth registered</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <HeartHandshake className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.registeredAnimatorIds.length} animators</span>
                    </span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedEvent(ev)}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-900"
                  >
                    View Schedule & Announcements
                  </button>

                  <div className="flex items-center gap-1">
                    {canEdit && (
                      <button
                        onClick={() => handleOpenEditModal(ev)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded"
                        title="Edit Event"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {canEdit && (
                      <button
                        onClick={() => onDeleteEvent(ev.id)}
                        className="p-1.5 text-slate-400 hover:text-red-700 rounded"
                        title="Delete Event"
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

      {/* Event Details & Schedule Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-700">
                  {eventTypeLabels[selectedEvent.type]}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">{selectedEvent.title}</h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  {selectedEvent.startDate} · {selectedEvent.location}
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-semibold text-slate-900">Activities Overview</h4>
                <p className="text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                  {selectedEvent.activitiesDescription || 'No detailed description provided.'}
                </p>
              </div>

              {/* Schedule */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-1.5">Event Schedule</h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded">
                  {selectedEvent.schedule.map((item, idx) => (
                    <div key={idx} className="p-2 flex items-center justify-between">
                      <span className="font-mono font-medium text-slate-700">{item.time}</span>
                      <span className="text-slate-900 font-medium">{item.activity}</span>
                    </div>
                  ))}
                </div>

                {canEdit && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="09:00 AM"
                      value={newScheduleTime}
                      onChange={(e) => setNewScheduleTime(e.target.value)}
                      className="w-24 px-2 py-1 border border-slate-300 rounded text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Activity description..."
                      value={newScheduleActivity}
                      onChange={(e) => setNewScheduleActivity(e.target.value)}
                      className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs"
                    />
                    <button
                      onClick={() => handleAddScheduleItem(selectedEvent)}
                      className="px-3 py-1 bg-slate-900 text-white font-semibold rounded text-xs hover:bg-slate-800"
                    >
                      + Add
                    </button>
                  </div>
                )}
              </div>

              {/* Announcements */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5 text-sky-600" />
                  <span>Announcements & Logistics</span>
                </h4>
                <div className="space-y-1">
                  {selectedEvent.announcements.map((msg, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-sky-50 border border-sky-100 rounded text-slate-800"
                    >
                      • {msg}
                    </div>
                  ))}
                </div>

                {canEdit && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Add an announcement for participants & animators..."
                      value={newAnnouncement}
                      onChange={(e) => setNewAnnouncement(e.target.value)}
                      className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs"
                    />
                    <button
                      onClick={() => handleAddAnnouncement(selectedEvent)}
                      className="px-3 py-1 bg-sky-800 text-white font-semibold rounded text-xs hover:bg-sky-900"
                    >
                      Post
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {formData.id && events.some((e) => e.id === formData.id)
                  ? 'Edit Event Information'
                  : 'Create Camp or Cluster Event'}
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
                  Event Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cluster 4 Junior Youth Spring Camp"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Event Type</label>
                  <select
                    value={formData.type || 'camp'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    {Object.entries(eventTypeLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Status</label>
                  <select
                    value={formData.status || 'upcoming'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Location / Venue</label>
                <input
                  type="text"
                  placeholder="e.g. Pine Crest Camp & Education Retreat"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Activities Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Schedule highlights, camp goals, reflection agenda..."
                  value={formData.activitiesDescription || ''}
                  onChange={(e) => setFormData({ ...formData, activitiesDescription: e.target.value })}
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
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
