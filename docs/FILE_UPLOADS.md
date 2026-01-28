# File Upload Support for React Native

This document describes how file uploads are implemented in the Beep App's React Native client using oRPC with Base64 encoding.

## Background

React Native's Fetch API has limitations with binary data like `File` and `Blob` objects. The oRPC library provides a way to work around this by extending the RPC JSON Serializer to encode these types as Base64.

## Implementation

### Custom Serializer

A single custom serializer handles both regular File objects and ReactNativeFile objects:

**File Serializer** (`app/utils/base64Serializers.ts` and `orpc/src/utils/base64Serializers.ts`)
- Client: Encodes File/ReactNativeFile objects as Base64 strings with metadata
- Server: Decodes Base64 strings back to File objects
- Type ID: 21

The serializer automatically detects ReactNativeFile objects (which have a `uri` property) and reads the file data from the local filesystem.

### Configuration

**Client** (`app/utils/orpc.ts`):
```typescript
import { fileSerializer } from './base64Serializers';

const link = new RPCLink({
  url,
  customJsonSerializers: [fileSerializer],
  // ... other options
});
```

**Server** (`orpc/src/index.ts`):
```typescript
import { fileSerializer } from "./utils/base64Serializers";

const handler = new RPCHandler(appRouter, {
  customJsonSerializers: [fileSerializer],
  // ... other options
});
```

## How It Works

1. When a File or ReactNativeFile is sent from the client:
   - The serializer detects if it's a ReactNativeFile (has `uri` property)
   - If ReactNativeFile: fetches the file data from the URI
   - If File: uses the file directly
   - Converts to Base64 with metadata (name, type, size, lastModified)
   - Sends as JSON

2. When the server receives the request:
   - The serializer converts Base64 back to a File object
   - The handler processes it like a normal File

## Usage Example

File uploads work automatically without code changes:

```typescript
// In SignUp.tsx
const photo = (await getFile(variables.photo)) as File;
await signup({ ...variables, photo });
```

The serializer handles both web File objects and mobile ReactNativeFile objects transparently.

## Performance Considerations

- **File Size**: Base64 encoding increases payload size by ~33%. Recommended for files < 10MB.
- **Memory**: The entire file is loaded into memory during encoding.

## References

- [oRPC React Native Adapter Documentation](https://orpc.dev/docs/adapters/react-native)
- [oRPC RPC JSON Serializer Documentation](https://orpc.dev/docs/advanced/rpc-json-serializer)
