const items = Array.from({ length: 6 }).map(
  () => 'Get 10% off on any purchase with "NABIL420" coupon'
);

export default function Marquee() {
  return (
    <div className="w-full bg-neutral-900 py-3 text-xs text-orange-300">
      <div className="marquee">
        <div className="marquee-track">
          {items.map((item, index) => (
            <span key={`a-${index}`} className="flex items-center gap-2">
              <span className="text-orange-400">✶</span>
              {item}
            </span>
          ))}
          {items.map((item, index) => (
            <span key={`b-${index}`} className="flex items-center gap-2">
              <span className="text-orange-400">✶</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
