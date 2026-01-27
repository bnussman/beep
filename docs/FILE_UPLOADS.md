# File Upload Support for React Native

This document describes how file uploads are implemented in the Beep App's React Native client using oRPC with Base64 encoding.

## Background

React Native's Fetch API has limitations with binary data like `File` and `Blob` objects. The oRPC library provides a way to work around this by extending the RPC JSON Serializer to encode these types as Base64.

## Implementation

### Custom Serializers

Three custom serializers have been implemented to handle File, Blob, and ReactNativeFile objects:

1. **File Serializer** (`app/utils/base64Serializers.ts` and `orpc/src/utils/base64Serializers.ts`)
   - Encodes File objects as Base64 strings with metadata (name, type, size, lastModified)
   - Type ID: 21

2. **Blob Serializer** (`app/utils/base64Serializers.ts` and `orpc/src/utils/base64Serializers.ts`)
   - Encodes Blob objects as Base64 strings with metadata (type, size)
   - Type ID: 22

3. **ReactNativeFile Serializer** (`app/utils/base64Serializers.ts`)
   - Encodes ReactNativeFile objects (used on React Native mobile) as Base64 with metadata
   - Reads file data from the local URI using fetch
   - Type ID: 21 (same as File, deserializes to File on server)

### Configuration

The custom serializers are configured on both client and server:

**Client** (`app/utils/orpc.ts`):
```typescript
import { fileSerializer, blobSerializer, reactNativeFileSerializer } from './base64Serializers';

const link = new RPCLink({
  url,
  customJsonSerializers: [reactNativeFileSerializer, fileSerializer, blobSerializer],
  // ... other options
});
```

**Server** (`orpc/src/index.ts`):
```typescript
import { fileSerializer, blobSerializer } from "./utils/base64Serializers";

const handler = new RPCHandler(appRouter, {
  customJsonSerializers: [fileSerializer, blobSerializer],
  // ... other options
});
```

## How It Works

1. When a File, Blob, or ReactNativeFile is sent from the React Native client:
   - On mobile, the `ReactNativeFile` serializer converts the file URI to Base64
   - On web, the `File` or `Blob` serializer handles standard browser objects
   - Additional metadata (name, type, size) is preserved
   - The data is sent as JSON

2. When the server receives the request:
   - The serializer converts the Base64 string back to a File or Blob object
   - The original metadata is restored
   - The handler processes it like a normal File/Blob

3. The reverse process happens for responses containing File or Blob objects

## Usage Example

This implementation is used in the signup flow where users upload a profile photo:

```typescript
// In SignUp.tsx
const photo = (await getFile(variables.photo)) as File;
await signup({ ...variables, photo });
```

The `photo` File object is automatically serialized to Base64 when sent to the server, and the server receives it as a proper File object.

## Performance Considerations

- **File Size Limitations**: The Base64 encoding approach loads the entire file into memory. For optimal performance and to avoid memory issues, it's recommended to limit file uploads to a reasonable size (e.g., < 10MB for profile photos).
- **Error Handling**: The serializers include validation and error handling to prevent runtime errors from malformed data.
- **Base64 Overhead**: Base64 encoding increases the payload size by approximately 33%. This is a tradeoff for React Native compatibility.

## References

- [oRPC React Native Adapter Documentation](https://orpc.dev/docs/adapters/react-native)
- [oRPC RPC JSON Serializer Documentation](https://orpc.dev/docs/advanced/rpc-json-serializer)
