export const rankingWeights = {
  latency: 0.5,
  accuracy: 0.3,
  pollingRate: 0.2,
};

export const computeRankingScore = (latency: number, accuracy: number, pollingRate: number) => {
  const safeLatency = latency > 0 ? latency : 1;
  const inverseLatency = 1 / safeLatency;
  return (
    rankingWeights.latency * inverseLatency +
    rankingWeights.accuracy * accuracy +
    rankingWeights.pollingRate * pollingRate
  );
};
