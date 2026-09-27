import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Sparkles,
  BookOpen
} from 'lucide-react';
import {
  Meeting,
  ServiceProject,
  CampOrEvent,
  JuniorYouthGroup
} from '../../types';
import { BahaiNinePointedStar } from '../common/BahaiArt';

interface CalendarViewProps {
  meetings: Meeting[];
  serviceProjects: ServiceProject[];
  events: CampOrEvent[];
  groups: JuniorYouthGroup[];
  onSelectMeeting?: (meeting: Meeting) => void;
}

type CalendarViewMode = 'month' | 'week' | 'day';

interface CalendarItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  type: 'meeting' | 'service' | 'event';
  groupName?: string;
  raw: any;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  meetings,
  serviceProjects,
  events,
  groups
}) => {
  const [currentDate, setCurrentDate] = useState(new Date('2026-04-01'));
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);

  // Consolidate all items
  const calendarItems: CalendarItem[] = [
    ...meetings.map((m) => {
      const grp = groups.find((g) => g.id === m.groupId);
      return {
        id: m.id,
        title: `${grp ? grp.name : 'Group'}: ${m.sessionTopic || 'Meeting'}`,
        date: m.date,
        time: m.time,
        location: m.location,
        type: 'meeting' as const,
        groupName: grp?.name,
        raw: m
      };
    }),
    ...serviceProjects.map((p) => {
      const grp = groups.find((g) => g.id === p.groupId);
      return {
        id: p.id,
        title: `Service: ${p.projectName}`,
        date: p.date,
        location: p.location,
        type: 'service' as const,
        groupName: grp?.name,
        raw: p
      };
    }),
    ...events.map((ev) => ({
      id: ev.id,
      title: `${ev.type.replace('_', ' ').toUpperCase()}: ${ev.title}`,
      date: ev.startDate,
      location: ev.location,
      type: 'event' as const,
      raw: ev
    }))
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Month grid calculation
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyStartDays = Array.from({ length: firstDayIndex }, (_, i) => i);

  const getItemsForDate = (dateStr: string) => {
    return calendarItems.filter((item) => item.date === dateStr);
  };

  // Format date helper
  const formatDateString = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
              Cluster Activities Calendar
            </h1>
            <BahaiNinePointedStar size={16} color="#0284c7" />
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Synchronized schedule of weekly youth meetings, community service projects, and cluster camps.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600">
            {(['month', 'week', 'day'] as CalendarViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded capitalize transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Controls Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-900">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="text-xs text-sky-700 hover:text-sky-900 font-semibold px-2 py-0.5 border border-sky-200 bg-sky-50 rounded"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-700 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-sky-500 inline-block shadow-xs" />
          <span>Group Meetings</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block shadow-xs" />
          <span>Service Projects</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-purple-600 inline-block shadow-xs" />
          <span>Camps & Gatherings</span>
        </div>
      </div>

      {/* Month View Grid */}
      {viewMode === 'month' && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center text-xs font-semibold text-slate-600 py-2.5">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 text-xs">
            {/* Empty Leading Days */}
            {emptyStartDays.map((i) => (
              <div key={`empty-${i}`} className="min-h-[105px] bg-slate-50/40 p-2" />
            ))}

            {/* Days in Month */}
            {daysArray.map((day) => {
              const dateStr = formatDateString(year, month, day);
              const dayItems = getItemsForDate(dateStr);
              const isToday =
                new Date().toISOString().split('T')[0] === dateStr;

              return (
                <div
                  key={day}
                  className={`min-h-[105px] p-2 flex flex-col justify-between hover:bg-slate-50/70 transition-colors ${
                    isToday ? 'bg-sky-50/40 border-t-2 border-t-sky-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-medium ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs'
                          : 'text-slate-700'
                      }`}
                    >
                      {day}
                    </span>
                    {dayItems.length > 0 && (
                      <span className="text-[10px] text-slate-500 font-mono font-semibold">
                        {dayItems.length}
                      </span>
                    )}
                  </div>

                  {/* Items for this day */}
                  <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
                    {dayItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`p-1 rounded text-[10px] truncate cursor-pointer transition-colors font-semibold border ${
                          item.type === 'meeting'
                            ? 'bg-sky-100 text-sky-950 border-sky-300 hover:bg-sky-200'
                            : item.type === 'service'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-300 hover:bg-emerald-200'
                            : 'bg-purple-100 text-purple-950 border-purple-300 hover:bg-purple-200'
                        }`}
                        title={item.title}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week / Day View List */}
      {(viewMode === 'week' || viewMode === 'day') && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Agenda for {currentDate.toDateString()}
          </h3>

          <div className="divide-y divide-slate-100">
            {calendarItems.length === 0 ? (
              <p className="py-6 text-slate-500 text-xs text-center">
                No activities scheduled for this period.
              </p>
            ) : (
              calendarItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="py-3 flex items-start justify-between cursor-pointer hover:bg-slate-50 px-2 rounded"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${
                          item.type === 'meeting'
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : item.type === 'service'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-900 text-white border-slate-900'
                        }`}
                      >
                        {item.type}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                      <span className="font-mono text-slate-700">{item.date}</span>
                      {item.time && <span>{item.time}</span>}
                      {item.location && <span>• {item.location}</span>}
                    </div>
                  </div>
                  <button className="text-xs text-sky-700 font-semibold hover:underline">
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Item Quick View Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
                  {selectedItem.type}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{selectedItem.title}</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono font-medium">{selectedItem.date}</span>
                {selectedItem.time && <span>({selectedItem.time})</span>}
              </div>
              {selectedItem.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedItem.location}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
