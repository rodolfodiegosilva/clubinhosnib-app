import React from "react";
import { Box, Typography, useTheme, useMediaQuery, Paper } from "@mui/material";

const About: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      px={2}
      mt={{ xs: 9, md: 5 }}
      

      sx={{
        background: "linear-gradient(135deg, white 0%, #007bff 100%)",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, md: 4 },            
          mt: { xs: 4, md: 6 },    
          mb: { xs: 4, md: 8 },   
          width: '100%',
          maxWidth: 900,
          borderRadius: 3,
        }}
      >


        <Typography
          variant="h3"
          fontWeight={700}
          gutterBottom
          textAlign="center"
          sx={{ fontFamily: "'Poppins', sans-serif", color: theme.palette.primary.main }}
        >
          Quem Somos
        </Typography>

        <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
          O Clubinhos NIB é uma plataforma dedicada ao evangelismo e à edificação espiritual,
          baseada nos princípios da fé cristã batista.
        </Typography>

        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{ color: theme.palette.secondary.main, fontFamily: "'Poppins', sans-serif" }}
        >
          Nossa História
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
          Com mais de 20 anos de trajetória, temos alcançado milhares de vidas através
          de cultos, encontros e atividades transformadoras.
        </Typography>

        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{ color: theme.palette.secondary.main, fontFamily: "'Poppins', sans-serif" }}
        >
          Missão e Visão
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
          Nossa missão é compartilhar o evangelho com amor e clareza, enquanto nossa visão
          é construir uma comunidade sólida e comprometida com os ensinamentos de Cristo.
        </Typography>
      </Paper>
    </Box>
  );
};

export default About;