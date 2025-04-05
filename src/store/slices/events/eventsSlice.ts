import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Define a estrutura do objeto "Evento"
 * baseado no retorno de findAll
 */
export interface EventData {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  date: string;        // "2025-04-10"
  location: string;
  description: string;
}

interface EventsState {
  events: EventData[] | null;
}

const initialState: EventsState = {
  events: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<EventData[]>) => {
      state.events = action.payload;
    },
    clearEvents: (state) => {
      state.events = null;
    },
  },
});

export const { setEvents, clearEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
