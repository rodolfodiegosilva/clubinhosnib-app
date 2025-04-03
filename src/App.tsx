import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./components/NavBar/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Event from "./pages/Event/Event";
import Login from "./pages/Login/Login";
import TeacherArea from "./pages/TeacherArea/TeacherArea";
import PageGalleryView from "./pages/PageView/PagePhoto/PageGalleryView";
import PhotoPageCreator from "./pages/PageCreator/Templates/PhotoPageCreator/PhotoPageCreator";
import VideoPageCreator from "./pages/PageCreator/Templates/VideoPageCreator/VideoPageCreator";
import SelecPageTemplate from "./pages/PageCreator/SelectPageTemplate/SelecPageTemplate";
import PageRenderer from "./components/PageRenderer/PageRenderer";

import "./styles/Global.css";

import { fetchRoutes, Route as DynamicRouteType } from "./store/slices/route/routeSlice";
import { fetchCurrentUser } from "./store/slices/auth/authSlice";
import { RootState, AppDispatch } from "./store/slices";
import StudyMaterialPageCreator from "pages/PageCreator/Templates/StudyMaterialPageCreator/StudyMaterialPageCreator";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dynamicRoutes = useSelector((state: RootState) => state.routes.routes);

  useEffect(() => {
    dispatch(fetchRoutes());
    dispatch(fetchCurrentUser()); // pega os dados do usuário logado
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <div className="mainContainer">
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/eventos" element={<Event />} />
          <Route path="/feed-clubinho" element={<PageGalleryView />} />
          <Route path="/login" element={<Login />} />

          {/* Rota protegida (qualquer usuário logado) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/area-do-professor" element={<TeacherArea />} />
          </Route>

          {/* Rotas protegidas exclusivas para admin */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/editar-pagina-fotos" element={<PhotoPageCreator />} />
            <Route path="/editar-pagina-videos" element={<VideoPageCreator />} />            
            <Route path="/editar-pagina-semana" element={<StudyMaterialPageCreator />} />
            <Route path="/criar-pagina" element={<SelecPageTemplate />} />
          </Route>

          {/* Rotas dinâmicas vindas da API */}
          {dynamicRoutes.map((route: DynamicRouteType) => (
            <Route
              key={route.id}
              path={`/${route.path}`}
              element={
                <PageRenderer
                  entityType={route.entityType}
                  idToFetch={route.idToFetch}
                />
              }
            />
          ))}
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
