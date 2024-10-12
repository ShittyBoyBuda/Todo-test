import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    userId: number | null;
}

const storedUserId = localStorage.getItem('userId');
const initialState: UserState = {
    userId: storedUserId ? parseInt(storedUserId) : null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserId: (state, action: PayloadAction<number>) => {
            state.userId = action.payload;
            localStorage.setItem('userId', action.payload.toString());
        },
        clearUserId: (state) => {
            state.userId = null;
            localStorage.removeItem('userId');
        },
    },
});

export const { setUserId, clearUserId } = userSlice.actions;
export default userSlice.reducer;
