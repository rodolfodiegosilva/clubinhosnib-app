import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StudyMediaItem {
  id?: string;
  title: string;
  description: string;
  type: "upload" | "link";
  platform?: "youtube" | "google-drive" | "onedrive" | "dropbox";
  url: string;
  file?: File;
  isLocalFile?: boolean;
  originalName?: string;
  size?: number
}

export interface StudyMaterialPageData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  videos: StudyMediaItem[];
  documents: StudyMediaItem[];
  images: StudyMediaItem[];
  audios: StudyMediaItem[];
}

interface StudyMaterialState {
  studyMaterialData: StudyMaterialPageData | null;
}

const initialState: StudyMaterialState = {
  studyMaterialData: null,
};

const studyMaterialSlice = createSlice({
  name: "studyMaterial",
  initialState,
  reducers: {
    setStudyMaterialData: (state, action: PayloadAction<StudyMaterialPageData>) => {
      state.studyMaterialData = action.payload;
    },
    clearStudyMaterialData: (state) => {
      state.studyMaterialData = null;
    },
  },
});

export const { setStudyMaterialData, clearStudyMaterialData } = studyMaterialSlice.actions;
export default studyMaterialSlice.reducer;
