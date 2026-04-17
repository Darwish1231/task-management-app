import React from 'react';
import { Trash2, Edit3, Code, ExternalLink, Activity, MessageSquare, CheckCircle, Circle, Newspaper } from 'lucide-react';

const TaskCard = ({ task, onStatusChange, onDelete, onEdit }) => {
    
    // Cycle logic: todo -> doing -> done -> todo
    const cycleStatus = () => {
        if (task.status === 'todo') return 'doing';
        if (task.status === 'doing') return 'done';
        return 'todo';
    };

    return (
        <div className="glass-panel task-card animate-fade-in">
            <div className="task-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <button 
                            className={`task-status status-${task.status}`}
                            onClick={() => onStatusChange(task._id, cycleStatus())}
                            title="Click to cycle status"
                        >
                            {task.status}
                        </button>
                        {task.priority && (
                            <span className={`priority-badge priority-${task.priority}`}>
                                <Activity size={12} style={{marginRight: 4}} />
                                {task.priority}
                            </span>
                        )}
                    </div>
                    <h3 className="task-title">{task.title}</h3>
                    
                </div>
                <div className="task-actions">
                    <button className="icon-btn" onClick={() => onEdit(task)}><Edit3 size={18} /></button>
                    <button className="icon-btn delete" onClick={() => onDelete(task._id)}><Trash2 size={18} /></button>
                </div>
            </div>
            
            {task.description && (
                <p className="task-desc">{task.description}</p>
            )}

            {task.relatedNews && task.relatedNews.length > 0 && (
                <div className="news-widget">
                    <div className="news-widget-header">
                        <Newspaper size={16} /> Related News
                    </div>
                    <ul className="news-list">
                        {task.relatedNews.map((news, idx) => (
                            <li key={idx}>
                                <a href={news.url} target="_blank" rel="noopener noreferrer">
                                   {news.headline}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {task.githubIssuePath && task.githubData ? (
                <div className="github-widget">
                    <div className="github-widget-header">
                        <Code size={16} /> 
                        Linked GitHub Issue
                        <a href={task.githubData.url} target="_blank" rel="noopener noreferrer" className="link-button" style={{marginLeft: 'auto'}}>
                            <ExternalLink size={14} /> Open
                        </a>
                    </div>
                    <div className="github-stats">
                        <span className="github-stat" style={{ color: task.githubData.state === 'closed' ? 'var(--success)' : 'var(--warning)' }}>
                            {task.githubData.state === 'closed' ? <CheckCircle size={14} /> : <Circle size={14} />} 
                            {task.githubData.state}
                        </span>
                        <span className="github-stat" title="Comments"><MessageSquare size={14} /> {task.githubData.comments}</span>
                        {task.githubData.labels?.length > 0 && (
                            <span className="github-stat" style={{marginLeft: 'auto'}}>
                                {task.githubData.labels.slice(0, 2).map((l, i) => (
                                    <span key={i} style={{ padding: '0.1rem 0.4rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, marginRight: 4 }}>
                                        {l}
                                    </span>
                                ))}
                            </span>
                        )}
                    </div>
                </div>
            ) : task.githubIssuePath && !task.githubData ? (
                <div className="github-widget" style={{ opacity: 0.7 }}>
                    <div className="github-widget-header">
                        <Code size={16} /> GitHub Issue
                    </div>
                    <div className="github-stats">
                        <em>Failed to load or parsing Issue data...</em>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default TaskCard;
