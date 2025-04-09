import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { WeekMediaItem } from "store/slices/week-material/weekMaterialSlice";

interface Props {
  open: boolean;
  onClose: () => void;
  document: WeekMediaItem | null;
}

export default function WeekDocumentModal({ open, onClose, document }: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  if (!document) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: "90vw",
          height: "85vh",
          maxWidth: "90vw",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: theme.palette.primary.main,
          color: "white",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          pr: 2,
        }}
      >
        {document.title}
        <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <iframe
          src={document.url}
          title={document.title}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        />
      </DialogContent>
    </Dialog>
  );
}