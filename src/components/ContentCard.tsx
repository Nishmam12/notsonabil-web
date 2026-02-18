import Image from "next/image";
import { ReactNode } from "react";

type ContentCardProps = {
    href: string;
    image: string;
    title: string;
    description?: string;
    tags?: ReactNode;
    footer?: ReactNode;
    className?: string;
};

export default function ContentCard({
    href,
    image,
    title,
    description,
    tags,
    footer,
    className = "",
}: ContentCardProps) {
    return (
        <a
            href={href}
            className={`block overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)] ${className}`}
        >
            <div className="aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                    className="h-full w-full object-cover"
                    src={image}
                    alt={title}
                    width={800}
                    height={600}
                    unoptimized
                />
            </div>
            <div className="mt-4 space-y-3">
                {tags && <div className="flex flex-wrap items-center gap-2">{tags}</div>}
                <div>
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                        {title}
                    </h3>
                    {description && (
                        <p className="mt-1 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-300">
                            {description}
                        </p>
                    )}
                </div>
                {footer && <div className="pt-1">{footer}</div>}
            </div>
        </a>
    );
}
