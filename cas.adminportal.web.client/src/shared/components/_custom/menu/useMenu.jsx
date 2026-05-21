import { useState } from "react";

import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuContent,
    DropdownMenuLabel,
} from "@shared/components/ui/dropdown-menu";

import { Button } from "@shared/components/ui/button";
import { Label } from "@shared/components/ui/label";

const useMenu = () => {
    const ViewMenu = ({
        icon,
        label,
        children,
        buttonClass,
        buttonVariant,
        buttonWeight,
        buttonLabel,
        ...props
    }) => {
        return (
            <>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            weight={buttonWeight}
                            variant={buttonVariant}
                            className={buttonClass}
                        >
                            {icon}
                            {buttonLabel && <Label>{buttonLabel}</Label>}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent {...props}>
                        {label && (
                            <>
                                <DropdownMenuLabel>{label}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                            </>
                        )}

                        {children}
                    </DropdownMenuContent>
                </DropdownMenu>
            </>
        );
    };
    return { ViewMenu };
};

export { useMenu };
