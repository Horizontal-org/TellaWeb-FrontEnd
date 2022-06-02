export const toRemoteConfiguration = (config: any) => ({
  ...config,
  camouflage: JSON.parse(config.camouflage),
  crashReports: JSON.parse(config.crashReports),
  createdAt: new Date(config.createdAt),
});
