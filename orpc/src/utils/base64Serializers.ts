import type { StandardRPCCustomJsonSerializer } from '@orpc/server/standard';

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
 * Deserializes Base64 to File
 */
export const fileSerializer: StandardRPCCustomJsonSerializer = {
  type: 21,
  condition: (data) => data instanceof File,
  serialize: async (data: File) => {
    // Server shouldn't need to serialize, but implement for completeness
    const buffer = await data.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    
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
