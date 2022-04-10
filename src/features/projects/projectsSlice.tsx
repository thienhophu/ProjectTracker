import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Step {
  id: string;
  name: string;
  isCompleted: boolean;
}

export interface Project {
  id: string;
  name: string;
  progress: number;
  steps: Array<Step>;
}

export interface ProjectsState {
  ids: Array<Project>;
}

const initialState: ProjectsState = {
  ids: [
    {
      id: "123abc",
      name: "Demo Project",
      progress: 0,
      steps: [
        { id: "step01", name: "Step 1", isCompleted: false },
        { id: "step02", name: "Step 2", isCompleted: false },
        { id: "step03", name: "Step 3", isCompleted: false },
      ],
    },
  ],
};

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<Project>) => {
      state.ids = [...state.ids, action.payload];
    },
    remove: (state, action: PayloadAction<string>) => {
      state.ids = state.ids.filter((project) => project.id !== action.payload);
    },
    addStep: (
      state,
      action: PayloadAction<{ projectId: string; step: Step }>
    ) => {
      const projectIndex = state.ids.findIndex(
        (project) => project.id === action.payload.projectId
      );
      state.ids[projectIndex].steps = [
        ...state.ids[projectIndex].steps,
        action.payload.step,
      ];
    },
    removeStep: (
      state,
      action: PayloadAction<{ projectId: string; id: string }>
    ) => {
      const projectIndex = state.ids.findIndex(
        (project) => project.id === action.payload.id
      );
      state.ids[projectIndex].steps = state.ids[projectIndex].steps.filter(
        (step) => step.id !== action.payload.id
      );
    },
  },
});

export const { add, remove, addStep, removeStep } = projectsSlice.actions;

export default projectsSlice.reducer;
