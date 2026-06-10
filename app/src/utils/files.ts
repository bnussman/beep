import { isMobile } from "./constants";
import * as ImagePicker from "expo-image-picker";

export async function getFile(
  asset: ImagePicker.ImagePickerAsset,
): Promise<Blob | File> {
  if (isMobile) {
    const { File } = await import("expo-file-system");
    return new File(asset.uri) as unknown as File;
  }
  const res = await fetch(asset.uri);
  const blob = await res.blob();
  const fileType = blob.type.split("/")[1];
  const file = new File([blob], "photo." + fileType);
  return file;
}
