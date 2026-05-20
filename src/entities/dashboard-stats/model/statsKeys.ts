export const statsKeys = {
  all: ['dashboard-stats'] as const,
  stats: () => [...statsKeys.all, 'overview'] as const,
};
