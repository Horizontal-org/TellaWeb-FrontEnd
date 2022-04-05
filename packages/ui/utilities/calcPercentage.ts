export const calcPercentage = (partial: number, total: number) => {
  if (total === 0) return 0;
  return (partial / total) * 100 || 0;
};
