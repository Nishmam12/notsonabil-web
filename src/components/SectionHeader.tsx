import { ReactNode } from "react";

type SectionHeaderProps = {
    title: string;
    description?: string;
    children?: ReactNode;
    variant?: "page" | "section";
    className?: string;
};

export default function SectionHeader({
    title,
    description,
    children,
    variant = "page",
    className = "",
}: SectionHeaderProps) {
    const isPage = variant === "page";

    return (
        <div
            className={`rounded-[28px] border border-neutral-200 bg-white px-6 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.08)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_30px_70px_rgba(0,0,0,0.4)] sm:px-8 sm:py-10 ${className}`}
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex-1">
                    <h1
                        className={`${isPage ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
                            } font-semibold text-neutral-900 dark:text-neutral-100`}
                    >
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                            {description}
                        </p>
                    )}
                </div>
                {children && <div className="flex shrink-0 items-center gap-3">{children}</div>}
            </div>
        </div>
    );
}
