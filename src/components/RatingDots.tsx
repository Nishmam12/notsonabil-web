type RatingDotsProps = {
  rating: number;
};

export default function RatingDots({ rating }: RatingDotsProps) {
  const max = 5;
  const filled = Math.round(rating);

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: max }).map((_, index) => (
        <span
          key={`dot-${index}`}
          className={`h-2.5 w-2.5 rounded-full ${
            index < filled ? "bg-orange-500" : "bg-neutral-200"
          }`}
        />
      ))}
      <span className="text-xs font-semibold text-neutral-500">{rating.toFixed(1)}</span>
    </div>
  );
}
