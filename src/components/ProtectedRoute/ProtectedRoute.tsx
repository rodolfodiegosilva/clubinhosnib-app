import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState as RootStateType } from "../../store/slices";
import { Box, CircularProgress, Typography } from "@mui/material";
import { RoleUser } from "../../store/slices/auth/authSlice";

interface ProtectedRouteProps {
  requiredRole?: string | string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const location = useLocation();
  const { isAuthenticated, user, loadingUser } = useSelector((state: RootStateType) => state.auth);

  // Enquanto carrega o usuário, exibe um spinner
  if (loadingUser) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress aria-label="Carregando autenticação" />
        <Typography variant="body2" color="text.secondary">
          Verificando autenticação...
        </Typography>
      </Box>
    );
  }

  // Se não estiver autenticado, redireciona para o login preservando a rota original
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verifica se uma role específica é exigida
  if (requiredRole) {
    const rolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const userRole = user?.role;

    // Se o usuário não tem a role exigida, redireciona para a home
    if (!userRole || !rolesArray.includes(userRole)) {
      return <Navigate to="/" state={{ error: "Acesso negado" }} replace />;
    }
  }

  // Se já está autenticado e tem a role correta, mantém a página atual
  return <Outlet />;
};

export default ProtectedRoute;