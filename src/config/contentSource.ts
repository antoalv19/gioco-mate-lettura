export const contentSourceConfig = {
  mode: 'local' as 'local' | 'remote',
  localBaseUrl: import.meta.env.BASE_URL,
  remoteBaseUrl: 'https://raw.githubusercontent.com/USERNAME/REPOSITORY/main/content/',
  fallbackToLocal: true,
};
