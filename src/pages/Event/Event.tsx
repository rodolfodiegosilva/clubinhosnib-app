import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  useTheme,
  useMediaQuery,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PlaceIcon from "@mui/icons-material/Place";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { RootState } from "../../store/slices";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

const eventos = [
  { id: 1, title: "Culto da Família", date: "12 de Março", location: "Igreja Batista Central", description: "Culto especial com foco na família cristã." },
  { id: 2, title: "Noite de Louvor", date: "18 de Março", location: "Templo Sede", description: "Uma noite dedicada a adoração e louvor." },
  { id: 3, title: "Evangelismo nas Ruas", date: "25 de Março", location: "Centro da Cidade", description: "Ação evangelística com distribuição de folhetos." },
  { id: 4, title: "Encontro de Jovens", date: "29 de Março", location: "Salão NIB", description: "Reunião de jovens com dinâmicas e palavra." },
  { id: 5, title: "Oficina de Teatro", date: "30 de Março", location: "Auditório Central", description: "Oficina de teatro para aprimorar talentos artísticos." },
  { id: 6, title: "Congresso Kids", date: "31 de Março", location: "Templo Sede", description: "Congresso infantil com atividades lúdicas." },
  { id: 7, title: "Celebração de Páscoa", date: "01 de Abril", location: "Jardim da Igreja", description: "Celebração especial de Páscoa ao ar livre." },
  { id: 8, title: "Tarde de Louvor", date: "02 de Abril", location: "Parque Municipal", description: "Louvor e adoração em um ambiente descontraído." },
  { id: 9, title: "Treinamento Voluntários", date: "05 de Abril", location: "Sala 3", description: "Capacitação para voluntários do ministério." },
  { id: 10, title: "Retiro Espiritual", date: "10 de Abril", location: "Sítio da Paz", description: "Dias de retiro para oração, reflexão e comunhão." },
];

const parseDate = (data: string) => {
  const meses: Record<string, number> = {
    Janeiro: 0, Fevereiro: 1, Março: 2, Abril: 3,
    Maio: 4, Junho: 5, Julho: 6, Agosto: 7,
    Setembro: 8, Outubro: 9, Novembro: 10, Dezembro: 11,
  };
  const [dia, mesNome] = data.split(" de ");
  return new Date(new Date().getFullYear(), meses[mesNome], parseInt(dia));
};

const getDestaque = (data: string) => {
  const eventoDate = dayjs(parseDate(data));
  const hoje = dayjs();
  if (eventoDate.isSame(hoje, "day")) return "hoje";
  if (eventoDate.diff(hoje, "day") <= 7 && eventoDate.isAfter(hoje)) return "semana";
  if (eventoDate.month() === hoje.month()) return "mes";
  return "fora";
};

const getEstiloCard = (destaque: string, theme: any) => {
  switch (destaque) {
    case "hoje":
      return { borderLeft: "8px solid red", backgroundColor: "#ffe6e6" };
    case "semana":
      return { borderLeft: `6px solid ${theme.palette.secondary.main}`, backgroundColor: `${theme.palette.secondary.light}33` };
    case "mes":
      return { borderLeft: `4px solid ${theme.palette.primary.main}`, backgroundColor: `${theme.palette.primary.light}15` };
    default:
      return { borderLeft: "4px solid #ccc" };
  }
};

