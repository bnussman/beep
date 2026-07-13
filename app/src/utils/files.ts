import { isMobile } from "./constants";
import * as ImagePicker from "expo-image-picker";
import { File } from 'expo-file-system';

export function getFile(
  asset: ImagePicker.ImagePickerAsset,
) {
  if (isMobile) {
    return new File(asset.uri);
  }
  return asset.file!;
}
