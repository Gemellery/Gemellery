import type { LucideIcon } from "lucide-react";

interface Props {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string; 
    onClick: () => void;
}

function ReportCard({
    title,
    description,
    icon: Icon,
    color,
    onClick,
}: Props) {
    return (
        <button
            onClick={onClick}
            className="bg-white border border-gray-200 rounded-xl p-6 
      hover:shadow-md transition-all duration-200 text-left"
        >
            <div className="flex items-center gap-4 mb-3">

                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>

                <h3 className="font-semibold text-gray-800">
                    {title}
                </h3>

            </div>

            <p className="text-sm text-gray-500">
                {description}
            </p>
        </button>
    );
}

export default ReportCard;