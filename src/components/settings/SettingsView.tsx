import React, { useState } from 'react';
import {
  Shield,
  MessageCircle,
  Database,
  RotateCcw,
  CheckCircle,
  Save,
  Lock,
  Users,
  Building
} from 'lucide-react';
import { AppSettings, UserRole } from '../../types';
import { BahaiNinePointedStar, BahaiDivider } from '../common/BahaiArt';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  currentRole: UserRole;
  isDemoDataActive: boolean;
  onLoadPracticeData: () => void;
  onResetEmptyData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  currentRole,
  isDemoDataActive,
  onLoadPracticeData,
  onResetEmptyData
}) => {
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const canConfigure = currentRole === 'admin' || currentRole === 'coordinator';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleTestWhatsApp = () => {
    const cleanNum = formData.whatsappContact.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNum}?text=Hello%20JY%20Connect%20Support`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
              Settings & Privacy Safeguards
            </h1>
            <BahaiNinePointedStar size={16} color="#0284c7" />
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Cluster configurations, minor privacy protections, coordinator contacts, and database controls.
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Cluster Configuration */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">Cluster Identity & Localization</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Cluster / Community Name
              </label>
              <input
                type="text"
                disabled={!canConfigure}
                value={formData.clusterName}
                onChange={(e) => setFormData({ ...formData, clusterName: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none disabled:bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Coordinator Team Contact Name
              </label>
              <input
                type="text"
                disabled={!canConfigure}
                value={formData.coordinatorContact}
                onChange={(e) => setFormData({ ...formData, coordinatorContact: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none disabled:bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Helpline Integration */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Coordinator WhatsApp Contact</h3>
            </div>
            <button
              type="button"
              onClick={handleTestWhatsApp}
              className="text-xs text-white bg-emerald-600 hover:bg-emerald-700 font-semibold px-2.5 py-1 rounded shadow-xs transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Test WhatsApp Link</span>
            </button>
          </div>

          <div className="text-xs text-slate-600 space-y-3">
            <p>
              This phone number is used across the application for the instant "Coordinator Support" helpline button so animators and parents can contact coordination directly.
            </p>
            <div className="max-w-xs">
              <label className="block font-semibold text-slate-800 mb-1">
                WhatsApp Phone Number
              </label>
              <input
                type="text"
                disabled={!canConfigure}
                value={formData.whatsappContact}
                onChange={(e) => setFormData({ ...formData, whatsappContact: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none font-mono disabled:bg-slate-50"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Standard configured contact: <strong>0114488963</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Privacy Safeguards for Minors */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">Minor Privacy & Data Safeguards</h3>
          </div>

          <div className="text-xs text-slate-600 space-y-3">
            <p className="leading-relaxed">
              Because Junior Youth groups engage adolescents aged 11 to 15, personal guardian contact details and private notes are safeguarded according to child protection best practices.
            </p>

            <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded cursor-pointer">
              <input
                type="checkbox"
                disabled={!canConfigure}
                checked={formData.privacyProtectionEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, privacyProtectionEnabled: e.target.checked })
                }
                className="mt-0.5"
              />
              <div>
                <span className="font-semibold text-slate-900 block">
                  Enable Guardian Contact Masking
                </span>
                <span className="text-[11px] text-slate-500">
                  When enabled, phone numbers and private guardian contact information are masked by default for viewers and general users, and can only be unmasked by authenticated animators and coordinators.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Role Permissions Reference */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">Role-Based Access Hierarchy</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-indigo-50/40 border border-slate-200 border-l-4 border-l-indigo-600 rounded">
              <div className="font-bold text-indigo-950">Cluster Coordinator</div>
              <div className="text-slate-600 mt-1">
                Full authority to manage groups, assign animators, schedule cluster camps, compile quarterly reports, and oversee attendance health.
              </div>
            </div>

            <div className="p-3 bg-emerald-50/40 border border-slate-200 border-l-4 border-l-emerald-600 rounded">
              <div className="font-bold text-emerald-950">Animator</div>
              <div className="text-slate-600 mt-1">
                Manage assigned group meetings, mark attendance, track study cycles, consultation questions, and community service projects.
              </div>
            </div>

            <div className="p-3 bg-sky-50/40 border border-slate-200 border-l-4 border-l-sky-600 rounded">
              <div className="font-bold text-sky-950">Administrator</div>
              <div className="text-slate-600 mt-1">
                System administration, database maintenance, user authorization, and cluster-wide configuration settings.
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 border-l-4 border-l-slate-400 rounded">
              <div className="font-bold text-slate-900">Viewer</div>
              <div className="text-slate-600 mt-1">
                Read-only access to calendar events, materials library, and high-level summaries with minor privacy protection enabled.
              </div>
            </div>
          </div>
        </div>

        {/* Database & Demo Management */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Database className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">Database & Practice State</h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="font-semibold text-slate-800">
                Current Status:{' '}
                <span className={isDemoDataActive ? 'text-sky-700 font-bold' : 'text-slate-600'}>
                  {isDemoDataActive ? 'Practice Demo Mode (Sample Data Loaded)' : 'Pristine Live Database'}
                </span>
              </div>
              <p className="text-slate-500 max-w-md">
                You can toggle between a pristine empty database ready for community entry and practice sample data to test reports and charts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!isDemoDataActive ? (
                <button
                  type="button"
                  onClick={onLoadPracticeData}
                  className="px-3.5 py-1.5 text-xs font-semibold text-sky-900 bg-sky-50 border border-sky-300 rounded hover:bg-sky-100 transition-colors"
                >
                  Load Practice Data
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onResetEmptyData}
                  className="px-3.5 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Clean Empty State</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Save button */}
        {canConfigure && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-sky-400" />
              <span>Save Settings</span>
            </button>
          </div>
        )}
      </form>

      <BahaiDivider />
    </div>
  );
};
