import React, { useState } from 'react';
import { SupportResource, SupportCategory, UserRole } from '../../types';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Bookmark,
  Award,
  Sparkles,
  HelpCircle,
  Tent,
  HeartHandshake,
  MessageSquare,
  Palette,
  ExternalLink,
  Trash2
} from 'lucide-react';

interface AnimatorSupportCenterProps {
  resources: SupportResource[];
  currentRole: UserRole;
  onSaveResource: (res: SupportResource) => void;
  onDeleteResource: (id: string) => void;
}

export function AnimatorSupportCenter({
  resources,
  currentRole,
  onSaveResource,
  onDeleteResource
}: AnimatorSupportCenterProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<SupportResource | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<SupportCategory>('training');
  const [formDescription, setFormDescription] = useState('');
  const [formDetails, setFormDetails] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formIsOfficial, setFormIsOfficial] = useState(true);

  const categories: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: 'All Resources', icon: BookOpen },
    { id: 'training', label: 'Training (Ruhi Book 5)', icon: Award },
    { id: 'session_planning', label: 'Session Planning', icon: BookOpen },
    { id: 'discussion', label: 'Discussion Ideas', icon: MessageSquare },
    { id: 'arts', label: 'Arts & Creative Expression', icon: Palette },
    { id: 'games', label: 'Cooperative Games', icon: Sparkles },
    { id: 'service_ideas', label: 'Service Project Ideas', icon: HeartHandshake },
    { id: 'parent_engagement', label: 'Parent Engagement', icon: HeartHandshake },
    { id: 'camp_planning', label: 'Camp Planning', icon: Tent },
    { id: 'faq', label: 'Animator FAQs', icon: HelpCircle }
  ];

  const filtered = resources.filter((res) => {
    if (activeCategory !== 'all' && res.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchDesc = res.description.toLowerCase().includes(q);
      const matchDetails = res.details.toLowerCase().includes(q);
      const matchTags = res.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchDetails && !matchTags) return false;
    }
    return true;
  });

  const canEdit = currentRole === 'admin' || currentRole === 'coordinator';

  const handleOpenAdd = () => {
    setFormTitle('');
    setFormCategory('training');
    setFormDescription('');
    setFormDetails('');
    setFormAuthor(currentRole === 'coordinator' ? 'Cluster Coordination Team' : 'Ruhi Training Institute');
    setFormTags('');
    setFormUrl('');
    setFormIsOfficial(true);
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newRes: SupportResource = {
      id: `res-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      description: formDescription.trim(),
      details: formDetails.trim(),
      authorOrSource: formAuthor.trim() || 'Cluster Resource',
      tags: formTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      isOfficial: formIsOfficial,
      dateAdded: new Date().toISOString().split('T')[0],
      sourceUrl: formUrl.trim() || undefined
    };

    onSaveResource(newRes);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-600" />
            <span>Animator Support Center</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Empowering animators with Ruhi training guides, session templates, discussion questions, arts, cooperative games, and parent accompaniment tools.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {canEdit && (
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Support Resource</span>
            </button>
          )}
        </div>
      </div>

      {/* Official Bahá'í Guidance Banner */}
      <div className="bg-sky-50 border border-sky-200 rounded-lg p-3.5 text-xs text-sky-950 flex items-start gap-2.5">
        <Award className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Official Training Alignment:</strong> All materials and activities in this repository are aligned with the framework of the Ruhi Institute (specifically Book 5: <em>Releasing the Powers of Junior Youth</em>) and guidance from the Universal House of Justice regarding the spiritual empowerment of junior youth.
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search discussion starters, games, art ideas, Ruhi guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 text-xs text-slate-800 bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Full Category Chips */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400 text-[11px] font-semibold mr-1">Categories:</span>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              activeCategory === c.id
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-sky-300 transition-colors shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded border capitalize bg-sky-50 text-sky-900 border-sky-200">
                  {res.category.replace('_', ' ')}
                </span>
                {res.isOfficial && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded flex items-center gap-1">
                    <Award className="w-3 h-3 text-emerald-600" />
                    <span>Official</span>
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                {res.title}
              </h3>
              <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {res.authorOrSource}
              </div>

              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                {res.description}
              </p>

              {res.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {res.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedResource(res)}
                className="text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded border border-sky-200 transition-colors"
              >
                Read Guide
              </button>

              {canEdit && (
                <button
                  onClick={() => onDeleteResource(res.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  title="Delete Resource"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded border capitalize bg-sky-50 text-sky-900 border-sky-200">
                  {selectedResource.category.replace('_', ' ')}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1">
                  {selectedResource.title}
                </h2>
                <div className="text-xs text-slate-500 font-medium">
                  Source: {selectedResource.authorOrSource} · Added: {selectedResource.dateAdded}
                </div>
              </div>
              <button
                onClick={() => setSelectedResource(null)}
                className="text-slate-400 hover:text-slate-700 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="prose prose-sm max-w-none text-xs text-slate-800 space-y-3 whitespace-pre-wrap leading-relaxed">
              <p className="font-semibold text-slate-900 bg-slate-50 p-3 rounded border border-slate-200">
                {selectedResource.description}
              </p>
              <div>{selectedResource.details}</div>
            </div>

            {selectedResource.sourceUrl && (
              <div className="pt-3 border-t border-slate-100">
                <a
                  href={selectedResource.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1"
                >
                  <span>Visit original source document</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedResource(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Add Support Resource</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Resource title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as SupportCategory)}
                    className="w-full p-2 border border-slate-300 rounded text-slate-800 bg-white"
                  >
                    <option value="training">Training (Ruhi Book 5)</option>
                    <option value="session_planning">Session Planning</option>
                    <option value="discussion">Discussion Ideas</option>
                    <option value="arts">Arts & Creative Expression</option>
                    <option value="games">Cooperative Games</option>
                    <option value="service_ideas">Service Project Ideas</option>
                    <option value="parent_engagement">Parent Engagement</option>
                    <option value="camp_planning">Camp Planning</option>
                    <option value="faq">FAQ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Author / Source</label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Summary Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Short 2-3 sentence overview..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Detailed Content *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Step-by-step instructions, questions, rules, or reflection points..."
                  value={formDetails}
                  onChange={(e) => setFormDetails(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-sky-500 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Games, Icebreaker, Ruhi"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">External URL (optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isOfficial"
                  checked={formIsOfficial}
                  onChange={(e) => setFormIsOfficial(e.target.checked)}
                  className="rounded text-sky-600"
                />
                <label htmlFor="isOfficial" className="font-medium text-slate-700">
                  Mark as official institution-recommended resource
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold transition-colors shadow-xs"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
