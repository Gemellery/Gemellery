import { Plus, Gem } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmptyStateProps {
    title: string;
    description: string;
    ctaLabel: string;
    ctaLink: string;
}

export default function EmptyState({
    title,
    description,
    ctaLabel,
    ctaLink,
}: EmptyStateProps) {
    const navigate = useNavigate();

    return (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-6 rounded-full bg-[#f8f0d9] p-6">
                <Gem className="h-10 w-10 text-[#1F7A73]" />
            </div>

            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
                {description}
            </p>

            <button
                onClick={() => navigate(ctaLink)}
                className="mt-6 flex items-center gap-2 rounded-full bg-[#1F7A73] px-6 py-3 text-white font-semibold shadow hover:scale-105 transition"
            >
                <Plus size={18} />
                {ctaLabel}
            </button>
        </div>
    );
}
