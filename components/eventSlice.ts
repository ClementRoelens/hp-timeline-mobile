import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../config/store";
import { Event } from "../models/Event";

const initialState = {
  eventsStock : [],
  selectedEvent : null
} as {
  eventsStock : Event[],
  selectedEvent : Event | null
};

const eventSlice = createSlice({
  name : "event",
  initialState : initialState,
  reducers : {
    setEvents : (state, action:PayloadAction<Event[]>) => {
      state.eventsStock = action.payload;
    },
    drawCard : (state) => {
      state.eventsStock.shift();
    },
    selectEvent: (state, action:PayloadAction<Event | null>) => {
      state.selectedEvent = action.payload;
    }
  }
});

export const { setEvents, drawCard, selectEvent } = eventSlice.actions;
export default eventSlice.reducer;
export const eventSelector = (state:RootState) => state.event;