import eventSlice from "@/components/eventSlice";
import playerSlice from "@/components/playerSlice";
import { configureStore } from "@reduxjs/toolkit";


export const store = configureStore({
  reducer : {
    event: eventSlice,
    player: playerSlice
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;