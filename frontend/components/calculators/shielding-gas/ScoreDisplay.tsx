type ScoreDisplayProps = {
  score: number;
};

function clampScore(score: number): number {
  if (!Number.isFinite(score) || score <= 0) return 0;
  return Math.min(5, Math.max(1, score));
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const clamped = clampScore(score);
  if (clamped <= 0) return null;

  const fullCount = Math.floor(clamped);
  const hasHalf = Math.round((clamped - fullCount) * 10) >= 5;
  const numberText =
    clamped % 1 === 0 ? clamped.toFixed(0) : clamped.toFixed(1);

  return (
    <span className="inline-flex items-center gap-1 text-emerald-500">
      {Array.from({ length: fullCount }, (_, i) => (
        <span key={`full-${i}`} className="sg-score-icon" aria-hidden="true">
          ▲
        </span>
      ))}
      {hasHalf && (
        <span className="sg-score-icon sg-score-icon-half" aria-hidden="true">
          ▲
        </span>
      )}
      <span className="ml-1 text-sm font-medium text-foreground">
        {numberText}
      </span>
    </span>
  );
}
