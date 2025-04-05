import { WeekMediaItem } from "store/slices/week-material/weekMaterialSlice";

export function validateMediaURL(url: string, platform?: "youtube" | "googledrive" | "onedrive" | "dropbox" | "ANY"): boolean {
  if (!url || !platform) return false;

  switch (platform) {
    case "youtube":
      return url.includes("youtube.com") || url.includes("youtu.be");
    case "googledrive":
      return url.includes("drive.google.com");
    case "onedrive":
      return url.includes("onedrive.live.com") || url.includes("1drv.ms");
    case "dropbox":
      return url.includes("dropbox.com");
    case "ANY":
      return true; // Accept any URL when platform is "ANY"
    default:
      return false;
  }
}
