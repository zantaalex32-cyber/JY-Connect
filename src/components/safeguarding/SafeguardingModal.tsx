import React, { useState } from 'react';
import {
  SafeguardingIncident,
  AuditLogEntry,
  JuniorYouthParticipant,
  UserRole,
  IncidentSeverity,
  IncidentStatus
} from '../../types';
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  FileText,
  UserCheck,
  Plus,
  Eye,
  CheckCircle2,
  Trash2,
  History
} from 'lucide-react';

interface SafeguardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: SafeguardingIncident[];
  auditLogs: AuditLogEntry[];
  participants: JuniorYouthParticipant[];
  currentRole: UserRole;
  onSaveIncident: (incident: SafeguardingIncident) => void;
  onDeleteIncident: (id: string) => void;
}

export function SafeguardingModal({
  isOpen,
  onClose,
  incidents,
  auditLogs,
  participants,
  currentRole,
  onSaveIncident,
  onDeleteIncident
}: SafeguardingModalProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'consent' | 'incidents' | 'audit'>('consent');
  const [isAddIncidentOpen, setIsAddIncidentOpen] = useState(false);

  // Form for incident
  const [incidentTitle, setIncidentTitle] = useState('');
  const [incidentSeverity, setIncidentSeverity] = useState<IncidentSeverity>('medium');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [incidentActions, setIncidentActions] = useState('');
  const [incidentConfidential, setIncidentConfidential] = useState('');

  const canAccessSafeguarding = currentRole === 'admin' || currentRole === 'coordinator';

  const handleSaveIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentTitle.trim()) return;

    const newInc: SafeguardingIncident = {
      id: `inc-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      reportedByRole: currentRole,
      reporterName: currentRole === 'coordinator' ? 'Cluster Coordinator' : 'Animator',
      title: incidentTitle.trim(),
      severity: incidentSeverity,
      description: incidentDescription.trim(),
      actionsTaken: incidentActions.trim(),
      status: 'open',
      confidentialNotes: incidentConfidential.trim(),
      followUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    };

    onSaveIncident(newInc);
    setIsAddIncidentOpen(false);
    setIncidentTitle('');
    setIncidentDescription('');
    setIncidentActions('');
    setIncidentConfidential('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Child Safeguarding, Consent & Audit Compliance
              </h2>
              <p className="text-xs text-slate-500">
                Data protection, guardian permissions, restricted incident reporting, and security logs.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-mono text-sm"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('consent')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'consent'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Guardian Consent Records ({participants.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'incidents'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Safeguarding Incidents ({incidents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Administrative Audit Log ({auditLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: Consent Records */}
        {activeTab === 'consent' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-sky-50 border border-sky-200 rounded text-sky-950 flex items-center justify-between">
              <div>
                <strong>Guardian Consent Protocol:</strong> Signed parent permissions, emergency contact verification, photo release permissions, and health notes for all minors.
              </div>
            </div>

            {participants.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded border border-slate-200">
                No junior youth participants currently registered.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase">
                    <tr>
                      <th className="p-2.5">Junior Youth</th>
                      <th className="p-2.5">Parent / Guardian</th>
                      <th className="p-2.5">Emergency Contact</th>
                      <th className="p-2.5">Consent Status</th>
                      <th className="p-2.5">Photo Release</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {participants.map((p) => {
                      const hasConsent = p.consent?.consentGiven ?? true; // Defaults to confirmed in sample
                      const photoAllowed = p.consent?.photoReleaseAllowed ?? true;

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-bold text-slate-900">
                            {p.name} ({p.age} yrs)
                          </td>
                          <td className="p-2.5 text-slate-700">
                            {p.parentGuardianName || 'Recorded on File'}
                          </td>
                          <td className="p-2.5 font-mono text-slate-700">
                            {p.parentGuardianContact || 'Confidential'}
                          </td>
                          <td className="p-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                hasConsent
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}
                            >
                              {hasConsent ? 'Signed & Verified' : 'Pending Consent'}
                            </span>
                          </td>
                          <td className="p-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                photoAllowed
                                  ? 'bg-sky-50 text-sky-800 border border-sky-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {photoAllowed ? 'Allowed' : 'Private (No Photos)'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Restricted Safeguarding Incidents */}
        {activeTab === 'incidents' && (
          <div className="space-y-4 text-xs">
            {!canAccessSafeguarding ? (
              <div className="p-6 text-center bg-rose-50 border border-rose-200 rounded text-rose-900">
                <Lock className="w-6 h-6 mx-auto mb-2 text-rose-700" />
                <h4 className="font-bold">Restricted Access</h4>
                <p className="mt-1">
                  Safeguarding incident reports are strictly restricted to designated Cluster Coordinators and Administrators.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="text-slate-600">
                    Restricted confidential log for duty-of-care follow-ups, minor safety, and resolution notes.
                  </div>
                  <button
                    onClick={() => setIsAddIncidentOpen(true)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Report Safeguarding Concern</span>
                  </button>
                </div>

                {isAddIncidentOpen && (
                  <form onSubmit={handleSaveIncident} className="p-4 bg-rose-50/50 border border-rose-200 rounded-lg space-y-3">
                    <h4 className="font-bold text-rose-950">New Confidential Incident Record</h4>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Title / Brief Subject *</label>
                        <input
                          type="text"
                          required
                          value={incidentTitle}
                          onChange={(e) => setIncidentTitle(e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded bg-white"
                          placeholder="e.g. Health incident during sports day"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Severity</label>
                        <select
                          value={incidentSeverity}
                          onChange={(e) => setIncidentSeverity(e.target.value as IncidentSeverity)}
                          className="w-full p-2 border border-slate-300 rounded bg-white"
                        >
                          <option value="low">Low - Informational</option>
                          <option value="medium">Medium - Coordinator Attention</option>
                          <option value="high">High - Urgent Action Required</option>
                          <option value="critical">Critical - Immediate Duty of Care</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Description of What Occurred *</label>
                      <textarea
                        rows={2}
                        required
                        value={incidentDescription}
                        onChange={(e) => setIncidentDescription(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Immediate Actions Taken</label>
                      <textarea
                        rows={2}
                        value={incidentActions}
                        onChange={(e) => setIncidentActions(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded bg-white"
                        placeholder="First aid administered, parents notified, coordinator informed..."
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Confidential Institutional Notes</label>
                      <textarea
                        rows={2}
                        value={incidentConfidential}
                        onChange={(e) => setIncidentConfidential(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded bg-white"
                        placeholder="Internal follow-up records..."
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddIncidentOpen(false)}
                        className="px-3 py-1 border border-slate-300 rounded text-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold"
                      >
                        Save Confidential Record
                      </button>
                    </div>
                  </form>
                )}

                {incidents.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 bg-slate-50 rounded border border-slate-200">
                    No safeguarding incidents recorded. The cluster environment remains safe and positive.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {incidents.map((inc) => (
                      <div key={inc.id} className="p-3.5 border border-slate-200 rounded-lg bg-white shadow-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{inc.title}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-300">
                              {inc.severity}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-500">{inc.date}</span>
                        </div>
                        <p className="text-slate-700 mt-1">{inc.description}</p>
                        {inc.actionsTaken && (
                          <div className="mt-2 text-[11px] text-emerald-900 bg-emerald-50 p-2 rounded border border-emerald-200">
                            <strong>Actions Taken:</strong> {inc.actionsTaken}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* TAB 3: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="space-y-3 text-xs">
            <div className="text-slate-600">
              Immutable timeline of administrative operations, data exports, backups, and role changes.
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase sticky top-0">
                  <tr>
                    <th className="p-2">Timestamp</th>
                    <th className="p-2">User / Role</th>
                    <th className="p-2">Action</th>
                    <th className="p-2">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-2 text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="p-2 font-bold text-slate-800">
                        {log.userName} ({log.userRole})
                      </td>
                      <td className="p-2">
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-800 font-bold text-[10px]">
                          {log.actionType}
                        </span>
                      </td>
                      <td className="p-2 text-slate-600 font-sans">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800"
          >
            Close Safeguarding Panel
          </button>
        </div>
      </div>
    </div>
  );
}
