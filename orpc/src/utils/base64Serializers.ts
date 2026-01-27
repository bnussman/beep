import type { StandardRPCCustomJsonSerializer } from '@orpc/server/standard';

/**
 * Convert a Blob to a Base64 string
 */
async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert a Base64 string to a Blob
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
  try {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  } catch (error) {
    console.error('Failed to decode base64 string:', error);
    throw new Error('Invalid base64 string for Blob deserialization');
  }
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
    // Validate incoming data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data for File deserialization: expected object');
    }
    if (typeof data.name !== 'string') {
      throw new Error('Invalid data for File deserialization: name must be a string');
    }
    if (typeof data.type !== 'string') {
      throw new Error('Invalid data for File deserialization: type must be a string');
    }
    if (typeof data.base64 !== 'string') {
      throw new Error('Invalid data for File deserialization: base64 must be a string');
    }

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
    // Validate incoming data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data for Blob deserialization: expected object');
    }
    if (typeof data.type !== 'string') {
      throw new Error('Invalid data for Blob deserialization: type must be a string');
    }
    if (typeof data.base64 !== 'string') {
      throw new Error('Invalid data for Blob deserialization: base64 must be a string');
    }

    return base64ToBlob(data.base64, data.type);
  },
};
