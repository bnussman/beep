import * as pulumi from "@pulumi/pulumi";
import * as linode from "@pulumi/linode";
import * as docker from "@pulumi/docker";
import * as k8s from "@pulumi/kubernetes";
import * as selfSignedCert from "@pulumi/tls-self-signed-cert";

const env = process.env.secrets ? JSON.parse(process.env.secrets) : {};
const ACTOR = process.env.ACTOR;

const envName = pulumi.getStack();

const namespaceName = "beep";
const apiAppName = "api";
const apiImageName = `ghcr.io/bnussman/api:${envName === "staging" ? "main" : envName}`;

const apiImageResource = new docker.Image("apiImageResource", {
  imageName: apiImageName,
  build: {
    context: "../api",
    dockerfile: "../api/Dockerfile",
  },
  registry: {
    password: process.env.GITHUB_TOKEN,
    server: "ghcr.io",
    username: ACTOR,
  },
});

const k8sProvider = new k8s.Provider("k8sProvider", {
  kubeconfig: env.KUBECONFIG,
});

const namespace = new k8s.core.v1.Namespace(
  namespaceName,
  {
    metadata: {
      name: namespaceName,
      labels: { name: namespaceName },
    },
  },
  { provider: k8sProvider },
);

const apiService = new k8s.core.v1.Service(
  apiAppName,
  {
    metadata: {
      name: apiAppName,
      namespace: namespaceName,
    },
    spec: {
      type: "ClusterIP",
      ports: [{ port: 3000 }],
      selector: { app: apiAppName },
    },
  },
  { provider: k8sProvider },
);

const apiIngress = new k8s.networking.v1.Ingress(
  "api-ingress",
  {
    metadata: {
      name: "api-ingress",
      namespace: namespaceName,
    },
    spec: {
      rules: [
        {
          host: "api.dev.ridebeep.app",
          http: {
            paths: [
              {
                path: "/",
                pathType: "Prefix",
                backend: {
                  service: {
                    name: apiAppName,
                    port: { number: 3000 },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
  { provider: k8sProvider },
);

const redisDeployment = new k8s.apps.v1.Deployment(
  "redis",
  {
    metadata: {
      name: "redis",
      namespace: namespace.metadata.name,
      labels: { app: "redis" },
    },
    spec: {
      selector: { matchLabels: { app: "redis" } },
      replicas: 1,
      template: {
        metadata: { labels: { app: "redis" } },
        spec: {
          containers: [
            {
              name: "redis",
              image: "redis:latest",
              ports: [{ containerPort: 6379 }],
            },
          ],
        },
      },
    },
  },
  { provider: k8sProvider },
);

const redisService = new k8s.core.v1.Service(
  "redis",
  {
    metadata: {
      name: "redis",
      namespace: namespaceName,
    },
    spec: {
      type: "ClusterIP",
      ports: [{ port: 6379 }],
      selector: { app: "redis" },
    },
  },
  { provider: k8sProvider },
);

const db = new k8s.apiextensions.CustomResource(
  "db",
  {
    apiVersion: "postgresql.cnpg.io/v1",
    kind: "Cluster",
    metadata: {
      name: "db",
      namespace: namespaceName,
      labels: { app: "db" },
    },
    spec: {
      instances: 3,
      primaryUpdateStrategy: "unsupervised",

      // Persistent storage configuration
      storage: {
        storageClass: "local-path",
        size: "25Gi",
      },
    },
  },
  { provider: k8sProvider },
);

// const dbService = new k8s.core.v1.Service(
//   "db",
//   {
//     metadata: {
//       name: "db",
//       namespace: namespaceName,
//     },
//     spec: {
//       type: "ClusterIP",
//       ports: [{ port: 5432 }],
//       selector: { app: "db" },
//     },
//   },
//   { provider: k8sProvider },
// );

const apiDeployment = new k8s.apps.v1.Deployment(
  apiAppName,
  {
    metadata: {
      name: apiAppName,
      namespace: namespace.metadata.name,
      labels: { app: apiAppName },
    },
    spec: {
      selector: { matchLabels: { app: apiAppName } },
      replicas: 4,
      template: {
        metadata: { labels: { app: apiAppName } },
        spec: {
          containers: [
            {
              name: apiAppName,
              image: apiImageResource.repoDigest,
              imagePullPolicy: "Always",
              ports: [{ containerPort: 3000 }],
              env: [
                {
                  name: "DB_HOST",
                  valueFrom: {
                    secretKeyRef: {
                      name: "db-app",
                      key: "host",
                    },
                  },
                },
                {
                  name: "DB_DATABASE",
                  valueFrom: {
                    secretKeyRef: {
                      name: "db-app",
                      key: "dbname",
                    },
                  },
                },
                {
                  name: "DB_USER",
                  valueFrom: {
                    secretKeyRef: {
                      name: "db-app",
                      key: "user",
                    },
                  },
                },
                {
                  name: "DB_PASSWORD",
                  valueFrom: {
                    secretKeyRef: {
                      name: "db-app",
                      key: "password",
                    },
                  },
                },
              ],
              envFrom: [{ configMapRef: { name: apiAppName } }],
            },
          ],
        },
      },
    },
  },
  { provider: k8sProvider },
);

const config = new k8s.core.v1.ConfigMap(
  apiAppName,
  {
    metadata: {
      name: apiAppName,
      namespace: namespaceName,
    },
    data: {
      ...env,
      REDIS_HOST: "redis.beep",
      DB_HOST: "db.beep",
    },
  },
  { provider: k8sProvider },
);
