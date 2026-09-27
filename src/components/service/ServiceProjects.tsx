import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Users,
  Edit2,
  Trash2,
  CheckSquare,
  Square,
  FileText
} from 'lucide-react';
import {
  ServiceProject,
  JuniorYouthGroup,
  JuniorYouthParticipant,
  ServiceProjectStatus,
  UserRole
} from '../../types';
import { BahaiNinePointedStar } from '../common/BahaiArt';

interface ServiceProjectsProps {
  serviceProjects: ServiceProject[];
  groups: JuniorYouthGroup[];
  participants: JuniorYouthParticipant[];
  currentRole: UserRole;
  onSaveServiceProject: (project: ServiceProject) => void;
  onDeleteServiceProject: (projectId: string) => void;
}

export const ServiceProjects: React.FC<ServiceProjectsProps> = ({
  serviceProjects,
  groups,
  participants,
  currentRole,
  onSaveServiceProject,
  onDeleteServiceProject
}) => {
  const [selectedProject, setSelectedProject] = useState<ServiceProject | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | ServiceProjectStatus>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

  const canEdit = currentRole === 'admin' || currentRole === 'coordinator' || currentRole === 'animator';

  // Form State
  const [formData, setFormData] = useState<Partial<ServiceProject>>({
    projectName: '',
    description: '',
    groupId: groups[0]?.id || '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    participantIds: [],
    goals: '',
    tasks: [],
    assignedResponsibilities: '',
    progressStatus: 'planned',
    results: '',
    reflection: '',
    followUp: ''
  });

  const filteredProjects = serviceProjects.filter(
    (p) => statusFilter === 'all' || p.progressStatus === statusFilter
  );

  const handleOpenCreateModal = () => {
    setFormData({
      id: 'proj-' + Date.now(),
      projectName: '',
      description: '',
      groupId: groups[0]?.id || '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      participantIds: [],
      goals: '',
      tasks: [
        { id: 't-1', title: 'Consult with neighborhood residents / authorities', assignedTo: '', completed: false },
        { id: 't-2', title: 'Gather project materials & tools', assignedTo: '', completed: false }
      ],
      assignedResponsibilities: '',
      progressStatus: 'planned',
      results: '',
      reflection: '',
      followUp: ''
    });
    setIsEditing(true);
    setSelectedProject(null);
  };

  const handleOpenEditModal = (p: ServiceProject) => {
    setFormData({ ...p });
    setIsEditing(true);
    setSelectedProject(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectName?.trim()) return;

    const projectToSave: ServiceProject = {
      id: formData.id || 'proj-' + Date.now(),
      projectName: formData.projectName.trim(),
      description: formData.description || '',
      groupId: formData.groupId || '',
      location: formData.location || '',
      date: formData.date || new Date().toISOString().split('T')[0],
      participantIds: formData.participantIds || [],
      goals: formData.goals || '',
      tasks: formData.tasks || [],
      assignedResponsibilities: formData.assignedResponsibilities || '',
      progressStatus: formData.progressStatus || 'planned',
      results: formData.results || '',
      reflection: formData.reflection || '',
      followUp: formData.followUp || ''
    };

    onSaveServiceProject(projectToSave);
    setIsEditing(false);
  };

  const handleToggleTask = (project: ServiceProject, taskId: string) => {
    const updatedTasks = project.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const updatedProject = { ...project, tasks: updatedTasks };
    onSaveServiceProject(updatedProject);
    if (selectedProject?.id === project.id) {
      setSelectedProject(updatedProject);
    }
  };

  const handleAddTaskToSelected = (project: ServiceProject) => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: 'task-' + Date.now(),
      title: newTaskTitle.trim(),
      assignedTo: newTaskAssignee.trim() || 'Youth Participant',
      completed: false
    };
    const updatedProject = {
      ...project,
      tasks: [...project.tasks, newTask]
    };
    onSaveServiceProject(updatedProject);
    setSelectedProject(updatedProject);
    setNewTaskTitle('');
    setNewTaskAssignee('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
              Community Service Projects
            </h1>
            <BahaiNinePointedStar size={16} color="#0284c7" />
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Empower youth to identify community needs, carry out environmental & educational service, and consult on results.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>Plan Service Project</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600 self-start">
        {(['all', 'planned', 'in_progress', 'completed'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1 rounded capitalize transition-colors ${
              statusFilter === st
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">No service projects found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {serviceProjects.length === 0
              ? 'Plan your first service project (e.g. neighborhood tree-planting, library story hours, or park cleanup).'
              : 'No service projects match your status filter.'}
          </p>
          {canEdit && serviceProjects.length === 0 && (
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
            >
              + Plan First Service Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((project) => {
            const grp = groups.find((g) => g.id === project.groupId);
            const completedCount = project.tasks.filter((t) => t.completed).length;

            return (
              <div
                key={project.id}
                className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-sky-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-950 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {grp ? grp.name : 'Community Youth Group'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                        {project.projectName}
                      </h3>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>{project.location || 'Location specified'}</span>
                        </span>
                        <span>·</span>
                        <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">{project.date}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${
                        project.progressStatus === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : project.progressStatus === 'in_progress'
                          ? 'bg-sky-100 text-sky-800 border-sky-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {project.progressStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tasks Checklist Preview */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1.5">
                      <span>Tasks Checklist</span>
                      <span className="font-mono bg-emerald-50 text-emerald-900 border border-emerald-200 px-1.5 py-0.5 rounded font-bold text-[10px]">
                        {completedCount}/{project.tasks.length} Completed
                      </span>
                    </div>
                    <div className="space-y-1">
                      {project.tasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          onClick={() => handleToggleTask(project, task.id)}
                          className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
                        >
                          {task.completed ? (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span className={task.completed ? 'line-through text-slate-400' : ''}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                      {project.tasks.length > 3 && (
                        <span className="text-[10px] text-slate-400 block pt-1">
                          + {project.tasks.length - 3} more tasks in details
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-900"
                  >
                    View Project Details & Reflection
                  </button>

                  <div className="flex items-center gap-1">
                    {canEdit && (
                      <button
                        onClick={() => handleOpenEditModal(project)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {canEdit && (
                      <button
                        onClick={() => onDeleteServiceProject(project.id)}
                        className="p-1.5 text-slate-400 hover:text-red-700 rounded"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-700">
                  Service Project Record
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedProject.projectName}
                </h2>
                <div className="text-xs text-slate-500">
                  Group: {groups.find((g) => g.id === selectedProject.groupId)?.name} · Status:{' '}
                  <strong className="capitalize text-slate-800">
                    {selectedProject.progressStatus.replace('_', ' ')}
                  </strong>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-semibold text-slate-900">Project Description & Goals</h4>
                <p className="text-slate-700 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                  {selectedProject.description || 'No description provided.'}
                </p>
                {selectedProject.goals && (
                  <p className="text-slate-600 mt-1 italic">
                    Goals: {selectedProject.goals}
                  </p>
                )}
              </div>

              {/* Tasks Checklist */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Project Tasks & Rota</h4>
                <div className="space-y-1.5 border border-slate-200 p-2 rounded">
                  {selectedProject.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(selectedProject, task.id)}
                      className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {task.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className={task.completed ? 'line-through text-slate-400' : 'text-slate-800'}>
                          {task.title}
                        </span>
                      </div>
                      {task.assignedTo && (
                        <span className="text-[11px] text-slate-500 font-medium">
                          {task.assignedTo}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {canEdit && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Add task title..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <input
                      type="text"
                      placeholder="Assign to..."
                      value={newTaskAssignee}
                      onChange={(e) => setNewTaskAssignee(e.target.value)}
                      className="w-32 px-2.5 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <button
                      onClick={() => handleAddTaskToSelected(selectedProject)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              {/* Results & Reflection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <h4 className="font-semibold text-slate-900">Outcomes / Results</h4>
                  <p className="text-slate-600 mt-1 bg-slate-50 p-2 rounded border border-slate-200 leading-relaxed">
                    {selectedProject.results || 'Pending project execution.'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Youth Reflection</h4>
                  <p className="text-slate-600 mt-1 bg-slate-50 p-2 rounded border border-slate-200 leading-relaxed">
                    {selectedProject.reflection || 'Pending reflection consultation.'}
                  </p>
                </div>
              </div>

              {selectedProject.followUp && (
                <div>
                  <h4 className="font-semibold text-slate-900">Follow-up Stewardship</h4>
                  <p className="text-slate-600 mt-1">{selectedProject.followUp}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan / Edit Service Project Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {formData.id && serviceProjects.some((p) => p.id === formData.id)
                  ? 'Edit Service Project'
                  : 'Plan Community Service Action'}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Project Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Neighborhood Tree Planting & Park Restoration"
                  value={formData.projectName || ''}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Group</label>
                  <select
                    value={formData.groupId || ''}
                    onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Status</label>
                  <select
                    value={formData.progressStatus || 'planned'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        progressStatus: e.target.value as ServiceProjectStatus
                      })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    <option value="planned">Planned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. North Ward Public Park"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Project Description
                </label>
                <textarea
                  rows={2}
                  placeholder="What need did the youth identify? How will they carry it out?"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Goals & Learning Objectives
                </label>
                <input
                  type="text"
                  placeholder="e.g. Learn environmental stewardship, foster neighborhood solidarity"
                  value={formData.goals || ''}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Results</label>
                  <textarea
                    rows={2}
                    placeholder="Quantitative and qualitative results..."
                    value={formData.results || ''}
                    onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Reflection</label>
                  <textarea
                    rows={2}
                    placeholder="What did the youth share after completing the action?"
                    value={formData.reflection || ''}
                    onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded hover:bg-slate-800"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
