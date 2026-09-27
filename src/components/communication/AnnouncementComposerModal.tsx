import React, { useState } from 'react';
import { JuniorYouthGroup, CampOrEvent, ServiceProject } from '../../types';
import {
  MessageCircle,
  Copy,
  Mail,
  Check,
  Send,
  Sparkles,
  Share2
} from 'lucide-react';

interface AnnouncementComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: JuniorYouthGroup[];
  events: CampOrEvent[];
  serviceProjects: ServiceProject[];
  clusterName: string;
}

export function AnnouncementComposerModal({
  isOpen,
  onClose,
  groups,
  events,
  serviceProjects,
  clusterName
}: AnnouncementComposerModalProps) {
  if (!isOpen) return null;

  const [templateType, setTemplateType] = useState<string>('meeting_reminder');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || '');
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(serviceProjects[0]?.id || '');

  const [customSubject, setCustomSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];
  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const selectedProject = serviceProjects.find((p) => p.id === selectedProjectId) || serviceProjects[0];

  // Generate template text based on selection
  const generateTemplate = (type: string) => {
    setTemplateType(type);
    if (type === 'meeting_reminder') {
      const gName = selectedGroup?.name || 'Junior Youth Group';
      const mDay = selectedGroup?.meetingDay || 'Saturday';
      const mTime = selectedGroup?.meetingTime || '2:00 PM';
      const venue = selectedGroup?.meetingVenue || selectedGroup?.location || 'Community Center';

      setCustomSubject(`Reminder: ${gName} Gathering this ${mDay}`);
      setMessageBody(
`Dear Junior Youth & Families,

A warm reminder that our next gathering of the ${gName} will take place this ${mDay} at ${mTime}.

📍 Location: ${venue}
📖 We will continue our study, share songs, and plan our upcoming neighborhood service project.

Please bring your study booklet and invite a friend! We look forward to seeing everyone.

With warm regards,
${clusterName} Junior Youth Team`
      );
    } else if (type === 'camp_announcement') {
      const evTitle = selectedEvent?.title || 'Junior Youth Camp';
      const dates = selectedEvent ? `${selectedEvent.startDate} to ${selectedEvent.endDate}` : 'Upcoming Weekend';
      const loc = selectedEvent?.location || 'Camp Site';

      setCustomSubject(`Invitation: ${evTitle} (${dates})`);
      setMessageBody(
`Dear Families,

We are delighted to invite our Junior Youth to ${evTitle}!

📅 Dates: ${dates}
📍 Location: ${loc}
✨ Activities: Deep study of sacred texts, cooperative sports, artistic workshops, campfire devotions, and community service.

Please confirm your child's attendance and return the signed Parent Consent form by next week.

For questions, feel free to reply to this message.

Warmly,
${clusterName} Camp Organizing Committee`
      );
    } else if (type === 'service_project') {
      const pName = selectedProject?.projectName || 'Neighborhood Service Project';
      const pDate = selectedProject?.date || 'This Saturday';
      const pLoc = selectedProject?.location || 'Local Park';

      setCustomSubject(`Community Service Project: ${pName}`);
      setMessageBody(
`Dear Friends,

Our Junior Youth group will be carrying out a meaningful community service initiative: '${pName}'.

📅 Date: ${pDate}
📍 Meeting Point: ${pLoc}
🎯 Purpose: ${selectedProject?.description || 'Serving our local neighborhood with joy and teamwork.'}

Junior youth should wear comfortable clothes suitable for outdoor service. Light refreshments will be provided!

Warm regards,
Junior Youth Animators`
      );
    } else if (type === 'animator_gathering') {
      setCustomSubject(`Animator Accompaniment & Study Gathering - ${clusterName}`);
      setMessageBody(
`Dear Animators and Mentors,

You are warmly invited to our monthly Animator Reflection & Accompaniment Gathering.

📅 Date: Saturday, 4:00 PM
📍 Location: Cluster Institute Center
🌟 Focus: Reflecting on group progress, sharing cooperative game ideas, reviewing Ruhi Book 5 insights, and supporting one another in our service.

Please bring your reflections and ideas!

With loving appreciation for your service,
${clusterName} Coordinator Team`
      );
    }
  };

  // Set initial template
  React.useEffect(() => {
    generateTemplate('meeting_reminder');
  }, [selectedGroupId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(messageBody);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleEmail = () => {
    const encodedSub = encodeURIComponent(customSubject);
    const encodedBody = encodeURIComponent(messageBody);
    window.location.href = `mailto:?subject=${encodedSub}&body=${encodedBody}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold uppercase tracking-wider">
              <Share2 className="w-4 h-4" />
              <span>Ready-to-Share Announcement Composer</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Compose & Share Community Announcements
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-mono text-sm"
          >
            ✕
          </button>
        </div>

        {/* Template Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { id: 'meeting_reminder', label: 'Meeting Reminder' },
            { id: 'camp_announcement', label: 'Camp Invite' },
            { id: 'service_project', label: 'Service Project' },
            { id: 'animator_gathering', label: 'Animator Meeting' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => generateTemplate(t.id)}
              className={`p-2 rounded font-semibold text-center border transition-colors ${
                templateType === t.id
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Entity Selectors */}
        {templateType === 'meeting_reminder' && groups.length > 0 && (
          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">Select Group:</label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name} ({g.meetingDay})</option>
              ))}
            </select>
          </div>
        )}

        {/* Subject line */}
        <div className="text-xs">
          <label className="block font-semibold text-slate-700 mb-1">Subject Header</label>
          <input
            type="text"
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800 font-medium"
          />
        </div>

        {/* Editable Message Body */}
        <div className="text-xs">
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-slate-700">Message Content (Editable)</label>
            <span className="text-[11px] text-slate-400">Review before sharing</span>
          </div>
          <textarea
            rows={8}
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded bg-slate-50 text-slate-800 focus:outline-none focus:border-sky-500 font-mono text-[11px] leading-relaxed"
          />
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={handleEmail}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Draft Email</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 border border-slate-300 rounded text-slate-700 font-semibold text-xs hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
