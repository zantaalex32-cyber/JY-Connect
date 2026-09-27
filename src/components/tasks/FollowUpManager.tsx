import React, { useState } from 'react';
import {
  FollowUpTask,
  FollowUpStatus,
  FollowUpPriority,
  FollowUpConnectedType,
  UserRole,
  JuniorYouthGroup,
  JuniorYouthParticipant,
  Animator
} from '../../types';
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Plus,
  Filter,
  CheckCircle2,
  Calendar,
  User,
  Trash2,
  Edit2,
  Link as LinkIcon,
  Search
} from 'lucide-react';

interface FollowUpManagerProps {
  tasks: FollowUpTask[];
  groups: JuniorYouthGroup[];
  participants: JuniorYouthParticipant[];
  animators: Animator[];
  currentRole: UserRole;
  onSaveTask: (task: FollowUpTask) => void;
  onDeleteTask: (taskId: string) => void;
}

export function FollowUpManager({
  tasks,
  groups,
  participants,
  animators,
  currentRole,
  onSaveTask,
  onDeleteTask
}: FollowUpManagerProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<FollowUpTask | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    assignedTo: string;
    dueDate: string;
    priority: FollowUpPriority;
    status: FollowUpStatus;
    connectedType: FollowUpConnectedType;
    connectedId: string;
    notes: string;
  }>({
    title: '',
    assignedTo: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    status: 'not_started',
    connectedType: 'general',
    connectedId: '',
    notes: ''
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchAssignee = t.assignedTo.toLowerCase().includes(q);
      const matchConnected = t.connectedName?.toLowerCase().includes(q);
      const matchNotes = t.notes.toLowerCase().includes(q);
      if (!matchTitle && !matchAssignee && !matchConnected && !matchNotes) return false;
    }
    return true;
  });

  const overdueCount = tasks.filter(
    (t) => t.status !== 'completed' && t.status !== 'cancelled' && t.dueDate < todayStr
  ).length;

  const handleOpenAdd = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      assignedTo: animators[0]?.name || '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      status: 'not_started',
      connectedType: 'general',
      connectedId: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: FollowUpTask) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      assignedTo: task.assignedTo,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      connectedType: task.connectedType,
      connectedId: task.connectedId || '',
      notes: task.notes
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = (task: FollowUpTask) => {
    const newStatus: FollowUpStatus = task.status === 'completed' ? 'not_started' : 'completed';
    onSaveTask({
      ...task,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    let connectedName = '';
    if (formData.connectedType === 'group') {
      connectedName = groups.find((g) => g.id === formData.connectedId)?.name || 'Group';
    } else if (formData.connectedType === 'youth') {
      connectedName = participants.find((p) => p.id === formData.connectedId)?.name || 'Junior Youth';
    } else if (formData.connectedType === 'animator') {
      connectedName = animators.find((a) => a.id === formData.connectedId)?.name || 'Animator';
    }

    const newTask: FollowUpTask = {
      id: editingTask ? editingTask.id : `task-${Date.now()}`,
      title: formData.title.trim(),
      assignedTo: formData.assignedTo.trim(),
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: formData.status,
      connectedType: formData.connectedType,
      connectedId: formData.connectedId,
      connectedName: connectedName || undefined,
      notes: formData.notes.trim(),
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      completedAt: formData.status === 'completed' ? new Date().toISOString() : undefined
    };

    onSaveTask(newTask);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-sky-600" />
            <span>Universal Follow-up & Task Management</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Track commitments connected to meetings, junior youth, animators, camps, and family accompaniment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {overdueCount > 0 && (
            <div className="px-3 py-1.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{overdueCount} Overdue Follow-up{overdueCount > 1 ? 's' : ''}</span>
            </div>
          )}

          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Follow-up</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search follow-up tasks, assignees, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-sky-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center mx-auto text-sky-600 mb-3">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No follow-up tasks found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Create tasks to keep track of home visits, material preparation, parent consultations, and camp logistics.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-3 py-1.5 bg-sky-600 text-white rounded text-xs font-bold hover:bg-sky-700 transition-colors"
          >
            + Create your first follow-up
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 shadow-xs">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isCancelled = task.status === 'cancelled';
            const isOverdue = !isCompleted && !isCancelled && task.dueDate < todayStr;

            return (
              <div
                key={task.id}
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  isCompleted ? 'bg-slate-50/60 opacity-80' : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleStatus(task)}
                    className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-sky-500 text-transparent'
                    }`}
                    title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`text-sm font-bold ${
                          isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h3>

                      {/* Priority Tag */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${
                          task.priority === 'high'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : task.priority === 'medium'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {task.priority}
                      </span>

                      {/* Status Tag */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${
                          task.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : task.status === 'in_progress'
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : task.status === 'cancelled'
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {task.status.replace('_', ' ')}
                      </span>

                      {/* Overdue Warning */}
                      {isOverdue && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Overdue</span>
                        </span>
                      )}
                    </div>

                    {/* Metadata & Assignee */}
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Responsible: <strong className="text-slate-800">{task.assignedTo || 'Unassigned'}</strong></span>
                      </span>

                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Due: <strong className={isOverdue ? 'text-rose-700' : 'text-slate-800'}>{task.dueDate}</strong></span>
                      </span>

                      {task.connectedName && (
                        <span className="flex items-center gap-1 bg-sky-50 text-sky-900 border border-sky-200 px-2 py-0.2 rounded text-[11px] font-medium">
                          <LinkIcon className="w-3 h-3 text-sky-600" />
                          <span className="capitalize">{task.connectedType}:</span>
                          <strong>{task.connectedName}</strong>
                        </span>
                      )}
                    </div>

                    {task.notes && (
                      <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded border border-slate-100">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(task)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
                    title="Edit Task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                    title="Delete Task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {editingTask ? 'Edit Follow-up Task' : 'Create New Follow-up Task'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Task Title / Commitment *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home visit to discuss camp, prepare calligraphy materials"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Person Responsible *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Animator or coordinator name"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as FollowUpPriority })}
                    className="w-full p-2 border border-slate-300 rounded text-slate-800 bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as FollowUpStatus })}
                    className="w-full p-2 border border-slate-300 rounded text-slate-800 bg-white"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Connected Entity Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Connected Activity / Entity
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={formData.connectedType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        connectedType: e.target.value as FollowUpConnectedType,
                        connectedId: ''
                      })
                    }
                    className="p-2 border border-slate-300 rounded text-slate-800 bg-white"
                  >
                    <option value="general">General Follow-up</option>
                    <option value="group">Junior Youth Group</option>
                    <option value="youth">Junior Youth Participant</option>
                    <option value="family">Family / Parent</option>
                    <option value="animator">Animator</option>
                    <option value="meeting">Meeting</option>
                    <option value="event">Camp / Gathering</option>
                  </select>

                  {formData.connectedType === 'group' && (
                    <select
                      value={formData.connectedId}
                      onChange={(e) => setFormData({ ...formData, connectedId: e.target.value })}
                      className="p-2 border border-slate-300 rounded text-slate-800 bg-white"
                    >
                      <option value="">Select Group...</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  )}

                  {formData.connectedType === 'youth' && (
                    <select
                      value={formData.connectedId}
                      onChange={(e) => setFormData({ ...formData, connectedId: e.target.value })}
                      className="p-2 border border-slate-300 rounded text-slate-800 bg-white"
                    >
                      <option value="">Select Junior Youth...</option>
                      {participants.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  )}

                  {formData.connectedType === 'animator' && (
                    <select
                      value={formData.connectedId}
                      onChange={(e) => setFormData({ ...formData, connectedId: e.target.value })}
                      className="p-2 border border-slate-300 rounded text-slate-800 bg-white"
                    >
                      <option value="">Select Animator...</option>
                      {animators.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Additional Notes</label>
                <textarea
                  rows={3}
                  placeholder="Specific details, contact info, preparation items..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold transition-colors shadow-xs"
                >
                  {editingTask ? 'Save Changes' : 'Create Follow-up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
