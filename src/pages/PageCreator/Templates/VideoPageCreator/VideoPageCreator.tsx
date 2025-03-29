import {
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../../config/axiosConfig";
import { AppDispatch, RootState } from "../../../../store/slices";
import { fetchRoutes } from "../../../../store/slices/route/routeSlice";
import {
  clearVideoData,
  VideoItem,
} from "../../../../store/slices/video/videoSlice";
import VideoForm from "./VideoForm";
import VideoList from "./VideoList";

interface VideosProps {
  fromTemplatePage?: boolean;
}

export default function VideoPageCreator({ fromTemplatePage }: VideosProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const videoData = useSelector((state: RootState) => state.video.videoData);

  const [pageTitle, setPageTitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [newVideo, setNewVideo] = useState<VideoItem>({
    id: Date.now().toString(),
    title: "",
    description: "",
    type: "link",
    platform: "youtube",
    url: "",
  });
  const [errors, setErrors] = useState({
    pageTitle: false,
    pageDescription: false,
    newVideoTitle: false,
    newVideoDescription: false,
    newVideoSrc: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fromTemplatePage) {
      dispatch(clearVideoData());
      setPageTitle("");
      setPageDescription("");
      setVideos([]);
    }
  }, [fromTemplatePage, dispatch]);

  useEffect(() => {
    if (!fromTemplatePage && videoData) {
      setPageTitle(videoData.name);
      setPageDescription(videoData.description);
      setVideos(videoData.videos);
    }
  }, [fromTemplatePage, videoData]);

 /* useEffect(() => {
    return () => {
      if (!fromTemplatePage) {
       dispatch(clearVideoData());
      }
    };
  }, [fromTemplatePage, dispatch]);*/

  const handleAddVideo = () => {
    const hasError = !newVideo.title || !newVideo.description || !newVideo.url;
    setErrors((prev) => ({
      ...prev,
      newVideoTitle: !newVideo.title,
      newVideoDescription: !newVideo.description,
      newVideoSrc: !newVideo.url,
    }));
    if (hasError) return;

    setVideos([...videos, newVideo]);
    setNewVideo({
      id: Date.now().toString(),
      title: "",
      description: "",
      type: "link",
      platform: "youtube",
      url: "",
    });
  };

  const handleRemoveVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setNewVideo((prev) => ({
        ...prev,
        url: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSavePage = async () => {
    const pageHasError = !pageTitle || !pageDescription || videos.length === 0;
    const hasInvalidVideos = videos.some(
      (video) => !video.title || !video.description || !video.url
    );

    setErrors((prev) => ({
      ...prev,
      pageTitle: !pageTitle,
      pageDescription: !pageDescription,
    }));

    if (pageHasError || hasInvalidVideos) return;

    setLoading(true);

    try {
      const formData = new FormData();

      const itemsPayload = videos.map((video, index) => {
        if (video.type === "upload" && video.url.startsWith("data:")) {
          const byteString = atob(video.url.split(",")[1]);
          const mimeString = video.url.split(",")[0].split(":")[1].split(";")[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });
          const filename = `video_${index}.mp4`;
          formData.append(`video_${index}`, blob, filename);
          return { ...video, srcField: `video_${index}` };
        }
        return { ...video, srcField: video.url };
      });

      const payload = {
        id: fromTemplatePage ? undefined : videoData?.id,
        pageTitle,
        pageDescription,
        videos: itemsPayload.map((v) => ({
          id: fromTemplatePage ? undefined: v.id,
          title: v.title,
          description: v.description,
          type: v.type,
          platform: v.platform,
          url: v.type === "upload" ? undefined : v.srcField,
          fileField: v.type === "upload" ? v.srcField : undefined,
        })),
      };

      formData.append("videosPageData", JSON.stringify(payload));

      const response = fromTemplatePage
        ? await api.post("/videos-page", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await api.patch(`/videos-page/${videoData?.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      await dispatch(fetchRoutes());
      navigate(`/${response.data.route.path}`);
    } catch (err) {
      console.error("Erro ao salvar página", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 0,
        mt: fromTemplatePage ? 0 : 11,
        width: { xs: "95%", md: "100%" },
        maxWidth: 1000,
        mx: "auto",
      }}
    >
      <Typography
        variant="h4"
        mb={3}
        fontWeight="bold"
        sx={{
          width: "100%",
          fontSize: {
            xs: "1.6rem",
            sm: "2rem",
            md: "2.25rem",
          },
          textAlign: "center",
        }}
      >
        {fromTemplatePage ? "Criar Galeria de Vídeos" : "Editar Galeria de Vídeos"}
      </Typography>

      <VideoForm
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        newVideo={newVideo}
        errors={errors}
        setPageTitle={setPageTitle}
        setPageDescription={setPageDescription}
        setNewVideo={setNewVideo}
        handleUploadFile={handleUploadFile}
        handleAddVideo={handleAddVideo}
      />

      <VideoList videos={videos} handleRemoveVideo={handleRemoveVideo} />

      <Box textAlign="center" mt={6}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSavePage}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? "Salvando..." : "Salvar Página"}
        </Button>
      </Box>
    </Box>
  );
}