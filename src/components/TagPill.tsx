type TagPillProps = {
  text: string;
};

export default function TagPill({ text }: TagPillProps) {
  return (
    <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
      {text}
    </span>
  );
}
