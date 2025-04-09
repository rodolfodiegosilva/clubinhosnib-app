import React, { useMemo } from "react";
import { Box, Typography, Grid2 } from "@mui/material";
import { useSelector } from "react-redux";
import banner from "../../assets/banner_2.png";
import Card from "../../components/Card/Card";
import WeekBanner from "../../components/WeekBanner/WeekBanner";
import { RootState as RootStateType } from "../../store/slices";
import { RouteData } from "../../store/slices/route/routeSlice";

const Home: React.FC = () => {
  const { dynamicRoutes, isAuthenticated } = useSelector((state: RootStateType) => ({
    dynamicRoutes: state.routes.routes,
    isAuthenticated: state.auth.isAuthenticated,
  }));

  const feedImageGalleryId = process.env.REACT_APP_FEED_MINISTERIO_ID ?? "";
  const excludedTypes = ["WeekMaterialsPage", "meditation"];

  const getLatestWeekMaterial = (routes: RouteData[]): RouteData | undefined =>
    routes
      .filter((route) => route.entityType === "WeekMaterialsPage")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const latestWeekRoute = useMemo(() => getLatestWeekMaterial(dynamicRoutes), [dynamicRoutes]);
  const filteredCards = useMemo(
    () =>
      dynamicRoutes.filter(
        (card) =>
          !excludedTypes.includes(card.entityType) &&
          (card.public || isAuthenticated) &&
          card.idToFetch !== feedImageGalleryId
      ),
    [dynamicRoutes, isAuthenticated, feedImageGalleryId]
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #ffffff, #1e73be)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Banner Principal */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "50vh", sm: "70vh", md: "85vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={banner}
          alt="Banner Clubinhos NIB"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)", // Overlay mais escuro para contraste
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            px: { xs: 2, sm: 4 },
            maxWidth: { xs: "90%", sm: "800px" },
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            gutterBottom
            sx={{
              color: "#FFF176", // Amarelo claro para o título
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
              fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Bem-vindo ao Clubinhos NIB
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "#FFFFFF", // Branco puro para o subtítulo
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
              fontSize: { xs: "1rem", sm: "1.5rem" },
            }}
          >
            Ministério de evangelismo que leva a palavra de Deus para as crianças que precisam
            conhecer o amor de Jesus.
          </Typography>
        </Box>
      </Box>

      {/* Banner Semanal */}
      {isAuthenticated && latestWeekRoute && (
        <WeekBanner
          title={latestWeekRoute.title ?? "Sem título"}
          subtitle={latestWeekRoute.subtitle ?? ""}
          linkTo={`/${latestWeekRoute.path}`}
        />
      )}

      {/* Grid de Cards */}
      <Box sx={{ width: { xs: "95%", sm: "90%", md: "85%" }, py: { xs: 4, sm: 6 } }}>
        <Grid2 container spacing={{ xs: 2, sm: 4 }} justifyContent="center">
          {filteredCards.map((card) => (
            <Grid2 key={card.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                title={card.title ?? "Sem título"}
                description={card.description ?? ""}
                image={card.image ?? ""}
                link={`/${card.path}`}
                type={card.type ?? "default"}
              />
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Box>
  );
};

export default Home;