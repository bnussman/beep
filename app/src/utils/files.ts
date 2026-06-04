import { isMobile } from "./constants";
import * as ImagePicker from "expo-image-picker";

export class ReactNativeFile {
  uri: string;
  name: string;
  type: string;

  constructor({ uri, name, type }: { uri: string, name: string, type: string }) {
    this.uri = uri;
    this.name = name;
    this.type = type;
  }
}


export async function getFile(asset: ImagePicker.ImagePickerAsset): Promise<Blob | ReactNativeFile> {
  if (isMobile) {
    return new ReactNativeFile({ name: asset.fileName ?? asset.uri, uri: asset.uri, type: asset.mimeType ?? "image/jpeg" });
  }
  const res = await fetch(asset.uri);
  const blob = await res.blob();
  const fileType = blob.type.split("/")[1];
  const file = new File([blob], "photo." + fileType);
  return file;
}