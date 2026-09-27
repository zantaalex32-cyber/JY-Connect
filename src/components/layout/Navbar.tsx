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
  RotateCcw,
  Sparkles,
  Wifi,
  WifiOff,
  RefreshCw,
  Share2,
  ShieldCheck,
  CheckSquare,
  Globe
} from 'lucide-react';
import { UserRole, SyncStatus, LanguageCode } from '../../types';
import { JyMascotLogo, BahaiNinePointedStar } from '../common/BahaiArt';
import { getTranslation } from '../../utils/i18n';

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
  syncStatus: SyncStatus;
  onTriggerSync: () => void;
  language: LanguageCode;
  onSetLanguage: (lang: LanguageCode) => void;
  onOpenAssistant: () => void;
  onOpenAnnouncements: () => void;
  onOpenSafeguarding: () => void;
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
  whatsappContact,
  syncStatus,
  onTriggerSync,
  language,
  onSetLanguage,
  onOpenAssistant,
  onOpenAnnouncements,
  onOpenSafeguarding
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const t = (k: any) => getTranslation(language, k);

  const navLinks = [
    { id: 'dashboard', label: t('dashboard') },
    { id: 'my_week', label: t('myWeek') },
    { id: 'groups', label: t('groups') },
    { id: 'participants', label: t('participants') },
    { id: 'animators', label: t('animators') },
    { id: 'meetings', label: t('meetings') },
    { id: 'study', label: t('study') },
    { id: 'service', label: t('service') },
    { id: 'events', label: t('events') },
    { id: 'calendar', label: t('calendar') },
    { id: 'tasks', label: t('tasks') },
    { id: 'support_center', label: t('supportCenter') },
    { id: 'cluster', label: t('cluster') },
    { id: 'materials', label: t('materials') },
    { id: 'reports', label: t('reports') },
    { id: 'settings', label: t('settings') }
  ];

  const roleLabels: Record<UserRole, string> = {
    admin: t('admin'),
    coordinator: t('coordinator'),
    animator: t('animator'),
    viewer: t('viewer')
  };

  const handleWhatsAppClick = () => {
    const cleanNum = whatsappContact.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNum}?text=Hello%20JY%20Connect%20Coordinator`, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Upper Status & Demo Bar */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1 text-[11px] flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {/* Offline / Online Sync Indicator */}
          <button
            onClick={onTriggerSync}
            title="Click to synchronize offline changes"
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            {syncStatus === 'online' && (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="font-semibold text-emerald-400">{t('online')}</span>
              </>
            )}
            {syncStatus === 'offline' && (
              <>
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span className="font-semibold text-amber-400">{t('offline')}</span>
              </>
            )}
            {syncStatus === 'synchronizing' && (
              <>
                <RefreshCw className="w-3 h-3 text-sky-400 animate-spin" />
                <span className="font-semibold text-sky-400">{t('synchronizing')}</span>
              </>
            )}
            {syncStatus === 'synced' && (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="font-semibold text-emerald-400">{t('synced')}</span>
              </>
            )}
          </button>

          {isDemoDataActive && (
            <span className="text-sky-300 font-medium hidden sm:inline">
              Practice Data Mode Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Action: Safeguarding */}
          <button
            onClick={onOpenSafeguarding}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Safeguarding & Consent</span>
          </button>

          {/* Quick Action: Announcements */}
          <button
            onClick={onOpenAnnouncements}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Share2 className="w-3 h-3 text-sky-400" />
            <span>Share Announcement</span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 hover:text-white transition-colors font-bold"
            >
              <Globe className="w-3 h-3 text-slate-400" />
              <span>{language.toUpperCase()}</span>
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white text-slate-900 border border-slate-200 shadow-lg rounded py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    onSetLanguage('en');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between ${
                    language === 'en' ? 'font-bold text-sky-700 bg-sky-50' : ''
                  }`}
                >
                  <span>English</span>
                  {language === 'en' && <span>✓</span>}
                </button>
                <button
                  onClick={() => {
                    onSetLanguage('sw');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between ${
                    language === 'sw' ? 'font-bold text-sky-700 bg-sky-50' : ''
                  }`}
                >
                  <span>Kiswahili</span>
                  {language === 'sw' && <span>✓</span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
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

          {/* Nav Links */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-slate-700">
            {navLinks.slice(0, 8).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  activeTab === item.id
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:text-sky-700 hover:bg-sky-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* More Menu Dropdown */}
            <div className="relative group">
              <button className="px-2.5 py-1.5 rounded-md text-slate-700 hover:text-sky-700 hover:bg-sky-50 flex items-center gap-1">
                <span>More</span>
                <span className="text-xs">▾</span>
              </button>
              <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 shadow-md rounded-md py-1 hidden group-hover:block hover:block z-50">
                {navLinks.slice(8).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                      activeTab === item.id
                        ? 'bg-sky-100 text-sky-900 font-bold'
                        : 'text-slate-700 hover:bg-sky-50 hover:text-sky-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* JY Assistant Button */}
            <button
              onClick={onOpenAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs"
              title="Open AI Assistant for lesson ideas, games, and reports"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">JY Assistant</span>
            </button>

            {/* Global Search */}
            <button
              onClick={openGlobalSearch}
              title="Search groups, youth, animators, materials, tasks"
              className="p-2 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
              aria-label="Global Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications */}
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

            {/* WhatsApp Contact */}
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

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
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
                    ? 'bg-sky-100 text-sky-900 font-bold'
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
                onOpenAssistant();
                setMobileMenuOpen(false);
              }}
              className="text-left text-xs font-bold text-white bg-slate-900 px-3 py-2 rounded-md flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Ask JY Assistant</span>
            </button>
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
          </div>
        </div>
      )}
    </header>
  );
};
