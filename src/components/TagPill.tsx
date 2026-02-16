type TagPillProps = {
  text: string;
};

export default function TagPill({ text }: TagPillProps) {
  return (
    <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-500 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-300">
      {text}
    </span>
  );
}
