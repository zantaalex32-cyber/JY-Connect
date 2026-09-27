import { Meeting, CampOrEvent, ServiceProject } from '../types';

/**
 * Formats a Date object or YYYY-MM-DD + HH:MM string to iCal format YYYYMMDDTHHMMSSZ
 */
function toIcsDate(dateStr: string, timeStr?: string): string {
  try {
    const cleanDate = dateStr.replace(/[^0-9-]/g, '');
    const [year, month, day] = cleanDate.split('-').map(Number);
    let hour = 10;
    let min = 0;

    if (timeStr) {
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (match) {
        hour = parseInt(match[1], 10);
        min = parseInt(match[2], 10);
        const meridiem = match[3]?.toUpperCase();
        if (meridiem === 'PM' && hour < 12) hour += 12;
        if (meridiem === 'AM' && hour === 12) hour = 0;
      }
    }

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(min)}00Z`;
  } catch {
    return '20260101T000000Z';
  }
}

/**
 * Escapes special characters for iCalendar format
 */
function escapeIcsText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

/**
 * Generates an iCalendar (.ics) string containing meetings, camps, and service projects
 */
export function generateIcsCalendar(
  meetings: Meeting[],
  events: CampOrEvent[],
  serviceProjects: ServiceProject[],
  clusterName: string
): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bahai Junior Youth Program//JY Connect Calendar//EN',
    `X-WR-CALNAME:JY Connect - ${clusterName}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  // Add meetings
  meetings.forEach((m) => {
    const dtStart = toIcsDate(m.date, m.time);
    const dtEnd = toIcsDate(m.date, m.time); // or +1.5h
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:jy-meeting-${m.id}@jyconnect.org`);
    lines.push(`DTSTAMP:${dtStart}`);
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`DTEND:${dtEnd}`);
    lines.push(`SUMMARY:${escapeIcsText(`JY Meeting: ${m.sessionTopic || 'Junior Youth Study'}`)}`);
    lines.push(`DESCRIPTION:${escapeIcsText(`Text: ${m.materialTitle || 'Junior Youth Text'}\nLesson: ${m.unitOrLesson || 'N/A'}\nActivities: ${m.activities || 'None'}`)}`);
    lines.push(`LOCATION:${escapeIcsText(m.location || 'Meeting Venue')}`);
    lines.push('STATUS:CONFIRMED');
    lines.push('END:VEVENT');
  });

  // Add events & camps
  events.forEach((ev) => {
    const dtStart = toIcsDate(ev.startDate, '09:00 AM');
    const dtEnd = toIcsDate(ev.endDate, '05:00 PM');
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:jy-event-${ev.id}@jyconnect.org`);
    lines.push(`DTSTAMP:${dtStart}`);
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`DTEND:${dtEnd}`);
    lines.push(`SUMMARY:${escapeIcsText(`JY Camp: ${ev.title}`)}`);
    lines.push(`DESCRIPTION:${escapeIcsText(`Type: ${ev.type}\nActivities: ${ev.activitiesDescription}`)}`);
    lines.push(`LOCATION:${escapeIcsText(ev.location)}`);
    lines.push('STATUS:CONFIRMED');
    lines.push('END:VEVENT');
  });

  // Add service projects
  serviceProjects.forEach((p) => {
    const dtStart = toIcsDate(p.date, '10:00 AM');
    const dtEnd = toIcsDate(p.date, '01:00 PM');
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:jy-service-${p.id}@jyconnect.org`);
    lines.push(`DTSTAMP:${dtStart}`);
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`DTEND:${dtEnd}`);
    lines.push(`SUMMARY:${escapeIcsText(`Community Service: ${p.projectName}`)}`);
    lines.push(`DESCRIPTION:${escapeIcsText(`Description: ${p.description}\nGoals: ${p.goals}`)}`);
    lines.push(`LOCATION:${escapeIcsText(p.location)}`);
    lines.push('STATUS:CONFIRMED');
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Triggers a download of the .ics calendar file in the user's browser
 */
export function downloadIcsFile(icsContent: string, filename = 'jy-connect-schedule.ics'): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Creates a direct Google Calendar add event URL
 */
export function getGoogleCalendarLink(title: string, dateStr: string, timeStr: string, location: string, details: string): string {
  const dtStart = toIcsDate(dateStr, timeStr);
  const dtEnd = toIcsDate(dateStr, timeStr);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${dtStart}/${dtEnd}`,
    details: details,
    location: location
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
