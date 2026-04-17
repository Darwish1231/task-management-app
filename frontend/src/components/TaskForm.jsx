import React, { useState, useEffect } from 'react';

const TaskForm = ({ onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        githubIssuePath: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                status: initialData.status || 'todo',
                priority: initialData.priority || 'medium',
                githubIssuePath: initialData.githubIssuePath || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData, initialData?._id);
    };

    return (
        <div className="task-form-overlay animate-fade-in">
            <div className="glass-panel modal-content">
                <div className="mobile-handle" style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', margin: '0 auto 1.5rem', display: 'none' }}></div>
                <h2 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: '700' }}>
                    {initialData ? 'Update Task' : 'Create New Task'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Task Title</label>
                        <input 
                            name="title"
                            type="text" 
                            className="input-field" 
                            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="What needs to be done?"
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Description</label>
                        <textarea 
                            name="description"
                            className="input-field" 
                            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Add details..."
                        />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Status</label>
                            <select 
                                name="status" 
                                className="input-field" 
                                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                                value={formData.status} 
                                onChange={handleChange}
                            >
                                <option value="todo">To Do</option>
                                <option value="doing">Doing</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Priority</label>
                            <select 
                                name="priority" 
                                className="input-field" 
                                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                                value={formData.priority} 
                                onChange={handleChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>GitHub Issue Path</label>
                        <input 
                            name="githubIssuePath"
                            type="text" 
                            className="input-field" 
                            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                            value={formData.githubIssuePath}
                            onChange={handleChange}
                            placeholder="org/repo/issues/123"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                        <button type="button" className="btn" onClick={onClose} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '1rem' }}>
                            {initialData ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
