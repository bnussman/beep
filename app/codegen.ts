import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3000/graphql",
  documents: ["./**/*.tsx", "./utils/*.ts"],
  generates: {
    "generated/graphql.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        apolloReactHooksImportFrom: "@apollo/client",
        apolloReactCommonImportFrom: "@apollo/client",
        gqlImport: "@apollo/client#gql",
      },
    },
  },
};

export default config;
