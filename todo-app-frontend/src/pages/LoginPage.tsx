import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setUserId } from "../redux/userSlice";
import '../App.css';

interface LoginFromInputs {
    login: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFromInputs>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const onSubmit = async (data: LoginFromInputs) => {
        try {
            const response = await axios.post('https://todo-test-pgnd.onrender.com/auth/login', data);
            localStorage.setItem('token', response.data.access_token);

            const userId = response.data.user.id;
            dispatch(setUserId(userId));
            
            navigate('/tasks');
        } catch (error) {
            console.error('Login faild', error);
            alert('Неверный логин или пароль');
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Войти</h1>
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label className="form-label">Логин</label>
                    <input
                        className="form-input"
                        {...register('login', { required: 'Логин обязателен' })}
                        type="text"
                    />
                    {errors.login && <p className="error-message">{errors.login.message}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label">Пароль</label>
                    <input
                        className="form-input"
                        {...register('password', { required: 'Пароль обязателен' })}
                        type="password"
                    />
                    {errors.password && <p className="error-message">{errors.password.message}</p>}
                </div>

                <button className="btn submit-btn" type="submit">Войти</button>
            </form>
        </div>
    );
};

export default LoginPage;
