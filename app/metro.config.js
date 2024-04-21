const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const { withNativeWind } = require('nativewind/metro');

const path = require('path');

const config = getSentryExpoConfig(__dirname);

const workspaceRoot = path.resolve(__dirname, '..');
const projectRoot = __dirname;

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.sourceExts.push("cjs");
config.resolver.sourceExts.push("mjs");

config.resolver.disableHierarchicalLookup = true;

module.exports = withNativeWind(config, { input: path.resolve(__dirname, './global.css') })
