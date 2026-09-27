import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  TrendingUp,
  Users,
  HeartHandshake,
  Calendar,
  Sparkles,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import {
  JuniorYouthGroup,
  JuniorYouthParticipant,
  Animator,
  Meeting,
  ServiceProject,
  CampOrEvent,
  ReportData,
  UserRole
} from '../../types';
import { BahaiNinePointedStar, BahaiDivider } from '../common/BahaiArt';

interface ClusterReportsProps {
  groups: JuniorYouthGroup[];
  participants: JuniorYouthParticipant[];
  animators: Animator[];
  meetings: Meeting[];
  serviceProjects: ServiceProject[];
  events: CampOrEvent[];
  reports: ReportData[];
  currentRole: UserRole;
  clusterName: string;
  onSaveReport: (report: ReportData) => void;
  onDeleteReport: (reportId: string) => void;
}

export const ClusterReports: React.FC<ClusterReportsProps> = ({
  groups,
  participants,
  animators,
  meetings,
  serviceProjects,
  events,
  reports,
  currentRole,
  clusterName,
  onSaveReport,
  onDeleteReport
}) => {
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State for generating new report
  const [reportTitle, setReportTitle] = useState('Quarterly Junior Youth Progress Report');
  const [reportPeriod, setReportPeriod] = useState('Q1 2026 (Jan - Mar)');
  const [progressNarrative, setProgressNarrative] = useState(
    'Groups have sustained consistent weekly study sessions. Youth are developing moral courage and consultation skills.'
  );
  const [challengesNarrative, setChallengesNarrative] = useState(
    'Additional trained animators needed to accompany newly forming groups in neighboring sub-districts.'
  );
  const [plansNarrative, setPlansNarrative] = useState(
    'Host an intensive Ruhi Book 5 training campaign and coordinate the upcoming cluster spring camp.'
  );

  const canGenerate = currentRole === 'admin' || currentRole === 'coordinator';

  // Aggregate Metrics
  const totalGroups = groups.length;
  const activeGroups = groups.filter((g) => g.status === 'active').length;
  const totalParticipants = participants.length;
  const totalAnimators = animators.length;
  const totalMeetings = meetings.length;
  const totalProjects = serviceProjects.length;
  const totalEvents = events.length;

  // Calculate Attendance Percentage
  let totalLogs = 0;
  let presentLogs = 0;
  meetings.forEach((m) => {
    Object.values(m.attendance || {}).forEach((st) => {
      totalLogs++;
      if (st === 'present' || st === 'late') presentLogs++;
    });
  });
  const avgAttendance = totalLogs > 0 ? Math.round((presentLogs / totalLogs) * 100) : 0;

  // Animator Support Needs
  const groupsNeedingAnimators = groups.filter((g) => g.animatorIds.length === 0);

  // Handler: Generate Report
  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newRep: ReportData = {
      id: 'rep-' + Date.now(),
      title: reportTitle.trim(),
      generatedAt: new Date().toISOString().split('T')[0],
      authorRole: currentRole,
      period: reportPeriod,
      totalGroups,
      totalJuniorYouth: totalParticipants,
      totalAnimators,
      totalMeetings,
      averageAttendancePct: avgAttendance,
      totalServiceProjects: totalProjects,
      totalEvents,
      progress: progressNarrative,
      challenges: challengesNarrative,
      plans: plansNarrative
    };

    onSaveReport(newRep);
    setIsGenerating(false);
    setSelectedReport(newRep);
  };

  // CSV Export Function
  const handleExportCSV = () => {
    const headers = [
      'Report Title',
      'Period',
      'Date Generated',
      'Total Groups',
      'Active Groups',
      'Total Junior Youth',
      'Total Animators',
      'Total Meetings',
      'Average Attendance Pct',
      'Service Projects',
      'Events'
    ];

    const rows = (reports.length > 0 ? reports : [
      {
        title: 'Cluster Status Summary',
        period: 'Current Live Data',
        generatedAt: new Date().toISOString().split('T')[0],
        totalGroups,
        activeGroups,
        totalJuniorYouth: totalParticipants,
        totalAnimators,
        totalMeetings,
        averageAttendancePct: avgAttendance,
        totalServiceProjects: totalProjects,
        totalEvents
      }
    ]).map((r: any) => [
      `"${r.title}"`,
      `"${r.period}"`,
      `"${r.generatedAt}"`,
      r.totalGroups,
      r.totalJuniorYouth,
      r.totalAnimators,
      r.totalMeetings,
      `"${r.averageAttendancePct}%"`,
      r.totalServiceProjects,
      r.totalEvents
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JY_Connect_Cluster_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
              Cluster Coordination & Reports
            </h1>
            <BahaiNinePointedStar size={16} color="#0284c7" />
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Aggregated institutional statistics, quarterly reports, and printable records for {clusterName}.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          {canGenerate && (
            <button
              onClick={() => setIsGenerating(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-sky-400" />
              <span>Generate New Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Cluster Aggregated Overview Metrics */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-sky-600" />
          <span>Aggregated Cluster Progress Indicators</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-sky-50/40 border border-slate-200 border-l-4 border-l-sky-500 rounded">
            <div className="text-[11px] font-bold text-sky-900">Groups in Cluster</div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              {activeGroups} / {totalGroups}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Active / Total</div>
          </div>

          <div className="p-3 bg-emerald-50/40 border border-slate-200 border-l-4 border-l-emerald-500 rounded">
            <div className="text-[11px] font-bold text-emerald-900">Junior Youth Enrolled</div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              {totalParticipants}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Across all groups</div>
          </div>

          <div className="p-3 bg-purple-50/40 border border-slate-200 border-l-4 border-l-purple-500 rounded">
            <div className="text-[11px] font-bold text-purple-900">Animators Available</div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              {totalAnimators}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Trained & in-training</div>
          </div>

          <div className="p-3 bg-amber-50/40 border border-slate-200 border-l-4 border-l-amber-500 rounded">
            <div className="text-[11px] font-bold text-amber-900">Attendance Average</div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              {avgAttendance}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{totalMeetings} sessions held</div>
          </div>
        </div>

        {/* Animator Support Gap Callout */}
        {groupsNeedingAnimators.length > 0 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Support Need Identified:</strong> {groupsNeedingAnimators.length} group(s) ({groupsNeedingAnimators.map((g) => g.name).join(', ')}) currently do not have assigned animators. Cluster coordinator consultation recommended.
            </div>
          </div>
        )}
      </div>

      {/* Generated Reports List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Historical Generated Reports</h3>
        {reports.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-xs text-slate-500">
            <FileText className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p>No quarterly reports generated yet.</p>
            {canGenerate && (
              <button
                onClick={() => setIsGenerating(true)}
                className="mt-2 text-sky-700 font-semibold hover:underline"
              >
                Compile and generate a progress report now
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-sky-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-sky-800 font-mono">
                        {rep.period}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{rep.title}</h4>
                      <div className="text-xs text-slate-500 mt-0.5 font-mono">
                        Compiled on {rep.generatedAt}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center text-xs">
                    <div className="p-1.5 bg-slate-50 rounded">
                      <div className="text-[10px] text-slate-500">Groups</div>
                      <div className="font-bold text-slate-900 font-mono">{rep.totalGroups}</div>
                    </div>
                    <div className="p-1.5 bg-slate-50 rounded">
                      <div className="text-[10px] text-slate-500">Youth</div>
                      <div className="font-bold text-slate-900 font-mono">{rep.totalJuniorYouth}</div>
                    </div>
                    <div className="p-1.5 bg-slate-50 rounded">
                      <div className="text-[10px] text-slate-500">Attendance</div>
                      <div className="font-bold text-slate-900 font-mono">
                        {rep.averageAttendancePct}%
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 line-clamp-2">
                    <strong>Progress:</strong> {rep.progress}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedReport(rep)}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-900"
                  >
                    Open Full Report View
                  </button>

                  {canGenerate && (
                    <button
                      onClick={() => onDeleteReport(rep.id)}
                      className="p-1 text-slate-400 hover:text-red-700 rounded"
                      title="Delete Report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Printable Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6 print:p-0 print:border-none">
            {/* Report Document Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 font-sans">
                    {selectedReport.title}
                  </h2>
                  <BahaiNinePointedStar size={18} color="#0284c7" />
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Cluster: <strong>{clusterName}</strong> · Period: <strong>{selectedReport.period}</strong> · Date: <strong>{selectedReport.generatedAt}</strong>
                </div>
              </div>
              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Metrics Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Quantitative Cluster Summary
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <div className="text-slate-500 text-[11px]">Groups</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                    {selectedReport.totalGroups}
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <div className="text-slate-500 text-[11px]">Junior Youth</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                    {selectedReport.totalJuniorYouth}
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <div className="text-slate-500 text-[11px]">Animators</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                    {selectedReport.totalAnimators}
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <div className="text-slate-500 text-[11px]">Attendance</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                    {selectedReport.averageAttendancePct}%
                  </div>
                </div>
              </div>
            </div>

            {/* Qualitative Narrative */}
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  1. Progress & Achievements
                </h4>
                <p className="mt-1.5 text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                  {selectedReport.progress}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  2. Challenges & Obstacles
                </h4>
                <p className="mt-1.5 text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                  {selectedReport.challenges}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  3. Strategic Plans for Next Cycle
                </h4>
                <p className="mt-1.5 text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                  {selectedReport.plans}
                </p>
              </div>
            </div>

            <BahaiDivider className="my-4" />

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 print:hidden">
              <span className="text-[11px] text-slate-400">
                Generated with JY Connect · Protected Minor Privacy Safe
              </span>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Form Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">Compile Cluster Progress Report</h2>
              <button
                onClick={() => setIsGenerating(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateReport} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Report Title</label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Period Covered</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q1 2026 (Jan - Mar)"
                  value={reportPeriod}
                  onChange={(e) => setReportPeriod(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-sky-50 border border-sky-200 rounded text-slate-800 space-y-1">
                <div className="font-semibold text-sky-950">Live Snapshot Captured:</div>
                <div className="text-[11px]">
                  • Groups: {totalGroups} ({activeGroups} active) · Youth: {totalParticipants}
                </div>
                <div className="text-[11px]">
                  • Animators: {totalAnimators} · Sessions: {totalMeetings} · Attendance: {avgAttendance}%
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  1. Progress & Accomplishments
                </label>
                <textarea
                  rows={2}
                  required
                  value={progressNarrative}
                  onChange={(e) => setProgressNarrative(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  2. Challenges & Animator Needs
                </label>
                <textarea
                  rows={2}
                  required
                  value={challengesNarrative}
                  onChange={(e) => setChallengesNarrative(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  3. Forward Plans & Training Targets
                </label>
                <textarea
                  rows={2}
                  required
                  value={plansNarrative}
                  onChange={(e) => setPlansNarrative(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsGenerating(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800"
                >
                  Save & Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
