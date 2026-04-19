const Task = require('../models/Task');
const githubService = require('./githubService');
const newsService = require('./newsService');

/**
 * Business logic for task management
 */
class TaskService {
    async createTask(userId, taskData) {
        let { title, description, status, priority, githubIssuePath } = taskData;
        
        let finalStatus = status || 'todo';
        let finalPriority = priority || 'medium';
        let finalTitle = title.trim();

        // GitHub Sync Logic
        if (githubIssuePath) {
            const issueData = await githubService.fetchIssueData(githubIssuePath);
            if (issueData) {
                if (issueData.state === 'closed') finalStatus = 'done';
                if (issueData.labels.some(l => ['bug', 'urgent', 'critical', 'error'].some(kw => l.includes(kw)))) {
                    finalPriority = 'high';
                }
                if (!title || finalTitle === 'New Task' || finalTitle === '') {
                    finalTitle = issueData.title;
                }
            }
        }

        // News Logic
        const relatedNews = finalTitle ? await newsService.fetchRelatedNews(finalTitle) : [];

        const task = new Task({
            user: userId,
            title: finalTitle,
            description,
            status: finalStatus,
            priority: finalPriority,
            githubIssuePath,
            relatedNews
        });

        return await task.save();
    }

    async getTasks(userId, filters = {}) {
        const query = { user: userId };
        if (filters.status) query.status = filters.status;

        const tasks = await Task.find(query).sort({ createdAt: -1 });

        // Enrich with GitHub data
        return await Promise.all(
            tasks.map(async (task) => {
                let githubData = null;
                if (task.githubIssuePath) {
                    githubData = await githubService.fetchIssueData(task.githubIssuePath);
                }
                return { ...task.toObject(), githubData };
            })
        );
    }

    async getTaskById(taskId, userId) {
        const task = await Task.findById(taskId);
        if (!task) return null;
        if (task.user.toString() !== userId) throw new Error('Not authorized');

        let githubData = null;
        if (task.githubIssuePath) {
            githubData = await githubService.fetchIssueData(task.githubIssuePath);
        }

        return { ...task.toObject(), githubData };
    }

    async updateTask(taskId, userId, updateData) {
        let task = await Task.findById(taskId);
        if (!task) return null;
        if (task.user.toString() !== userId) throw new Error('Not authorized');

        const { title, description, status, priority, githubIssuePath } = updateData;

        let finalStatus = status || task.status;
        let finalPriority = priority || task.priority;
        let finalTitle = title !== undefined ? title.trim() : task.title;
        let finalGithubPath = githubIssuePath !== undefined ? githubIssuePath : task.githubIssuePath;

        // GitHub Sync logic for updates
        if (finalGithubPath) {
            const issueData = await githubService.fetchIssueData(finalGithubPath);
            if (issueData) {
                if (issueData.state === 'closed') finalStatus = 'done';
                if (issueData.labels.some(l => ['bug', 'urgent', 'critical', 'error'].some(kw => l.includes(kw)))) {
                    finalPriority = 'high';
                }
            }
        }

        // News logic for updates
        let relatedNewsUpdate = task.relatedNews;
        if (title !== undefined && title.trim() !== task.title) {
            relatedNewsUpdate = await newsService.fetchRelatedNews(finalTitle);
        }

        task = await Task.findByIdAndUpdate(
            taskId,
            { $set: { 
                title: finalTitle, 
                description, 
                status: finalStatus, 
                priority: finalPriority, 
                githubIssuePath: finalGithubPath,
                relatedNews: relatedNewsUpdate
            } },
            { new: true }
        );

        let githubData = null;
        if (task.githubIssuePath) {
            githubData = await githubService.fetchIssueData(task.githubIssuePath);
        }

        return { ...task.toObject(), githubData };
    }

    async deleteTask(taskId, userId) {
        const task = await Task.findById(taskId);
        if (!task) return null;
        if (task.user.toString() !== userId) throw new Error('Not authorized');

        await task.deleteOne();
        return true;
    }
}

module.exports = new TaskService();
