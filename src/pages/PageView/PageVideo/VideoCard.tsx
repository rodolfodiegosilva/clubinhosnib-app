import { Card, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import VideoPlayer from "./VideoPlayer";
import { VideoItem } from "store/slices/video/videoSlice";
interface Props {
  video: VideoItem;
  isSmall: boolean;
}

const VideoCard = ({ video, isSmall }: Props) => {
  return (
    <Card sx={{ p: isSmall ? 2 : 4, boxShadow: 3, borderRadius: 4 }}>
      <Grid
        container
        spacing={4}
        direction={isSmall ? "column" : "row"}
        alignItems="center"
      >
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            {video.title}
          </Typography>
          <Typography variant="body2">{video.description}</Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <VideoPlayer video={video} />
        </Grid>
      </Grid>
    </Card>
  );
};

export default VideoCard;
