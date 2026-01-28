import type { StandardRPCCustomJsonSerializer } from '@orpc/client/standard';

/**
 * Convert a Blob to a Base64 string
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert a Base64 string to a Blob
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Check if data looks like a file (File instance or ReactNativeFile with uri)
 */
function isFileOrReactNativeFile(data: any): boolean {
  if (data instanceof File) return true;
  // Check for ReactNativeFile (has uri, name, type properties)
  return data && typeof data === 'object' && 'uri' in data && 'name' in data && 'type' in data;
}

/**
 * Custom serializer for File type (handles both File and ReactNativeFile)
 * Encodes as Base64 for React Native compatibility
 */
export const fileSerializer: StandardRPCCustomJsonSerializer = {
  type: 21,
  condition: isFileOrReactNativeFile,
  serialize: async (data: File | any) => {
    let blob: Blob;
    
    // If it's a ReactNativeFile (has uri property), fetch the file
    if ('uri' in data && typeof data.uri === 'string') {
      const response = await fetch(data.uri);
      blob = await response.blob();
    } else {
      // It's a regular File/Blob
      blob = data;
    }
    
    const base64 = await blobToBase64(blob);
    return {
      name: data.name,
      type: data.type,
      size: blob.size,
      lastModified: data.lastModified || Date.now(),
      base64,
    };
  },
  deserialize: (data: {
    name: string;
    type: string;
    size: number;
    lastModified: number;
    base64: string;
  }) => {
    const blob = base64ToBlob(data.base64, data.type);
    return new File([blob], data.name, {
      type: data.type,
      lastModified: data.lastModified,
    });
  },
};
