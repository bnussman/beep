import type { StandardRPCCustomJsonSerializer } from '@orpc/client/standard';
import { ReactNativeFile } from './files';

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
 * Convert a ReactNativeFile URI to Base64 string
 */
async function reactNativeFileToBase64(file: ReactNativeFile): Promise<string> {
  try {
    // Use fetch to read the file from the URI
    const response = await fetch(file.uri);
    if (!response.ok) {
      throw new Error(`Failed to fetch file from URI: ${response.statusText}`);
    }
    const blob = await response.blob();
    return blobToBase64(blob);
  } catch (error) {
    console.error('Failed to read ReactNativeFile:', error);
    throw new Error(`Failed to read file from URI ${file.uri}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
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

/**
 * Custom serializer for ReactNativeFile type
 * Encodes ReactNativeFile as Base64 for React Native compatibility
 * This is used when File/Blob are not available (React Native mobile)
 */
export const reactNativeFileSerializer: StandardRPCCustomJsonSerializer = {
  type: 21, // Use same type as File since it should deserialize to File on server
  condition: (data) => data instanceof ReactNativeFile,
  serialize: async (data: ReactNativeFile) => {
    const base64 = await reactNativeFileToBase64(data);
    return {
      name: data.name,
      type: data.type,
      size: 0, // Size not available from ReactNativeFile
      lastModified: Date.now(),
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
    // Validate incoming data structure (same as fileSerializer)
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
