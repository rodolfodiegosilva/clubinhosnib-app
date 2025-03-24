import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GalleryImageData {
  id: string;
  url: string;
  isLocalFile: boolean;
}

export interface SectionData {
  id: string;
  caption: string;
  description: string;
  images: GalleryImageData[];
}

export interface GalleryPageData {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  sections: SectionData[];
}

interface GalleryState {
  galleryData: GalleryPageData | null;
}

const initialState: GalleryState = {
  galleryData: null,
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setGalleryData: (state, action: PayloadAction<GalleryPageData>) => {
      state.galleryData = action.payload;
    },
    clearGalleryData: (state) => {
      state.galleryData = null;
    },
  },
});

export const { setGalleryData, clearGalleryData } = gallerySlice.actions;
export default gallerySlice.reducer;
