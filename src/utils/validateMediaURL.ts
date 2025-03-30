import { StudyMediaItem } from "store/slices/study-material/studyMaterialSlice";

export function validateMediaURL(url: string, platform?: StudyMediaItem["platform"]): boolean {
  if (!url || !platform) return false;

  switch (platform) {
    case "google-drive":
      return url.includes("drive.google.com");
    case "onedrive":
      return url.includes("onedrive.live.com") || url.includes("1drv.ms");
    case "dropbox":
      return url.includes("dropbox.com");
    case "youtube":
      return url.includes("youtube.com") || url.includes("youtu.be");
    default:
      return true;
  }
}
