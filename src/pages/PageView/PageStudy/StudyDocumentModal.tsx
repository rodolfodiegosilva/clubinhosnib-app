import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    useMediaQuery,
    useTheme,
  } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  import { StudyMediaItem } from "store/slices/study-material/studyMaterialSlice";
  
  interface Props {
    open: boolean;
    onClose: () => void;
    document: StudyMediaItem | null;
  }
  
  export default function StudyDocumentModal({ open, onClose, document }: Props) {
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
            width: "95vw",        // 95% da largura da viewport
            height: "90vh",       // altura ajustada para boa visualização
            maxWidth: "95vw",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 2,
          }}
        >
          {document.title}
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
  
        <DialogContent dividers sx={{ p: 0 }}>
          <iframe
            src={document.url}
            title={document.title}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }
  