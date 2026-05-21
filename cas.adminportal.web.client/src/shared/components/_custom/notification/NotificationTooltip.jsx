import { useRef, useState, useEffect } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@shared/components/ui/tooltip";

const NotificationTooltip = ({ text }) => {
    const ref = useRef(null);
    const [isClamped, setIsClamped] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const isOverflowing = el.scrollHeight > el.clientHeight + 1;
        setIsClamped(isOverflowing);
    }, [text]);

    const textSpan = (
        <span
            ref={ref}
            className="text-sm cursor-default line-clamp-1 max-w-xs overflow-hidden"
        >
            {text}
        </span>
    );

    if (!isClamped) return textSpan;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{textSpan}</TooltipTrigger>
                <TooltipContent side="top" className="max-w-sm break-words">
                    {text}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export { NotificationTooltip };
