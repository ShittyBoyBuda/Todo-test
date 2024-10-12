import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../redux/store";
import { fetchTasks } from "../redux/tasksSlice";
import TaskItem from './TaskItem';
import EditTaskModal from "./EditTaskModal";
import { User, Task } from "../redux/tasksSlice";
import axios from "axios";

interface GroupedTask {
    user: User;
    tasks: Task[];
}

const TaskList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
    const [isNewTaskModalOpen, setNewTaskModalOpen] = useState(false);
    const [subordinates, setSubordinates] = useState([]);
    const [isManager, setIsManager] = useState(false);
    const [viewMode, setViewMode] = useState<'date' | 'responsible' | 'all'>('all');
    
    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const userId = Number(localStorage.getItem('userId'));

    useEffect(() => {
        const fetchSubordinates = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('Токен отсутствует');
                    return;
                }
                const response = await axios.get(`https://todo-test-pgnd.onrender.com/user/subordinates/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (response.data) {
                    setSubordinates(response.data);
                    setIsManager(response.data.length > 0);
                } else {
                    console.warn('Подчиненные не найдены');
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (userId) {
            fetchSubordinates();
        }

    }, [userId]);

    const openNewTaskModal = () => {
        setNewTaskModalOpen(true);
    };

    const closeNewTaskModal = () => {
        setNewTaskModalOpen(false);
    };

    const sortByLastUpdate = (tasks: Task[]) => {
        return tasks.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    };

    const renderTasks = () => {
        const filteredTasks = tasks.filter(task => 
            task.responsibles.some(responsible => responsible.id === userId) ||
            task.creator.id === userId
        );
    
        const sortedTasks = sortByLastUpdate(filteredTasks);

        if (viewMode === 'date') {
            const { todayTasks, weekTasks, futureTasks } = groupByDate(sortedTasks);
            return (
                <div className="task-group">
                    <h2 className="task-group-title">Задачи на сегодня</h2>
                    {todayTasks.map(task => <TaskItem key={task.id} task={task} userId={userId} />)}
                    <h2 className="task-group-title">Задачи на неделю</h2>
                    {weekTasks.map(task => <TaskItem key={task.id} task={task} userId={userId} />)}
                    <h2 className="task-group-title">Будущие задачи</h2>
                    {futureTasks.map(task => <TaskItem key={task.id} task={task} userId={userId} />)}
                </div>
            );
        }
    
        if (viewMode === 'responsible') {
            const groupedByResponsible = groupByResponsible(sortedTasks);
            return groupedByResponsible.map(group => (
                <div key={group.user.id} className="task-group">
                    <h3 className="task-group-title">{`${group.user.firstName} ${group.user.lastName}`}</h3>
                    {group.tasks.map(task => <TaskItem key={task.id} task={task} userId={userId} />)}
                </div>
            ));
        }
    
        return sortedTasks.map(task => <TaskItem key={task.id} task={task} userId={userId} />);
    };
    
    const groupByDate = (tasksToGroup: Task[]) => {
        const today = new Date();
        const thisWeek = new Date();
        thisWeek.setDate(thisWeek.getDate() + 7);
    
        const todayTasks = tasksToGroup.filter(task => new Date(task.endDate).toDateString() === today.toDateString());
        const weekTasks = tasksToGroup.filter(task => new Date(task.endDate) > today && new Date(task.endDate) <= thisWeek);
        const futureTasks = tasksToGroup.filter(task => new Date(task.endDate) > thisWeek);
    
        return { todayTasks, weekTasks, futureTasks };
    };
    
    const groupByResponsible = (tasksToGroup: Task[]): GroupedTask[] => {
        const grouped = tasksToGroup.reduce((acc: Record<number, GroupedTask>, task: Task) => {
            task.responsibles.forEach((responsible: User) => {
                if (!acc[responsible.id]) {
                    acc[responsible.id] = { user: responsible, tasks: [] };
                }
                acc[responsible.id].tasks.push(task);
            });
            return acc;
        }, {});
        return Object.values(grouped);
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
    };

    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (error) {
        return <div className="error">Ошибка: {error}</div>;
    }

    if (!Array.isArray(tasks)) {
        return <div className="no-tasks">Задачи не найдены</div>;
    }

    return (
        <div className="task-list-container">
            <div className="task-list-header">
                <button className="btn add-task-btn" onClick={openNewTaskModal}>Добавить новую задачу</button>
                <div className="view-mode-buttons">
                    <button className="btn" onClick={() => setViewMode('date')}>Группировка по дате</button>
                    {isManager && (
                        <button className="btn" onClick={() => setViewMode('responsible')}>Группировка по ответственным</button>
                    )}
                    <button className="btn" onClick={() => setViewMode('all')}>Без группировок</button>
                </div>
            </div>
            <div className="task-list">{renderTasks()}</div>
            <button className="btn logout-btn" onClick={handleLogout}>Выйти</button>
            <EditTaskModal
                isOpen={isNewTaskModalOpen}
                onClose={closeNewTaskModal}
                task={undefined}
                userId={userId}
            />
        </div>
    );
};

export default TaskList;
