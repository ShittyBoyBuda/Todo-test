import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../App.css';

interface RegisterFormInputs {
    firstName: string;
    lastName: string;
    surname: string;
    login: string;
    password: string;
    managerId?: number;
}

interface User {
    id: number;
    firstName: string;
    lastName: string;
}

const RegisterPage: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/user');
                setUsers(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUsers();
    }, []);

    const onSubmit = async (data: RegisterFormInputs) => {
        try {
            await axios.post('http://localhost:3000/auth/register', data);
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Регистрация</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                <div className="form-group">
                    <label className="form-label">Имя:</label>
                    <input className="form-input" {...register("firstName", { required: true })} />
                    {errors.firstName && <span className="error-message">Это поле обязательно</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Фамилия:</label>
                    <input className="form-input" {...register("lastName", { required: true })} />
                    {errors.lastName && <span className="error-message">Это поле обязательно</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Отчество:</label>
                    <input className="form-input" {...register("surname", { required: true })} />
                    {errors.surname && <span className="error-message">Это поле обязательно</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Логин:</label>
                    <input className="form-input" {...register("login", { required: true })} />
                    {errors.login && <span className="error-message">Это поле обязательно</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Пароль:</label>
                    <input type="password" className="form-input" {...register("password", { required: true, minLength: 6 })} />
                    {errors.password && <span className="error-message">Пароль должен содержать не менее 6 символов</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Выберите руководителя (необязательно):</label>
                    <select className="form-input" {...register('managerId')}>
                        <option value="">Нет руководителя</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.firstName} {user.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                <button className="submit-btn" type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default RegisterPage;
