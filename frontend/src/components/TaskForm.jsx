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
                <h2 style={{ marginBottom: '1.5rem' }}>{initialData ? 'Edit Task' : 'New Task'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Task Title *</label>
                        <input 
                            name="title"
                            type="text" 
                            className="input-field" 
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Fix Navigation Bug"
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea 
                            name="description"
                            className="input-field" 
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Provide task details..."
                        />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Status</label>
                            <select 
                                name="status" 
                                className="input-field" 
                                value={formData.status} 
                                onChange={handleChange}
                            >
                                <option value="todo">To Do</option>
                                <option value="doing">Doing</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Priority</label>
                            <select 
                                name="priority" 
                                className="input-field" 
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
                        <label>GitHub Issue (Optional)</label>
                        <input 
                            name="githubIssuePath"
                            type="text" 
                            className="input-field" 
                            value={formData.githubIssuePath}
                            onChange={handleChange}
                            placeholder="e.g., facebook/react/issues/28735"
                        />
                        <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem', fontSize: '0.8rem' }}>
                            Link an issue to automatically sync task status & priority based on real-world issue states.
                        </small>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button type="button" className="btn" onClick={onClose} style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                            {initialData ? 'Update Task' : 'Save Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
