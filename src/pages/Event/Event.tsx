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
  CircularProgress,
  TextField,
  Tooltip,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PlaceIcon from "@mui/icons-material/Place";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/slices";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import api from "../../config/axiosConfig";
import { setEvents } from "../../store/slices/events/eventsSlice";

dayjs.locale("pt-br");

/** ==================== Destaque/Estilo do Card ==================== */
const getDestaque = (dateISO: string) => {
  const eventoDate = dayjs(dateISO);
  const hoje = dayjs();

  if (eventoDate.isSame(hoje, "day")) return "hoje";
  if (eventoDate.diff(hoje, "day") <= 7 && eventoDate.isAfter(hoje, "day")) return "semana";
  if (eventoDate.month() === hoje.month() && eventoDate.year() === hoje.year()) return "mes";
  return "fora";
};

const getEstiloCard = (destaque: string, theme: any) => {
  switch (destaque) {
    case "hoje":
      return { borderLeft: "8px solid red", backgroundColor: "#ffe6e6" };
    case "semana":
      return {
        borderLeft: `6px solid ${theme.palette.secondary.main}`,
        backgroundColor: `${theme.palette.secondary.light}33`,
      };
    case "mes":
      return {
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        backgroundColor: `${theme.palette.primary.light}15`,
      };
    default:
      return { borderLeft: "4px solid #ccc" };
  }
};

