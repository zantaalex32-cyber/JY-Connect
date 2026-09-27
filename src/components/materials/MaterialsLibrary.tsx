import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ShieldCheck,
  Plus,
  Filter,
  CheckCircle,
  FileText,
  Music,
  Palette,
  Sparkles,
  Users
} from 'lucide-react';
import {
  Material,
  MaterialType,
  SourceTrustLevel,
  UserRole
} from '../../types';
import { BahaiNinePointedStar } from '../common/BahaiArt';

interface MaterialsLibraryProps {
  materials: Material[];
  currentRole: UserRole;
  onSaveMaterial: (mat: Material) => void;
  onToggleBookmark: (materialId: string) => void;
}

export const MaterialsLibrary: React.FC<MaterialsLibraryProps> = ({
  materials,
  currentRole,
  onSaveMaterial,
  onToggleBookmark
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [trustFilter, setTrustFilter] = useState<'all' | SourceTrustLevel>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const canAdd = currentRole === 'admin' || currentRole === 'coordinator' || currentRole === 'animator';

  // Form State for adding a new material
  const [formData, setFormData] = useState<Partial<Material>>({
    title: '',
    authorOrg: '',
    description: '',
    materialType: 'text',
    subjectCategory: 'Junior Youth texts',
    source: '',
    sourceUrl: '',
    publicationInfo: '',
    language: 'English',
    ageRange: '11-15 years',
    trustLevel: 'user_uploaded',
    isOfficialSource: false
  });

  const categories = [
    'All Categories',
    'Junior Youth texts',
    'Study materials',
    'Animator resources',
    'Training materials',
    'Stories',
    'Quotations',
    'Activities',
    'Arts activities',
    'Games',
    'Service activities',
    'Reflection materials',
    'Discussion resources',
    'Camp resources',
    'Music and songs',
    'Parent resources',
    'Community-building resources'
  ];

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.authorOrg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subjectCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.language.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      selectedCategory === 'All Categories' ||
      m.subjectCategory.toLowerCase() === selectedCategory.toLowerCase();

    const matchesTrust = trustFilter === 'all' || m.trustLevel === trustFilter;
    const matchesBookmark = !onlyBookmarked || m.bookmarked;

    return matchesSearch && matchesCategory && matchesTrust && matchesBookmark;
  });

  const handleOpenAddModal = () => {
    setFormData({
      id: 'mat-' + Date.now(),
      title: '',
      authorOrg: '',
      description: '',
      materialType: 'study_material',
      subjectCategory: 'Study materials',
      source: 'Local Cluster Resource',
      sourceUrl: '',
      publicationInfo: '',
      language: 'English',
      ageRange: '11-15 years',
      trustLevel: 'user_uploaded',
      isOfficialSource: false
    });
    setIsAdding(true);
  };

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    const newMat: Material = {
      id: formData.id || 'mat-' + Date.now(),
      title: formData.title.trim(),
      authorOrg: formData.authorOrg || 'Bahá’í Community Education Group',
      description: formData.description || '',
      materialType: formData.materialType || 'study_material',
      subjectCategory: formData.subjectCategory || 'Study materials',
      source: formData.source || 'User Uploaded',
      sourceUrl: formData.sourceUrl || '',
      publicationInfo: formData.publicationInfo || '',
      language: formData.language || 'English',
      dateAdded: new Date().toISOString().split('T')[0],
      trustLevel: formData.trustLevel || 'user_uploaded',
      isOfficialSource: formData.trustLevel === 'official',
      bookmarked: false,
      ageRange: formData.ageRange || '11-15 years'
    };

    onSaveMaterial(newMat);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
              Junior Youth Materials Library
            </h1>
            <BahaiNinePointedStar size={16} color="#0284c7" />
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Publicly available Junior Youth texts, Ruhi Institute publications, discussion resources, and animator guides.
          </p>
        </div>

        {canAdd && (
          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>Add Resource / Material</span>
          </button>
        )}
      </div>

      {/* Trust & Source Classification Info Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 text-xs text-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            <strong>Source Integrity:</strong> All materials clearly specify official Bahá’í institution provenance (e.g. Ruhi Institute), reputable community sources, or local educator uploads. Links point to original legal distribution sources.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors flex items-center gap-1.5 ${
              onlyBookmarked
                ? 'bg-sky-100 text-sky-900 border-sky-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-sky-600" />
            <span>Saved Bookmarks Only</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, author, topic, language, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
            />
          </div>

          {/* Trust Level Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Source Trust:</span>
            <select
              value={trustFilter}
              onChange={(e) => setTrustFilter(e.target.value as any)}
              className="px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">All Sources</option>
              <option value="official">Official Bahá’í Sources (Ruhi)</option>
              <option value="reputable">Other Reputable Sources</option>
              <option value="user_uploaded">User / Local Uploads</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills (clean segmented button row, no pills) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs text-slate-600">
          {categories.slice(0, 9).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded whitespace-nowrap transition-colors border ${
                selectedCategory.toLowerCase() === cat.toLowerCase() ||
                (cat === 'All Categories' && selectedCategory === 'all')
                  ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">No materials matched your search</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, removing filters, or adding a new community text.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((mat) => {
            const isBookmarked = Boolean(mat.bookmarked);

            return (
              <div
                key={mat.id}
                className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-sky-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {/* Trust badge */}
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                            mat.trustLevel === 'official'
                              ? 'bg-sky-100 text-sky-900 border-sky-300'
                              : mat.trustLevel === 'reputable'
                              ? 'bg-indigo-50 text-indigo-900 border-indigo-200'
                              : 'bg-amber-50 text-amber-900 border-amber-200'
                          }`}
                        >
                          {mat.trustLevel === 'official'
                            ? 'Official Bahá’í Source'
                            : mat.trustLevel === 'reputable'
                            ? 'Reputable Community'
                            : 'Community Shared'}
                        </span>
                        {mat.ageRange && (
                          <span className="text-[10px] text-slate-600 font-semibold bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                            {mat.ageRange}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {mat.title}
                      </h3>
                      <div className="text-[11px] text-slate-600 mt-0.5 font-medium">
                        {mat.authorOrg}
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleBookmark(mat.id)}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark this material'}
                      className={`p-1.5 rounded transition-colors ${
                        isBookmarked ? 'text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {mat.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-medium">Category:</span>
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                        mat.subjectCategory === 'Junior Youth texts'
                          ? 'bg-sky-100 text-sky-800 border-sky-300'
                          : mat.subjectCategory === 'Study materials'
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                          : mat.subjectCategory === 'Stories' || mat.subjectCategory === 'Quotations'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : mat.subjectCategory === 'Arts activities' || mat.subjectCategory === 'Music and songs'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : mat.subjectCategory === 'Service activities'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : mat.subjectCategory === 'Games' || mat.subjectCategory === 'Camp resources'
                          ? 'bg-teal-100 text-teal-800 border-teal-300'
                          : 'bg-purple-100 text-purple-800 border-purple-300'
                      }`}>
                        {mat.subjectCategory}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 font-medium">Language: </span>
                      <span className="text-slate-800 font-semibold">{mat.language}</span>
                    </div>
                    {mat.publicationInfo && (
                      <div className="truncate">
                        <span className="text-slate-400">Publisher: </span>
                        <span>{mat.publicationInfo}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedMaterial(mat)}
                    className="text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded border border-sky-200 transition-colors"
                  >
                    View Details & Study
                  </button>

                  {mat.sourceUrl && (
                    <a
                      href={mat.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1 transition-colors"
                    >
                      <span>Official Link</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Material Detailed Modal */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
                  {selectedMaterial.subjectCategory}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedMaterial.title}
                </h2>
                <div className="text-xs text-slate-500">{selectedMaterial.authorOrg}</div>
              </div>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                <div className="font-semibold text-slate-800">Source & Distribution Info</div>
                <div className="text-slate-700">Source: {selectedMaterial.source}</div>
                {selectedMaterial.publicationInfo && (
                  <div className="text-slate-700">Publisher: {selectedMaterial.publicationInfo}</div>
                )}
                <div className="text-slate-700">Language: {selectedMaterial.language}</div>
                <div className="text-slate-700">Target Age: {selectedMaterial.ageRange || '11-15 years'}</div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Educational Synopsis</h4>
                <p className="text-slate-700 mt-1 leading-relaxed bg-white p-3 border border-slate-200 rounded">
                  {selectedMaterial.description}
                </p>
              </div>

              <div className="bg-sky-50 border border-sky-100 p-2.5 rounded text-[11px] text-sky-900 leading-relaxed">
                <strong>Copyright & Attribution:</strong> This platform catalogues official curriculum citations and provides reference links. Full publications are held and distributed through authorized institutions such as the Ruhi Institute and Bahá’í publishing trusts.
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              {selectedMaterial.sourceUrl ? (
                <a
                  href={selectedMaterial.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <span>Open Institutional Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-xs text-slate-400 italic">No external link registered</span>
              )}

              <button
                onClick={() => setSelectedMaterial(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Material Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Register Junior Youth Educational Resource
              </h2>
              <button
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Walking the Straight Path"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Author / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ruhi Institute"
                    value={formData.authorOrg || ''}
                    onChange={(e) => setFormData({ ...formData, authorOrg: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Category</label>
                  <select
                    value={formData.subjectCategory || 'Junior Youth texts'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subjectCategory: e.target.value,
                        materialType: e.target.value.toLowerCase().includes('text')
                          ? 'text'
                          : 'study_material'
                      })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    {categories.slice(1).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Source Provenance
                  </label>
                  <select
                    value={formData.trustLevel || 'user_uploaded'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trustLevel: e.target.value as SourceTrustLevel
                      })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    <option value="official">Official Bahá’í Institution</option>
                    <option value="reputable">Reputable Community Source</option>
                    <option value="user_uploaded">User / Local Animator Upload</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Language</label>
                  <input
                    type="text"
                    placeholder="e.g. English, French, Persian..."
                    value={formData.language || 'English'}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Source Link / Official URL
                </label>
                <input
                  type="url"
                  placeholder="https://www.ruhi.org/... or official bookstore link"
                  value={formData.sourceUrl || ''}
                  onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Description & Synopsis
                </label>
                <textarea
                  rows={3}
                  placeholder="Overview of characters, themes, and moral concepts..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800"
                >
                  Register Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
