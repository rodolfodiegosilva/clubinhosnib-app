// store/routeSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiAxios from "../../../config/axiosConfig";

// Tipagem de cada rota vinda da API
export interface Route {
  id: string;
  path: string;
  idToFetch: string;
  entityType: string;
  description: string;
  entityId: string;
  type: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  name: string;
}

// Estado global do slice
interface RouteState {
  routes: Route[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: RouteState = {
  routes: [],
  loading: false,
  error: null,
};

// Thunk para buscar as rotas dinamicamente da API
export const fetchRoutes = createAsyncThunk<Route[]>(
  "routes/fetchRoutes",
  async () => {
    const response = await apiAxios.get<Route[]>("/routes");
    return response.data;
  }
);

// Slice de rotas
const routeSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = action.payload;
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao buscar rotas.";
      });
  },
});

export default routeSlice.reducer;