/** ==================== Componente Principal ==================== */
const Eventos: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const isAdmin = isAuthenticated && user?.role === "admin";

  const hoje = dayjs();
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarAntigos, setMostrarAntigos] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Add/Edit Modal
  const [dialogAddEditOpen, setDialogAddEditOpen] = useState(false);
  const [dialogAddEditMode, setDialogAddEditMode] = useState<"add" | "edit">("add");
  const [currentEditEvent, setCurrentEditEvent] = useState<any | null>(null);

  // Delete Modal
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [deleteTargetEvent, setDeleteTargetEvent] = useState<any | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const eventosAntigosRef = useRef<HTMLDivElement | null>(null);

  /** ==================== Carrega Eventos ==================== */
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await api.get("/events");
        dispatch(setEvents(response.data));
        setEventos(response.data);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, [dispatch]);

  /** ==================== Smooth Scroll ==================== */
  useEffect(() => {
    if (mostrarAntigos && eventosAntigosRef.current) {
      setTimeout(() => {
        eventosAntigosRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [mostrarAntigos]);

  /** ==================== Edit Mode ==================== */
  const handleEnterEditMode = () => setEditMode(true);
  const handleCancelEditMode = () => setEditMode(false);

  /** ==================== Ordena / Segmenta ==================== */
  const eventosOrdenados = [...eventos].sort(
    (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
  );
  const eventosAnterioresFull = eventosOrdenados.filter((e) => dayjs(e.date).isBefore(hoje, "day"));
  const eventosHojeFull = eventosOrdenados.filter((e) => dayjs(e.date).isSame(hoje, "day"));
  const eventosFuturosFull = eventosOrdenados.filter((e) => dayjs(e.date).isAfter(hoje, "day"));

  const eventoAnterior = eventosAnterioresFull.at(-1) || null;
  const leftoverAnteriores = eventoAnterior ? eventosAnterioresFull.slice(0, -1) : [];
  const eventoHoje = eventosHojeFull[0] || null;
  const eventoProximo = eventosFuturosFull[0] || null;
  const eventoPosterior = eventosFuturosFull[1] || null;
  const leftoverFuturos = eventosFuturosFull.slice(2);

  /** ==================== Render Card ==================== */
  const renderCard = (evento: any) => {
    const destaque = getDestaque(evento.date);
    const estilo = getEstiloCard(destaque, theme);
    const dataFormatada = dayjs(evento.date).format("DD [de] MMMM");

    return (
      <Card elevation={3} sx={{ borderRadius: 2, ...estilo, backgroundColor: "#ffffff" }}>
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
              <strong>Data:</strong> {dataFormatada}
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
        <CardActions sx={{ px: 2, pb: 2, display: "flex", justifyContent: "space-between" }}>
          {!editMode ? (
            <Button
              variant="outlined"
              color="primary"
              fullWidth={isMobile}
              onClick={() => setEventoSelecionado(evento)}
              sx={{ fontWeight: "bold", textTransform: "none" }}
            >
              Ver Detalhes
            </Button>
          ) : (
            <>
              <Box>
                <Tooltip title="Editar">
                  <IconButton onClick={() => handleEditEvent(evento)}>
                    <EditIcon color="primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir">
                  <IconButton onClick={() => handleDeleteEvent(evento)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                fullWidth={isMobile}
                onClick={() => setEventoSelecionado(evento)}
                sx={{ fontWeight: "bold", textTransform: "none" }}
              >
                Ver Detalhes
              </Button>
            </>
          )}
        </CardActions>
      </Card>
    );
  };

  /** ==================== Ações ADD/EDIT ==================== */
  const handleAddNewEvent = () => {
    setDialogAddEditMode("add");
    setCurrentEditEvent(null);
    setFormTitle("");
    setFormDate("");
    setFormLocation("");
    setFormDescription("");
    setDialogAddEditOpen(true);
  };

  const handleEditEvent = (evento: any) => {
    setDialogAddEditMode("edit");
    setCurrentEditEvent(evento);
    setFormTitle(evento.title);
    setFormDate(evento.date);
    setFormLocation(evento.location);
    setFormDescription(evento.description);
    setDialogAddEditOpen(true);
  };

  const handleSubmitAddEdit = async () => {
    try {
      if (dialogAddEditMode === "add") {
        await api.post("/events", {
          title: formTitle,
          date: formDate,
          location: formLocation,
          description: formDescription,
        });
      } else {
        if (!currentEditEvent?.id) return;
        await api.patch(`/events/${currentEditEvent.id}`, {
          title: formTitle,
          date: formDate,
          location: formLocation,
          description: formDescription,
        });
      }
      setDialogAddEditOpen(false);
      await reloadEventsAndLeaveEditMode();
    } catch (error) {
      console.error("Erro ao criar/editar evento:", error);
    }
  };

  /** ==================== Ações DELETE ==================== */
  const handleDeleteEvent = (evento: any) => {
    setDeleteTargetEvent(evento);
    setDialogDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetEvent) return;
    try {
      await api.delete(`/events/${deleteTargetEvent.id}`);
      setDialogDeleteOpen(false);
      setDeleteTargetEvent(null);
      await reloadEventsAndLeaveEditMode();
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
    }
  };

  const handleCloseDelete = () => {
    setDialogDeleteOpen(false);
    setDeleteTargetEvent(null);
  };

  const reloadEventsAndLeaveEditMode = async () => {
    setLoading(true);
    try {
      const response = await api.get("/events");
      dispatch(setEvents(response.data));
      setEventos(response.data);
    } catch (err) {
      console.error("Erro ao recarregar eventos:", err);
    } finally {
      setLoading(false);
      setEditMode(false);
    }
  };

  /** ==================== Render Principal ==================== */
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // Se não há eventos
  const naoTemEventos = !eventos.length;

  return (
    <>
      {/* Estado vazio: Aparece se naoTemEventos */}
      {naoTemEventos && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          minHeight="50vh"
          gap={2}
          sx={{ px: 2 }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum evento encontrado
          </Typography>

          {isAdmin && (
            <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={handleAddNewEvent}>
              Adicionar Evento
            </Button>
          )}
        </Box>
      )}

      {/* Se tem eventos, renderizamos a listagem normal */}
      {!naoTemEventos && (
        <Box sx={{ mt: { xs: 10, md: 11 }, mb: { xs: 5, md: 6 }, px: 2 }}>
          {/* Cabeçalho */}
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
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <CalendarTodayIcon color="primary" /> Eventos
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Participe das atividades e encontros do Clubinho!
              </Typography>
            </Box>

            <Box textAlign={{ xs: "center", md: "right" }}>
              {isAdmin && !editMode && (
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<EditCalendarIcon />}
                  onClick={handleEnterEditMode}
                  sx={{ mb: 1 }}
                >
                  Editar Página
                </Button>
              )}

              {editMode && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddNewEvent}
                    sx={{ mr: 2, mb: 1 }}
                  >
                    Adicionar Evento
                  </Button>
                  <Button variant="contained" color="inherit" onClick={handleCancelEditMode} sx={{ mb: 1 }}>
                    Cancelar
                  </Button>
                </>
              )}

              {leftoverAnteriores.length > 0 && (
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

          {/* Bloco Principal - Anterior, Hoje, Proximo, Posterior */}
          <Box
            sx={{
              mt: { xs: 1, md: 3 },
              mb: { xs: 4, md: 4 },
              pt: { xs: 1, md: 2 },
              pb: { xs: 6, md: 3 },
              px: { xs: 2, md: 4 },
              background: "linear-gradient(135deg, white 0%, #007bff 100%)",
              borderRadius: 3,
            }}
          >
            <Grid container spacing={4} justifyContent="center" sx={{ mt: 1, mb: 1 }}>
              {eventoHoje ? (
                <>
                  {eventoAnterior && (
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" textAlign="center" fontWeight="bold" mb={1}>
                        Evento Anterior
                      </Typography>
                      {renderCard(eventoAnterior)}
                    </Grid>
                  )}

                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{ order: { xs: -1, md: 0 } }}
                  >
                    <Typography variant="subtitle1" textAlign="center" fontWeight="bold" mb={1}>
                      Evento de Hoje
                    </Typography>
                    {renderCard(eventoHoje)}
                  </Grid>

                  {eventoProximo && (
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" textAlign="center" fontWeight="bold" mb={1}>
                        Próximo Evento
                      </Typography>
                      {renderCard(eventoProximo)}
                    </Grid>
                  )}
                </>
              ) : (
                <>
                  {eventoAnterior && (
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" textAlign="center" fontWeight="bold" mb={1}>
                        Evento Anterior
                      </Typography>
                      {renderCard(eventoAnterior)}
                    </Grid>
                  )}
                  {eventoProximo && (
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" textAlign="center" fontWeight="bold" mb={1}>
                        Próximo Evento
                      </Typography>
                      {renderCard(eventoProximo)}
                    </Grid>
                  )}
                  {eventoPosterior && (
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" textAlign="center" fontWeight="bold" mb={1}>
                        Evento Posterior
                      </Typography>
                      {renderCard(eventoPosterior)}
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </Box>

          {/* Leftover Futuros => \"Próximos Eventos\" */}
          {leftoverFuturos.length > 0 && (
            <Box
              mb={6}
              sx={{
                background: "linear-gradient(135deg, white 0%, #00bf3f 100%)",
                borderRadius: 3,
                p: { xs: 2, md: 6 },
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="text.secondary" mb={2} sx={{ textAlign: "center" }}>
                Próximos Eventos
              </Typography>
              <Grid container spacing={4} justifyContent="center">
                {leftoverFuturos.map((evento) => (
                  <Grid item xs={12} sm={6} md={4} key={evento.id}>
                    {renderCard(evento)}
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Leftover Anteriores => \"Eventos Anteriores\" */}
          {mostrarAntigos && leftoverAnteriores.length > 0 && (
            <Box
              ref={eventosAntigosRef}
              mb={6}
              sx={{
                background: "linear-gradient(135deg, white 0%, #ff0033 100%)",
                borderRadius: 3,
                p: { xs: 2, md: 6 },
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="text.secondary" mb={2} sx={{ textAlign: "center" }}>
                Eventos Anteriores
              </Typography>
              <Grid container spacing={4} justifyContent="center">
                {leftoverAnteriores.map((evento) => (
                  <Grid item xs={12} sm={6} md={4} key={evento.id}>
                    {renderCard(evento)}
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      )}

      {/* Dialog de Detalhes */}
      {eventoSelecionado && (
        <Dialog open onClose={() => setEventoSelecionado(null)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: theme.palette.primary.main }}>
            {eventoSelecionado.title}
            <IconButton
              aria-label="close"
              onClick={() => setEventoSelecionado(null)}
              sx={{ position: "absolute", right: 8, top: 8, color: theme.palette.grey[500] }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box mt={1}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Data:</strong> {dayjs(eventoSelecionado.date).format("DD [de] MMMM")}
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

      {/* Dialog de ADD/EDIT Evento */}
      <Dialog open={dialogAddEditOpen} onClose={() => setDialogAddEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogAddEditMode === "add" ? "Adicionar Evento" : "Editar Evento"}
          <IconButton
            aria-label="close"
            onClick={() => setDialogAddEditOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8, color: theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Título"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Data"
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Local"
              value={formLocation}
              onChange={(e) => setFormLocation(e.target.value)}
              fullWidth
            />
            <TextField
              label="Descrição"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAddEditOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSubmitAddEdit} variant="contained" color="primary">
            {dialogAddEditMode === "add" ? "Adicionar" : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação de DELETE */}
      <Dialog open={dialogDeleteOpen} onClose={handleCloseDelete} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir este evento?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Eventos;
