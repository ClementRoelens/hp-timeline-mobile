
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../models/Player";
import { RootState } from "../config/store";
import { Event } from '../models/Event';

const initialState = {
  currentPlayerIndex: 0,
  players: []
} as {
  currentPlayerIndex: number,
  players: Player[]
};

const playerSlice = createSlice({
  name: "player",
  initialState: initialState,
  reducers: {
    initiatePlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
    },
    addCardToHand: (state, action: PayloadAction<{ playerIndex: number, event: Event }>) => {
      state.players[action.payload.playerIndex].hand.push(action.payload.event);
    },
    endTurn: (state) => {
      if (state.currentPlayerIndex + 1 < state.players.length) {
        state.currentPlayerIndex = state.currentPlayerIndex + 1
      } else {
        state.currentPlayerIndex = 0;
      }
    },
    removeCardFromHand: (state, action: PayloadAction<{id:number}>) => {
      state.players[state.currentPlayerIndex].hand 
      = 
      state.players[state.currentPlayerIndex].hand.filter((event:Event) => event.id !== action.payload.id);
    }
  }
});

export const { initiatePlayers, addCardToHand, removeCardFromHand, endTurn } = playerSlice.actions;
export default playerSlice.reducer;
export const playerSelector = (state: RootState) => state.player;