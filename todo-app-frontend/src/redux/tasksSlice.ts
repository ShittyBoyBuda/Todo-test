import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Task {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    priority: string;
    endDate: string;
    status: string;
    creator: User;
    responsibles: User[];
    updatedAt: string;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    surname: string;
    login: string;
}

interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
}

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
}

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('https://todo-test-pgnd.onrender.com/tasks', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
});

export const createTask = createAsyncThunk('task/createTask', async (taskData: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.post('https://todo-test-pgnd.onrender.com/tasks', taskData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (taskData: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`https://todo-test-pgnd.onrender.com/tasks/${taskData.id}`, taskData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId: number) => {
    const token = localStorage.getItem('token');
    await axios.delete(`https://todo-test-pgnd.onrender.com/tasks/${taskId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return taskId;
});

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchTasks.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state.tasks = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchTasks.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Error fetching tasks';
        });
        builder.addCase(createTask.fulfilled, (state, action) => {
            state.tasks.push(action.payload);
        });
        builder.addCase(updateTask.fulfilled, (state, action) => {
            const index = state.tasks.findIndex(task => task.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        });
        builder.addCase(deleteTask.fulfilled, (state, action) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload);
        });
    }
});

export default tasksSlice.reducer;