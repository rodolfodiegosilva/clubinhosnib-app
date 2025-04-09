import { Card, Grid, Typography, useTheme } from "@mui/material";
import VideoPlayer from "./VideoPlayer";
import { VideoItem } from "store/slices/video/videoSlice";

interface Props {
  video: VideoItem;
  isSmall: boolean;
}

const VideoCard = ({ video, isSmall }: Props) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: isSmall ? 2 : 4,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        borderRadius: 3,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
        },
        backgroundColor: "#fff",
      }}
    >
      <Grid container spacing={4} direction={isSmall ? "column" : "row"} alignItems="center">
        <Grid item xs={12} md={4}>
          <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
            {video.title}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {video.description}
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <VideoPlayer video={video} />
        </Grid>
      </Grid>
    </Card>
  );
};

export default VideoCard;