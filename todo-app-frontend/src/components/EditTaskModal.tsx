import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { createTask, updateTask, Task, User } from "../redux/tasksSlice";
import '../index.css';
import axios from 'axios';

interface EditTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task;
    userId: number;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, task }) => {
    const dispatch = useDispatch<AppDispatch>();
    const userId = useSelector((state: RootState) => state.user.userId);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        endDate: '',
        priority: '',
        status: 'К выполнению',
        responsibleIds: task?.responsibles ? task.responsibles.map((user: User) => user.id) : []
    });

    const [isNewTask, setIsNewTask] = useState(false);
    const [subordinates, setSubordinates] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubordinates = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error("Токен отсутствует в localStorage");
                    return;
                }
                const response = await axios.get(`http://localhost:3000/user/subordinates/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                if (response.data) {
                    setSubordinates(response.data);
                } else {
                    console.warn("Подчинённые не найдены");
                }
            } catch (error) {
                setError("Ошибка при загрузке подчиненных");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchSubordinates();
        }
    }, [userId]);

    useEffect(() => {
        if (task) {
            setIsNewTask(false);
            setFormData({
                title: task.title,
                description: task.description,
                endDate: task.endDate,
                priority: task.priority,
                status: task.status,
                responsibleIds: task.responsibles ? task.responsibles.map((user: User) => user.id) : [],
            });
        } else {
            setIsNewTask(true);
            setFormData({
                title: '',
                description: '',
                endDate: '',
                priority: 'Низкая',
                status: 'К выполнению',
                responsibleIds: [],
            });
        }
    }, [task]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (userId: number) => {
        setFormData(prevFormData => {
            const isChecked = prevFormData.responsibleIds.includes(userId);
            const newResponsibleIds = isChecked
                ? prevFormData.responsibleIds.filter(id => id !== userId)
                : [...prevFormData.responsibleIds, userId];

            return {
                ...prevFormData,
                responsibleIds: newResponsibleIds,
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isNewTask) {
            dispatch(createTask(formData));
            setFormData({
                title: '',
                description: '',
                endDate: '',
                priority: 'Низкая',
                status: 'К выполнению',
                responsibleIds: [],
            });
        } else {
            dispatch(updateTask({ id: task?.id, ...formData }));
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {isOpen && (
                <>
                    <div className="modal-overlay"></div>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" type="button" onClick={onClose}>✖</button>
                        {loading ? (
                            <p>Загрузка подчиненных...</p>
                        ) : error ? (
                            <p className="error-message">{error}</p>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <h2 className="modal-header">{isNewTask ? "Создание задачи" : "Редактирование задачи"}</h2>
                                <input 
                                    className="modal-input" 
                                    name="title" 
                                    value={formData.title} 
                                    onChange={handleChange} 
                                    placeholder="Заголовок задачи" 
                                    required
                                />
                                <textarea 
                                    className="modal-textarea" 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleChange} 
                                    placeholder="Описание задачи" 
                                />
                                <input 
                                    className="modal-input" 
                                    type="date" 
                                    name="endDate" 
                                    value={formData.endDate} 
                                    onChange={handleChange}
                                    required 
                                />
                                <select
                                    className="modal-select" 
                                    name="priority" 
                                    value={formData.priority} 
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Низкий">Низкий</option>
                                    <option value="Средний">Средний</option>
                                    <option value="Высокий">Высокий</option>
                                </select> 
                                <select 
                                    className="modal-select" 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleChange}
                                >
                                    <option value="К выполнению">К выполнению</option>
                                    <option value="Выполняется">Выполняется</option>
                                    <option value="Выполнена">Выполнена</option>
                                    <option value="Отменена">Отменена</option>
                                </select>
                                <label className="responsibles-label">Ответственные:</label>
                                <div className="responsibles-checkboxes">
                                    {subordinates.length > 0 ? (
                                        subordinates.map(user => (
                                            <div key={user.id} className="checkbox-item">
                                                <input
                                                    type="checkbox"
                                                    id={`responsible-${user.id}`}
                                                    value={user.id}
                                                    checked={formData.responsibleIds.includes(user.id)}
                                                    onChange={() => handleCheckboxChange(user.id)}
                                                />
                                                <label htmlFor={`responsible-${user.id}`}>
                                                    {user.firstName} {user.lastName}
                                                </label>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Нет подчиненных</p>
                                    )}
                                </div>
                                <div className="modal-buttons">
                                    <button className="modal-button" type="submit">Сохранить</button>
                                    <button className="modal-button cancel-button" type="button" onClick={onClose}>Отменить</button>
                                </div>
                            </form>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default EditTaskModal;
