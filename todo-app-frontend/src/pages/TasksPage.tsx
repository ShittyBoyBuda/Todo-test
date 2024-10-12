import React from "react";
import TaskList from "../components/TaskList";
import '../App.css';

const TasksPage: React.FC = () => {
    return (
        <div className="tasks-page">
            <h1 className="tasks-header">Задачи</h1>
            <TaskList />
        </div>
    );
};

export default TasksPage;
