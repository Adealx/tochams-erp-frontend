import { ReactNode } from "react";

interface ReportCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: ReactNode;
}

export default function ReportCard({
    title,
    value,
    subtitle,
    icon,
}: ReportCardProps) {

    return (

        <div className="bg-white rounded-xl border shadow-sm p-5">

            <div className="flex justify-between items-start">

                <div>

                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        {value}
                    </h2>

                    {subtitle && (
                        <p className="text-sm text-gray-400 mt-2">
                            {subtitle}
                        </p>
                    )}

                </div>

                {icon && (
                    <div className="text-blue-600">
                        {icon}
                    </div>
                )}

            </div>

        </div>

    );
}