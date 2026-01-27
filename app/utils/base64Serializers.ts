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
 * Custom serializer for File type
 * Encodes File as Base64 for React Native compatibility
 */
export const fileSerializer: StandardRPCCustomJsonSerializer = {
  type: 21, // Custom type ID (must be > 20 to avoid conflicts with built-in types)
  condition: (data) => data instanceof File,
  serialize: async (data: File) => {
    const base64 = await blobToBase64(data);
    return {
      name: data.name,
      type: data.type,
      size: data.size,
      lastModified: data.lastModified,
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

/**
 * Custom serializer for Blob type
 * Encodes Blob as Base64 for React Native compatibility
 */
export const blobSerializer: StandardRPCCustomJsonSerializer = {
  type: 22, // Custom type ID (must be > 20 to avoid conflicts with built-in types)
  condition: (data) => data instanceof Blob && !(data instanceof File),
  serialize: async (data: Blob) => {
    const base64 = await blobToBase64(data);
    return {
      type: data.type,
      size: data.size,
      base64,
    };
  },
  deserialize: (data: { type: string; size: number; base64: string }) => {
    return base64ToBlob(data.base64, data.type);
  },
};
