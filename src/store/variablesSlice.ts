import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Variable {
  id: string;
  name: string;
  value: string;
}

interface VariablesState {
  items: Variable[];
  isLoaded: boolean;
}

const initialState: VariablesState = {
  items: [],
  isLoaded: false,
};

export const variablesSlice = createSlice({
  name: 'variables',
  initialState,
  reducers: {
    setVariables: (state, action: PayloadAction<Variable[]>) => {
      state.items = action.payload;
      state.isLoaded = true;
    },
    addVariable: (state, action: PayloadAction<Variable>) => {
      state.items.push(action.payload);
    },
    updateVariable: (state, action: PayloadAction<Variable>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeVariable: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { setVariables, addVariable, updateVariable, removeVariable } = variablesSlice.actions;

export default variablesSlice.reducer;
