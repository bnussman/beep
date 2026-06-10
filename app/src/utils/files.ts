import { isMobile } from "./constants";
import * as ImagePicker from "expo-image-picker";

export async function getFile(
  asset: ImagePicker.ImagePickerAsset,
): Promise<File> {
  if (isMobile) {
    const { File } = await import("expo-file-system");
    return new File(asset.uri) as unknown as File;
  }
  return asset.file!;
}
