import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 0, md: 4 },
        py: { xs: 0, md: 6 },
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign={{ xs: "center", md: "left" }}
        mb={4}
        sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" } }}
      >
        Bem-vindo(a), Admin!
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={10} md={6} lg={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Gerenciar Meditações
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Crie, edite e visualize meditações semanais.
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate("/adm/meditacoes")}
            >
              Acessar
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={10} md={6} lg={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Criar Nova Página
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Adicione novas páginas de conteúdo ao site.
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate("/adm/criar-pagina")}
            >
              Acessar
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
