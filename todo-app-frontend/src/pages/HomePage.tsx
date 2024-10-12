import React from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleRegisterClick = () => {
        navigate("/register");
    };

    return (
        <div className="homepage-container">
            <div className="homepage-content">
                <h1 className="homepage-title">Добро пожаловать!</h1>
                <p className="homepage-text">Выберите действие:</p>
                <div className="homepage-buttons">
                    <button className="btn login-btn" onClick={handleLoginClick}>Войти</button>
                    <button className="register-btn" onClick={handleRegisterClick}>Зарегистрироваться</button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
