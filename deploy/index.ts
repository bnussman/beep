import * as pulumi from "@pulumi/pulumi";
import * as docker from "@pulumi/docker";
import * as k8s from "@pulumi/kubernetes";

const env = process.env.secrets ? JSON.parse(process.env.secrets) : {};
const ACTOR = process.env.ACTOR;
const envName = pulumi.getStack();
const namespaceName = `beep-${envName}`;
const apiAppName = "api";
const apiImageName = `ghcr.io/bnussman/api:${envName}`;
const isProduction = envName === "production";
const API_PORT = 3000;

const k8sProvider = new k8s.Provider("k8sProvider", {
  kubeconfig: pulumi.secret(process.env.KUBECONFIG),
});

const image = new docker.Image("apiImageResource", {
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
      ports: [{ port: API_PORT, targetPort: API_PORT }],
      selector: { app: apiAppName },
    },
  },
  { provider: k8sProvider },
);

const apiHttp = {
  paths: [
    {
      path: "/",
      pathType: "Prefix",
      backend: {
        service: {
          name: apiAppName,
          port: { number: API_PORT },
        },
      },
    },
  ],
};

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
          host:
            isProduction
              ? "orpc.ridebeep.app"
              : "orpc.dev.ridebeep.app",
          http: apiHttp,
        },
        {
          host:
            isProduction
              ? "api.ridebeep.app"
              : "api.dev.ridebeep.app",
          http: apiHttp,
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

const secret = new k8s.core.v1.Secret(
  "api-secret",
  {
    metadata: {
      name: "api-secret",
      namespace: namespaceName,
    },
    stringData: {
      ...env,
      REDIS_HOST: `redis.${namespaceName}`,
    },
    type: "Opaque",
  },
  { provider: k8sProvider },
);

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
      replicas: isProduction ? 3 : 1,
      template: {
        metadata: { labels: { app: apiAppName } },
        spec: {
          containers: [
            {
              name: apiAppName,
              image: image.repoDigest,
              imagePullPolicy: "Always",
              ports: [{ containerPort: API_PORT }],
              envFrom: [{ secretRef: { name: "api-secret" } }],
            },
          ],
        },
      },
    },
  },
  { provider: k8sProvider },
);
