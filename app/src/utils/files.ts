import { isMobile } from "./constants";
import * as ImagePicker from "expo-image-picker";
import { File } from 'expo-file-system';

export async function getFile(
  asset: ImagePicker.ImagePickerAsset,
): Promise<File> {
  if (isMobile) {
    return new File(asset.uri);
  }
  return asset.file! as unknown as File;
}
