import { AsteriskSimple } from "@phosphor-icons/react";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Editor } from "../editor/Editor";

import { Label } from "@shared/components/ui/label";

export default function RHFEditor({
    name,
    label,
    placeholder = "Write something awesome...",
    ...props
}) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <>
                    {label && (
                        <Label className="text-sm inline-flex items-center gap-0">
                            <span>{label}</span>
                            <AsteriskSimple
                                size={10}
                                weight="duotone"
                                className="text-red-700 ml-0.5"
                            />
                        </Label>
                    )}
                    <div
                        className={`${
                            error ? "border rounded border-red-500" : ""
                        }`}
                    >
                        <Editor
                            {...field}
                            placeholder={placeholder}
                            onChange={(value) => field.onChange(value)}
                            // onChange={(value) => {
                            //     const plain = stripEditor(value);
                            //     field.onChange(plain); // store plain text
                            // }}
                            {...props}
                        />
                    </div>
                    {error && (
                        <p className="text-xs text-red-600 mt-1">
                            {error.message}
                        </p>
                    )}
                </>
            )}
        />
    );
}
