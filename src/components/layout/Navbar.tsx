import React, { useState } from 'react';
import {
  Bell,
  Search,
  MessageCircle,
  Menu,
  X,
  Shield,
  Layers,
  Database,
  RotateCcw
} from 'lucide-react';
import { UserRole } from '../../types';
import { JyMascotLogo, BahaiNinePointedStar } from '../common/BahaiArt';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  unreadNotificationsCount: number;
  openNotifications: () => void;
  openGlobalSearch: () => void;
  isDemoDataActive: boolean;
  onToggleDemoData: () => void;
  onResetEmptyData: () => void;
  whatsappContact: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  unreadNotificationsCount,
  openNotifications,
  openGlobalSearch,
  isDemoDataActive,
  onToggleDemoData,
  onResetEmptyData,
  whatsappContact
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'groups', label: 'Groups' },
    { id: 'participants', label: 'Junior Youth' },
    { id: 'animators', label: 'Animators' },
    { id: 'meetings', label: 'Meetings' },
    { id: 'study', label: 'Study Program' },
    { id: 'service', label: 'Service' },
    { id: 'events', label: 'Camps & Events' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'materials', label: 'Materials Library' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' }
  ];

  const roleLabels: Record<UserRole, string> = {
    admin: 'Administrator',
    coordinator: 'Cluster Coordinator',
    animator: 'Animator',
    viewer: 'Viewer (Read-only)'
  };

  const handleWhatsAppClick = () => {
    // Clean formatted number for WhatsApp link
    const cleanNum = whatsappContact.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNum}?text=Hello%20JY%20Connect%20Coordinator`, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Upper Announcement / Demo Indicator Bar if Demo is Active */}
      {isDemoDataActive && (
        <div className="bg-sky-50 border-b border-sky-100 px-4 py-1.5 text-xs text-sky-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-600 inline-block" />
            <span className="font-semibold">Practice Demo Mode Active:</span>
            <span>Displaying sample Bahá’í Junior Youth groups and meetings.</span>
          </div>
          <button
            onClick={onResetEmptyData}
            className="flex items-center gap-1 font-medium text-sky-700 hover:text-sky-900 underline ml-2"
          >
            <RotateCcw className="w-3 h-3" />
            Reset to Clean Empty State
          </button>
        </div>
      )}

      {/* Main Top Bar Contract: Zone 1 (Brand) - Zone 2 (Nav Links) - Zone 3 (Primary Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element Brand Zone with Mascot & Star Emblem */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 bg-sky-100 border border-sky-300 rounded-lg flex items-center justify-center text-slate-900 shrink-0 group-hover:bg-sky-200 transition-colors">
                <JyMascotLogo size={30} color="#0369a1" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-sans flex items-center gap-1.5">
                  JY Connect
                  <BahaiNinePointedStar size={15} color="#0284c7" />
                </span>
                <span className="text-[10px] text-sky-700 font-semibold tracking-wider uppercase">Bahá’í Junior Youth</span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop 4-6 prominent, with More dropdown for rest) */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-700">
            {navLinks.slice(0, 7).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  activeTab === item.id
                    ? 'bg-sky-600 text-white font-semibold shadow-xs'
                    : 'text-slate-700 hover:text-sky-700 hover:bg-sky-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* More Menu Dropdown for remaining links */}
            <div className="relative group">
              <button className="px-3 py-1.5 rounded-md text-slate-700 hover:text-sky-700 hover:bg-sky-50 flex items-center gap-1">
                <span>More</span>
                <span className="text-xs">▾</span>
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 shadow-md rounded-md py-1 hidden group-hover:block hover:block z-50">
                {navLinks.slice(7).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                      activeTab === item.id
                        ? 'bg-sky-100 text-sky-900 font-semibold'
                        : 'text-slate-700 hover:bg-sky-50 hover:text-sky-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Zone 3: Primary Actions (Search, Notifications, Role Switcher, WhatsApp Support) */}
          <div className="flex items-center gap-2">
            {/* Global Search Button */}
            <button
              onClick={openGlobalSearch}
              title="Search groups, youth, animators, materials"
              className="p-2 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
              aria-label="Global Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications Button */}
            <button
              onClick={openNotifications}
              title="Notifications"
              className="relative p-2 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white" />
              )}
            </button>

            {/* WhatsApp Contact Button */}
            <button
              onClick={handleWhatsAppClick}
              title={`Coordinator WhatsApp Support: ${whatsappContact}`}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 border border-emerald-700 rounded-md hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-white" />
              <span>WhatsApp</span>
            </button>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-md transition-colors shadow-xs ${
                  currentRole === 'coordinator'
                    ? 'bg-indigo-700 hover:bg-indigo-800'
                    : currentRole === 'animator'
                    ? 'bg-teal-700 hover:bg-teal-800'
                    : currentRole === 'admin'
                    ? 'bg-slate-900 hover:bg-slate-800'
                    : 'bg-slate-600 hover:bg-slate-700'
                }`}
                title="Switch active user role"
              >
                <Shield className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden md:inline">{roleLabels[currentRole]}</span>
                <span className="md:hidden capitalize">{currentRole}</span>
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 shadow-lg rounded-md py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    Switch Active Role
                  </div>
                  {(['coordinator', 'animator', 'admin', 'viewer'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setCurrentRole(r);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                        currentRole === r
                          ? 'bg-sky-50 text-sky-900 font-semibold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{roleLabels[r]}</span>
                      {currentRole === r && <span className="text-sky-600 font-bold">✓</span>}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1 px-3 py-1">
                    <button
                      onClick={() => {
                        onToggleDemoData();
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full text-left text-xs text-sky-700 hover:text-sky-900 flex items-center gap-1.5 py-1"
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>{isDemoDataActive ? 'Reset to Empty Data' : 'Load Practice Sample Data'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <div className="grid grid-cols-2 gap-1 py-2">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-sky-100 text-sky-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onToggleDemoData();
                setMobileMenuOpen(false);
              }}
              className="text-left text-xs font-medium text-sky-800 bg-sky-50 px-3 py-2 rounded-md flex items-center gap-2"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isDemoDataActive ? 'Clear & Start Empty' : 'Load Demo Practice Data'}</span>
            </button>
            <button
              onClick={handleWhatsAppClick}
              className="text-left text-xs font-medium text-slate-800 bg-slate-100 px-3 py-2 rounded-md flex items-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5 text-sky-600" />
              <span>Coordinator WhatsApp: {whatsappContact}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
