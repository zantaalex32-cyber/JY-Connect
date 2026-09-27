import React, { useState } from 'react';
import {
  JuniorYouthGroup,
  JuniorYouthParticipant,
  Animator,
  ServiceProject,
  CampOrEvent,
  UserRole
} from '../../types';
import {
  MapPin,
  Users,
  Compass,
  Sparkles,
  HeartHandshake,
  Layers,
  ChevronRight,
  ShieldCheck,
  Building
} from 'lucide-react';

interface ClusterNeighborhoodViewProps {
  groups: JuniorYouthGroup[];
  participants: JuniorYouthParticipant[];
  animators: Animator[];
  serviceProjects: ServiceProject[];
  events: CampOrEvent[];
  clusterName: string;
  currentRole: UserRole;
  onNavigateTab: (tab: string) => void;
}

export function ClusterNeighborhoodView({
  groups,
  participants,
  animators,
  serviceProjects,
  events,
  clusterName,
  currentRole,
  onNavigateTab
}: ClusterNeighborhoodViewProps) {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');

  // Extract unique neighborhoods from groups
  const neighborhoods = Array.from(
    new Set(
      groups
        .map((g) => g.neighborhood?.trim())
        .filter(Boolean)
    )
  );

  // If empty, offer standard cluster neighborhood hubs
  const activeNeighborhoods = neighborhoods.length > 0 ? neighborhoods : ['Northside Hub', 'East Valley', 'Central Park', 'Riverdale'];

  const filteredGroups = selectedNeighborhood === 'all'
    ? groups
    : groups.filter((g) => g.neighborhood === selectedNeighborhood);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-600" />
            <span>Cluster & Neighborhood Management</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Geographic coordination across neighborhoods, community hubs, animators, and service projects in <strong>{clusterName}</strong>.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-md text-xs">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Neighborhood View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Interactive Cluster Map
          </button>
        </div>
      </div>

      {/* Safeguarding Privacy Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-950 flex items-center gap-2 shadow-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
        <div>
          <strong className="font-bold">Safeguarding & Minor Privacy:</strong> Maps and neighborhood summaries display public community centers, local libraries, and parks. Private residential addresses of junior youth and families are strictly protected and never displayed.
        </div>
      </div>

      {/* Cluster Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 border-l-4 border-l-sky-500 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-bold text-sky-900">Active Neighborhoods</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {activeNeighborhoods.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">geographic sectors</div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-indigo-500 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-bold text-indigo-900">Total Groups</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {groups.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">junior youth groups</div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-purple-500 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-bold text-purple-900">Enrolled Youth</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {participants.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">ages 11 to 15</div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-900">Active Service Sites</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {serviceProjects.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">community initiatives</div>
        </div>
      </div>

      {viewMode === 'map' ? (
        /* Interactive SVG Cluster Map */
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-600" />
              <span>{clusterName} - Activity Hubs & Neighborhood Sectors</span>
            </h2>
            <div className="text-xs text-slate-500">
              Click a sector to inspect local groups and service projects
            </div>
          </div>

          <div className="relative w-full h-[400px] bg-slate-100 rounded-lg border border-slate-300 overflow-hidden flex items-center justify-center">
            {/* SVG Visual Canvas */}
            <svg
              viewBox="0 0 800 450"
              className="w-full h-full select-none"
              style={{ background: '#f8fafc' }}
            >
              {/* Grid Lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Geographic River / Pathway */}
              <path
                d="M 0,220 Q 200,260 400,200 T 800,240"
                fill="none"
                stroke="#bae6fd"
                strokeWidth="18"
                strokeLinecap="round"
              />

              {/* Neighborhood 1: Sector A (North-West) */}
              <g
                onClick={() => setSelectedNeighborhood(activeNeighborhoods[0] || 'Sector A')}
                className="cursor-pointer group"
              >
                <circle cx="200" cy="120" r="70" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
                <circle cx="200" cy="120" r="16" fill="#0284c7" />
                <text x="200" y="125" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                  {groups.filter(g => g.neighborhood === activeNeighborhoods[0]).length || '1'}
                </text>
                <text x="200" y="210" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">
                  {activeNeighborhoods[0] || 'Sector 1'}
                </text>
                <text x="200" y="225" textAnchor="middle" fill="#64748b" fontSize="10">
                  Community Center Hub
                </text>
              </g>

              {/* Neighborhood 2: Sector B (North-East) */}
              <g
                onClick={() => setSelectedNeighborhood(activeNeighborhoods[1] || 'Sector B')}
                className="cursor-pointer group"
              >
                <circle cx="600" cy="110" r="65" fill="#f3e8ff" stroke="#c084fc" strokeWidth="2" strokeDasharray="4 2" />
                <circle cx="600" cy="110" r="16" fill="#7e22ce" />
                <text x="600" y="115" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                  {groups.filter(g => g.neighborhood === activeNeighborhoods[1]).length || '1'}
                </text>
                <text x="600" y="195" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">
                  {activeNeighborhoods[1] || 'Sector 2'}
                </text>
                <text x="600" y="210" textAnchor="middle" fill="#64748b" fontSize="10">
                  Public Library Hub
                </text>
              </g>

              {/* Neighborhood 3: Sector C (South-West) */}
              <g
                onClick={() => setSelectedNeighborhood(activeNeighborhoods[2] || 'Sector C')}
                className="cursor-pointer group"
              >
                <circle cx="240" cy="340" r="60" fill="#dcfce7" stroke="#4ade80" strokeWidth="2" strokeDasharray="4 2" />
                <circle cx="240" cy="340" r="16" fill="#15803d" />
                <text x="240" y="345" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                  {groups.filter(g => g.neighborhood === activeNeighborhoods[2]).length || '1'}
                </text>
                <text x="240" y="420" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">
                  {activeNeighborhoods[2] || 'Sector 3'}
                </text>
                <text x="240" y="435" textAnchor="middle" fill="#64748b" fontSize="10">
                  Park Pavilion
                </text>
              </g>

              {/* Neighborhood 4: Sector D (South-East) */}
              <g
                onClick={() => setSelectedNeighborhood(activeNeighborhoods[3] || 'Sector D')}
                className="cursor-pointer group"
              >
                <circle cx="560" cy="330" r="65" fill="#fef3c7" stroke="#fcd34d" strokeWidth="2" strokeDasharray="4 2" />
                <circle cx="560" cy="330" r="16" fill="#b45309" />
                <text x="560" y="335" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                  {groups.filter(g => g.neighborhood === activeNeighborhoods[3]).length || '0'}
                </text>
                <text x="560" y="415" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">
                  {activeNeighborhoods[3] || 'Sector 4'}
                </text>
                <text x="560" y="430" textAnchor="middle" fill="#64748b" fontSize="10">
                  Youth Center
                </text>
              </g>
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">
            <span>Selected sector: <strong>{selectedNeighborhood === 'all' ? 'Entire Cluster' : selectedNeighborhood}</strong></span>
            {selectedNeighborhood !== 'all' && (
              <button
                onClick={() => setSelectedNeighborhood('all')}
                className="text-sky-700 font-bold hover:underline"
              >
                Show all neighborhoods
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* Neighborhood Sector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeNeighborhoods.map((nName) => {
          const nGroups = groups.filter((g) => g.neighborhood === nName);
          const nParticipants = participants.filter((p) => p.neighborhood === nName);
          const nAnimators = animators.filter((a) =>
            a.groupIds.some((gid) => nGroups.some((ng) => ng.id === gid))
          );
          const nProjects = serviceProjects.filter((p) =>
            nGroups.some((g) => g.id === p.groupId)
          );

          return (
            <div
              key={nName}
              className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-sky-300 transition-colors shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{nName}</h3>
                      <div className="text-[11px] text-slate-500">Activity Sector</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                    {nGroups.length} Group{nGroups.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">Junior Youth</span>
                    <strong className="text-slate-900 font-mono text-sm">{nParticipants.length}</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">Animators</span>
                    <strong className="text-slate-900 font-mono text-sm">{nAnimators.length}</strong>
                  </div>
                </div>

                {/* Groups in this neighborhood */}
                <div className="mt-3 text-xs">
                  <span className="text-slate-500 font-semibold text-[11px]">Groups Active:</span>
                  {nGroups.length === 0 ? (
                    <div className="text-slate-400 italic text-[11px] mt-0.5">
                      No groups active in this sector yet.
                    </div>
                  ) : (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {nGroups.map((g) => (
                        <span
                          key={g.id}
                          className="bg-sky-50 text-sky-900 border border-sky-200 px-2 py-0.5 rounded text-[11px] font-semibold"
                        >
                          {g.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Service projects in this neighborhood */}
                {nProjects.length > 0 && (
                  <div className="mt-2 text-xs">
                    <span className="text-slate-500 font-semibold text-[11px]">Service Sites:</span>
                    <div className="mt-1 text-[11px] text-emerald-800 font-medium">
                      {nProjects.map((p) => p.projectName).join(', ')}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigateTab('groups')}
                  className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
                >
                  <span>Manage Groups</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
