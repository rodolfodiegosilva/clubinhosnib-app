import React from "react";
import { Box, Grid2, Typography } from "@mui/material";
import banner from "../../assets/banner_2.png";
import Card from "../../components/Card/Card";
import { useSelector } from "react-redux";
import { RootState } from "../../store/slices";

const Home: React.FC = () => {
  const dynamicRoutes = useSelector((state: RootState) => state.routes.routes);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #ffffff, #1e73be)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "70vh", md: "85vh" },
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
          alt="Clubinhos NIB"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            maxWidth: "800px",
            px: 2,
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{ textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)" }}
          >
            Bem-vindo ao Clubinhos NIB
          </Typography>
          <Typography variant="h5">
            Plataforma de evangelismo cristão para todas as idades.
          </Typography>
        </Box>
      </Box>

      {/* Cards Dinâmicos vindos do Redux */}
      <Box sx={{ width: "90%", py: 6 }}>
        <Grid2 container spacing={4} justifyContent="center">
          {dynamicRoutes.map((card) => (
            <Grid2 key={card.id}>
              <Card
                title={card.name}
                description={card.description}
                image={card.image ?? ""}
                link={`/${card.path}`}
                type={card.type}
              />
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Box>
  );
};

export default Home;