const Eventos: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const isAdmin = isAuthenticated && user?.role === "admin";

  const hoje = dayjs();
  const eventosOrdenados = [...eventos].sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());
  const eventosAnteriores = eventosOrdenados.filter((e) => dayjs(parseDate(e.date)).isBefore(hoje, "day"));
  const eventosHoje = eventosOrdenados.filter((e) => dayjs(parseDate(e.date)).isSame(hoje, "day"));
  const eventosFuturos = eventosOrdenados.filter((e) => dayjs(parseDate(e.date)).isAfter(hoje, "day"));

  const eventoAnterior = eventosAnteriores.at(-1);
  const eventoHoje = eventosHoje[0];
  const eventoProximo = eventosFuturos[0];
  const eventoPosterior = eventosFuturos[1];

  const [mostrarAntigos, setMostrarAntigos] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<typeof eventos[0] | null>(null);

  const eventosAntigosRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mostrarAntigos && eventosAntigosRef.current) {
      setTimeout(() => {
        eventosAntigosRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [mostrarAntigos]);

  const renderCard = (evento: typeof eventos[0]) => {
    const destaque = getDestaque(evento.date);
    const estilo = getEstiloCard(destaque, theme);

    return (
      <Card
        elevation={3}
        sx={{
          borderRadius: 2,
          ...estilo,
          height: "100%",
          opacity: 1,
          backgroundColor: "#ffffff",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight="bold"
            color={destaque === "hoje" ? "error" : "primary"}
            gutterBottom
          >
            {evento.title}
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <CalendarTodayIcon fontSize="small" color="action" />
            <Typography variant="body2">
              <strong>Data:</strong> {evento.date}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <PlaceIcon fontSize="small" color="action" />
            <Typography variant="body2">
              <strong>Local:</strong> {evento.location}
            </Typography>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth={isMobile}
            onClick={() => setEventoSelecionado(evento)}
            sx={{ fontWeight: "bold", textTransform: "none" }}
          >
            Ver Detalhes
          </Button>
        </CardActions>
      </Card>
    );
  };


  return (
    <Box sx={{ mt: { xs: 10, md: 11 }, mb: { xs: 5, md: 6 }, px: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { xs: "center", md: "space-between" },
          alignItems: { xs: "center", md: "center" },
          textAlign: { xs: "center", md: "left" },
          mb: 4,
          gap: { xs: 2, md: 0 },
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: { xs: "center", md: "flex-start" } }}>
            <CalendarTodayIcon color="primary" /> Eventos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Participe das atividades e encontros do Clubinho!
          </Typography>
        </Box>

        <Box textAlign={{ xs: "center", md: "right" }}>
          {isAdmin && (
            <Button
              variant="contained"
              color="warning"
              startIcon={<EditCalendarIcon />}
              onClick={() => navigate("/editar-eventos")}
              sx={{ mb: 1 }}
            >
              Editar Página
            </Button>
          )}
          {eventosAnteriores.slice(2).length > 0 && (
            <Button
              variant="text"
              color="secondary"
              onClick={() => setMostrarAntigos(!mostrarAntigos)}
              sx={{ fontWeight: "bold", display: "block", mt: 1 }}
            >
              {mostrarAntigos ? "Esconder Eventos Antigos" : "Ver Eventos Antigos"}
            </Button>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          mb: { xs: 1, md: 3 },
          background: "linear-gradient(135deg, white 0%, #007bff 100%)",
          borderRadius: 3,
          p: { xs: 2, md: 2 },
          minHeight: "auto",
        }}
      >
        <Grid container spacing={4} justifyContent="center" sx={{ mt: { xs: 2, md: 1 }, mb: { xs: 4, md: 1 } }}>
          {eventoHoje ? (
            <>
              {eventoAnterior && (
                <Grid item xs={12} md={4} sx={{ mt: { xs: 2, md: 1 }, mb: { xs: 2, md: 3 } }}>
                  <Typography
                    variant="subtitle1"
                    textAlign="center"
                    fontWeight="bold"
                    mb={{ xs: 1, md: 1 }}
                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                  >
                    Evento Anterior
                  </Typography>
                  {renderCard(eventoAnterior)}
                </Grid>
              )}
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  mt: { xs: 2, md: 1 },
                  mb: { xs: 2, md: 3 },
                  order: { xs: -1, md: 0 }
                }}
              >
                <Typography
                  variant="subtitle1"
                  textAlign="center"
                  fontWeight="bold"
                  mb={{ xs: 1, md: 1 }}
                  sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                >
                  Evento de Hoje
                </Typography>
                {renderCard(eventoHoje)}
              </Grid>
              {eventoProximo && (
                <Grid item xs={12} md={4} sx={{ mt: { xs: 2, md: 1 }, mb: { xs: 2, md: 3 } }}>
                  <Typography
                    variant="subtitle1"
                    textAlign="center"
                    fontWeight="bold"
                    mb={{ xs: 1, md: 1 }}
                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                  >
                    Próximo Evento
                  </Typography>
                  {renderCard(eventoProximo)}
                </Grid>
              )}
            </>
          ) : (
            <>
              {eventoAnterior && (
                <Grid item xs={12} md={4} sx={{ mt: { xs: 2, md: 1 }, mb: { xs: 2, md: 1 } }}>
                  <Typography
                    variant="subtitle1"
                    textAlign="center"
                    fontWeight="bold"
                    mb={{ xs: 1, md: 1 }}
                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                  >
                    Evento Anterior
                  </Typography>
                  {renderCard(eventoAnterior)}
                </Grid>
              )}
              {eventoProximo && (
                <Grid item xs={12} md={4} sx={{ mt: { xs: 2, md: 1 }, mb: { xs: 2, md: 3 } }}>
                  <Typography
                    variant="subtitle1"
                    textAlign="center"
                    fontWeight="bold"
                    mb={{ xs: 1, md: 1 }}
                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                  >
                    Próximo Evento
                  </Typography>
                  {renderCard(eventoProximo)}
                </Grid>
              )}
              {eventoPosterior && (
                <Grid item xs={12} md={4} sx={{ mt: { xs: 2, md: 1 }, mb: { xs: 2, md: 3 } }}>
                  <Typography
                    variant="subtitle1"
                    textAlign="center"
                    fontWeight="bold"
                    mb={{ xs: 1, md: 1 }}
                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                  >
                    Evento Posterior
                  </Typography>
                  {renderCard(eventoPosterior)}
                </Grid>
              )}
            </>
          )}
        </Grid>

      </Box>

      {eventosFuturos.slice(2).length > 0 && (
        <Box
          mb={6}
          sx={{
            background: "linear-gradient(135deg, white 0%, #00bf3f 100%)",
            borderRadius: 3,
            p: { xs: 2, md: 6 },
            minHeight: "auto",
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="text.secondary" mb={2} sx={{ textAlign: "center" }}>
            Próximos Eventos
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {eventosFuturos.slice(2).map((evento) => (
              <Grid item xs={12} sm={6} md={4} key={evento.id}>
                {renderCard(evento)}
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {mostrarAntigos && eventosAnteriores.slice(2).length > 0 && (
        <Box
          ref={eventosAntigosRef}
          mb={6}
          sx={{
            background: "linear-gradient(135deg, white 0%, #ff0033 100%)",
            borderRadius: 3,
            p: { xs: 2, md: 6 },
            minHeight: "auto",
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="text.secondary" mb={2} sx={{ textAlign: "center" }}>
            Eventos Anteriores
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {eventosAnteriores.map((evento) => (
              <Grid item xs={12} sm={6} md={4} key={evento.id}>
                {renderCard(evento)}
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {eventoSelecionado && (
        <Dialog open onClose={() => setEventoSelecionado(null)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: theme.palette.primary.main }}>
            {eventoSelecionado.title}
            <IconButton
              aria-label="close"
              onClick={() => setEventoSelecionado(null)}
              sx={{ position: 'absolute', right: 8, top: 8, color: theme.palette.grey[500] }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box mt={1}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Data:</strong> {eventoSelecionado.date}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Local:</strong> {eventoSelecionado.location}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Descrição:</strong> {eventoSelecionado.description}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
            <Button onClick={() => setEventoSelecionado(null)} color="primary" variant="text">
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Eventos;