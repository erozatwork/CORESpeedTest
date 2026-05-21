import React from "react";

import { XCircle } from "@phosphor-icons/react";
import { Controller, useFormContext } from "react-hook-form";

import { Button } from "@shared/components/ui/button";

export default function RHFCard({
    name,
    onClick,
    title,
    description,
    children,
}) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <>
                    <div onClick={onClick} className="text-center m-auto">
                        <div
                            className={`flex items-center justify-center card p-4 w-64 h-32 bg-white  hover:shadow-lg transition shadow-md rounded-xl ${
                                error ? "border-red-500" : ""
                            }`}
                            {...field}
                        >
                            {children ? (
                                <>{children}</>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center w-full">
                                        <span className="text-sm font-semibold">
                                            {title}
                                        </span>
                                        <Button
                                            className="w-6 h-6 p-0 text-gray-500"
                                            onClick={onClick}
                                            aria-label="Remove"
                                            variant="ghost"
                                        >
                                            <XCircle size={16} />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-start text-gray-600 mt-2">
                                        {description}
                                    </p>
                                </>
                            )}
                        </div>

                        {error && (
                            <p className="text-xs text-red-600 mt-1">
                                {error.message}
                            </p>
                        )}
                    </div>
                </>
            )}
        />
    );
}
