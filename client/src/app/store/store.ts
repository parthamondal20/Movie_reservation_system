import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";

const rootReducer = combineReducers({
    auth: authSlice
});

const saveState = (state: any) => {
    localStorage.setItem("appStore", JSON.stringify(state))
}

const loadState = () => {
    const state = localStorage.getItem("appStore");
    return state ? JSON.parse(state) : undefined;
}

export const store = configureStore({
    reducer: rootReducer,
    preloadedState: loadState()
});

store.subscribe(() => {
    saveState(store.getState())
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
