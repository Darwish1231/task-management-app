import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Plus } from 'lucide-react';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            const url = filterStatus === 'all' ? '/tasks' : `/tasks?status=${filterStatus}`;
            const res = await api.get(url);
            setTasks(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks', error);
            setError('Failed to fetch tasks. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [filterStatus]);

    const handleOpenForm = (task = null) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingTask(null);
    };

    const handleSubmitTask = async (taskData, id) => {
        try {
            if (id) {
                // Determine existing status to preserve it
                const existingStatus = tasks.find(t => t._id === id)?.status || 'pending';
                await api.put(`/tasks/${id}`, { ...taskData, status: existingStatus });
            } else {
                await api.post('/tasks', taskData);
            }
            fetchTasks();
            handleCloseForm();
        } catch (error) {
            console.error('Error saving task', error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const taskToUpdate = tasks.find(t => t._id === id);
            if (!taskToUpdate) return;
            
            // Optimistic UI update
            setTasks(tasks.map(t => t._id === id ? { ...t, status: newStatus } : t));
            
            await api.put(`/tasks/${id}`, { ...taskToUpdate, status: newStatus });
        } catch (error) {
            console.error('Error updating status', error);
            // Revert on error
            fetchTasks();
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (error) {
            console.error('Error deleting task', error);
        }
    };

    return (
        <>
        <div className="animate-fade-in">
            <div className="dashboard-header">
                <div>
                    <h2>My Tasks</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Organize your work efficiently</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="scroll-tabs" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.25rem', borderRadius: '8px' }}>
                        {['all', 'todo', 'doing', 'done'].map(status => (
                            <button 
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className="btn"
                                style={{ 
                                    padding: '0.4rem 0.8rem', 
                                    fontSize: '0.8rem',
                                    whiteSpace: 'nowrap',
                                    textTransform: 'capitalize',
                                    background: filterStatus === status ? 'var(--card-border)' : 'transparent',
                                    color: filterStatus === status ? 'white' : 'var(--text-secondary)'
                                }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    <button className="btn btn-primary fab-desktop-btn" onClick={() => handleOpenForm()}>
                        <Plus size={18} /> Add Task
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ background: 'rgba(255, 100, 100, 0.1)', border: '1px solid rgba(255, 100, 100, 0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', color: '#ff8888', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading tasks...</div>
            ) : tasks.length === 0 ? (
                <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>No tasks found</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Get started by creating your first task.</p>
                </div>
            ) : (
                <div className="task-grid">
                    {tasks.map(task => (
                        <TaskCard 
                            key={task._id} 
                            task={task} 
                            onStatusChange={handleStatusChange}
                            onDelete={handleDeleteTask}
                            onEdit={() => handleOpenForm(task)}
                        />
                    ))}
                </div>
            )}

            {isFormOpen && (
                <TaskForm 
                    initialData={editingTask} 
                    onClose={handleCloseForm} 
                    onSubmit={handleSubmitTask} 
                />
            )}
        </div>
        <button className="fab" onClick={() => handleOpenForm()} title="Add Task" style={{ position: 'fixed', zIndex: 9999 }}>
            <Plus size={32} />
        </button>
        </>
    );
};

export default Dashboard;
