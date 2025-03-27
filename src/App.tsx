import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Event from "./pages/Event/Event";
import Home from "./pages/Home/Home";
import Navbar from "./components/NavBar/Navbar";
import "./styles/Global.css";
import SelecPageTemplate from "./pages/PageCreator/SelectPageTemplate/SelecPageTemplate";
import Footer from "./components/Footer/Footer";
import { fetchRoutes, Route as DynamicRouteType } from "./store/slices/route/routeSlice";
import { RootState, AppDispatch } from "./store/slices";
import Gallery from "./pages/PageCreator/Templates/PhotosGallery/PagePhotosCreate";
import PageRenderer from "./components/PageRenderer/PageRenderer";
import Login from "./pages/Login/Login";
import VideosPageCreate from "./pages/PageCreator/Templates/PageVideoCreate/PageVideoCreate";
import PageGalleryView from "pages/PageView/PageGallery/PageGalleryView";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dynamicRoutes = useSelector((state: RootState) => state.routes.routes);

  useEffect(() => {
    dispatch(fetchRoutes());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <div className="mainContainer">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/eventos" element={<Event />} />
          <Route path="/feed-clubinho" element={<PageGalleryView />} />
          <Route path="/editar-feed-clubinho" element={<Gallery />} />          
          <Route path="/editar-pagina-videos" element={<VideosPageCreate />} />
          <Route path="/criar-pagina" element={<SelecPageTemplate />} />          
          <Route path="/login" element={<Login />} />

          {/* Rotas Dinâmicas */}
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
