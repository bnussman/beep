import * as pulumi from "@pulumi/pulumi";
import * as linode from "@pulumi/linode";
import * as docker from "@pulumi/docker";
import * as k8s from "@pulumi/kubernetes";
import * as selfSignedCert from "@pulumi/tls-self-signed-cert";

const env = process.env.secrets ? JSON.parse(process.env.secrets) : {};
const ACTOR = process.env.ACTOR;

const envName = pulumi.getStack();

const linodeProvider = new linode.Provider("linodeProvider", {
  token: env.LINODE_TOKEN,
});

const apiImageName = `ghcr.io/bnussman/api:${envName === 'staging' ? 'main' : envName}`;

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

const lkeCluster = new linode.LkeCluster(
  "cluster",
  {
    region: "us-southeast",
    k8sVersion: "1.30",
    controlPlane: {
      highAvailability: envName === "production",
    },
    label: envName,
    pools: [
      {
        type: 'g6-standard-1',
        count: 3,
      }
    ],
  },
  { provider: linodeProvider }
);

const namespaceName = "beep";
const apiAppName = "api";

const k8sProvider = new k8s.Provider("k8sProvider", {
  kubeconfig: lkeCluster.kubeconfig.apply(x => Buffer.from(x, 'base64').toString()),
});

const namespace = new k8s.core.v1.Namespace(namespaceName, {
  metadata:
    {
      name: namespaceName,
      labels: { name: namespaceName }
    }
  },
  { provider: k8sProvider }
);

const apiDeployment = new k8s.apps.v1.Deployment(
  apiAppName,
  {
    metadata: {
      name: apiAppName,
      namespace: namespace.metadata.name,
      labels: { app: apiAppName }
    },
    spec: {
      selector: { matchLabels: { app: apiAppName } },
      replicas: 10,
      template: {
        metadata: { labels: { app: apiAppName } },
        spec: {
          containers: [
            {
              name: apiAppName,
              image: apiImageResource.repoDigest,
              imagePullPolicy: "Always",
              ports: [
                { containerPort: 3000 }
              ],
              envFrom: [
                { configMapRef: { name: apiAppName }}
              ]
            }
          ]
        }
      }
    }
  },
  { provider: k8sProvider }
);

const cert = new selfSignedCert.SelfSignedCertificate("cert", {
  dnsName: "api.dev.ridebeep.app",
  validityPeriodHours: 807660,
  localValidityPeriodHours: 17520,
  subject: {
    commonName: "beep-api-cert",
    organization: "Ride Beep App",
  },
});

const secret = new k8s.core.v1.Secret(
  apiAppName,
  {
    metadata: { name: "cert", namespace: namespace.metadata.name },
    type: "kubernetes.io/tls",
    stringData: {
      ['tls.crt']: cert.pem,
      ['tls.key']: cert.privateKey
    },
  },
  { provider: k8sProvider }
);

const apiService = new k8s.core.v1.Service(
  apiAppName,
  {
    metadata: {
      name: apiAppName,
      namespace: namespaceName,
      annotations: {
        ['service.beta.kubernetes.io/linode-loadbalancer-default-protocol']: 'https',
        ['service.beta.kubernetes.io/linode-loadbalancer-check-type']: 'connection',
        ['service.beta.kubernetes.io/linode-loadbalancer-port-443']: '{ "tls-secret-name": "cert", "protocol": "https" }'
      }
    },
    spec: {
      type: "LoadBalancer",
      ports: [{ port: 443, targetPort: 3000 }],
      selector: { app: apiAppName }
    }
  },
  { provider: k8sProvider }
);

const redisDeployment = new k8s.apps.v1.Deployment(
  "redis",
  {
    metadata: {
      name: "redis",
      namespace: namespace.metadata.name,
      labels: { app: "redis" }
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
              ports: [
                { containerPort: 6379 }
              ],
            }
          ]
        }
      }
    }
  },
  { provider: k8sProvider }
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
      selector: { app: "redis" }
    }
  },
  { provider: k8sProvider }
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
    },
  },
  { provider: k8sProvider }
);

export const clusterLabel = lkeCluster.label;

export const apiIp = apiService.status.loadBalancer.apply((lb) => lb.ingress[0].ip || lb.ingress[0].hostname);
