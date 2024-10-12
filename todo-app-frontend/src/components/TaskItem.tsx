import React, { useState } from "react";
import { Task } from "../redux/tasksSlice";
import EditTaskModal from "./EditTaskModal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { deleteTask } from "../redux/tasksSlice";

interface TaskItemProps {
    task: Task;
    userId: number;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, userId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const openModal = () => {
        setEditModalOpen(true);
    };

    const closeModal = () => {
        setEditModalOpen(false);
    };

    const handleDelete = () => {
        if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
            dispatch(deleteTask(task.id));
            setEditModalOpen(false);
        }
    };

    const taskStyle = {
        color: task.status === 'Выполнена' ? 'green' : task.endDate < new Date().toISOString() ? 'red' : 'grey',
    };

    return (
        <div className="task-item" onClick={openModal}>
            <h3 className="task-title" style={taskStyle}>{task.title}</h3>
            <p className="task-description">Описание: {task.description}</p>
            <p className="task-dates">
                Дата завершения: <span>{new Date(task.endDate).toLocaleDateString()}</span>
            </p>
            <p className="task-dates">
                Создано: <span>{new Date(task.createdAt).toLocaleDateString()}</span>
            </p>
            <p className="task-dates">
                Обновлено: <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
            </p>
            <p className="task-priority">Приоритет: {task.priority}</p>
            <p className="task-status">Статус: {task.status}</p>
            <p className="task-creator">
                Создатель: {`${task.creator.firstName} ${task.creator.lastName}`}
            </p>
            <p className="task-responsibles">
                Ответственные: {task.responsibles ? task.responsibles.map(user => `${user.firstName} ${user.lastName}`).join(', ') : 'Нет ответственных'}
            </p>
            <EditTaskModal
                isOpen={isEditModalOpen}
                onClose={closeModal}
                task={task}
                userId={userId}
            />
            <button className="delete-button" onClick={handleDelete}>
                Удалить
            </button>
        </div>
    );
};

export default TaskItem;
