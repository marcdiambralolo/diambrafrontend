'use client';
import { memo, useMemo } from "react";
import { InfoCircleOutlined, NumberOutlined, FontSizeOutlined } from "@ant-design/icons";

interface InfoRowProps {
    label: string;
    value?: string | number | null;
}

const InfoRow: React.FC<InfoRowProps> = memo(({ label, value }) => {

    const icon = useMemo(() => {
        if (typeof value === "number") return <FontSizeOutlined className="text-blue-500" />;
        if (typeof value === "string") return <NumberOutlined className="text-green-500" />;
        return <InfoCircleOutlined className="text-gray-400" />;
    }, [value]);

    return (
        <div className="flex items-center gap-2 text-gray-800 text-sm md:text-base">
            {icon}
            <p><strong className="font-semibold text-gray-900">{label} :</strong> {value ?? "0"}</p>
        </div>
    );
});

InfoRow.displayName = "InfoRow";

export default InfoRow;