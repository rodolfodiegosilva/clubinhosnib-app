import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RouteData } from "../route/routeSlice";

export interface WeekMediaItem {
  id?: string;
  title: string;
  description: string;
  type: "upload" | "link";
  platform?: "youtube" | "googledrive" | "onedrive" | "dropbox";
  url: string;
  file?: File;
  isLocalFile?: boolean;
  originalName?: string;
  size?: number
}

export interface WeekMaterialPageData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  videos: WeekMediaItem[];
  documents: WeekMediaItem[];
  images: WeekMediaItem[];
  audios: WeekMediaItem[];
  route: RouteData;
}

interface WeekMaterialState {
  studyMaterialData: WeekMaterialPageData | null;
}

const initialState: WeekMaterialState = {
  studyMaterialData: null,
};

const studyMaterialSlice = createSlice({
  name: "studyMaterial",
  initialState,
  reducers: {
    setWeekMaterialData: (state, action: PayloadAction<WeekMaterialPageData>) => {
      state.studyMaterialData = action.payload;
    },
    clearWeekMaterialData: (state) => {
      state.studyMaterialData = null;
    },
  },
});

export const { setWeekMaterialData, clearWeekMaterialData } = studyMaterialSlice.actions;
export default studyMaterialSlice.reducer;
