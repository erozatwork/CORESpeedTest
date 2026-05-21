import { Controller, useFormContext } from "react-hook-form";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Label } from "@shared/components/ui/label";
import { AsteriskSimple } from "@phosphor-icons/react";

export default function RHFDateTimepicker({ name, label, ...other }) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className="relative w-full">
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

                    <DateTimePicker
                        {...field}
                        value={field.value ? new Date(field.value) : null}
                        onChange={(date) => field.onChange(date)}
                        ampm={false}
                        format="yyyy/MM/dd HH:mm"
                        slotProps={{
                            textField: {
                                size: "small",
                                fullWidth: true,
                                className: "text-sm",
                                helperText: error?.message,
                                error: !!error,
                                InputProps: {
                                    sx: {
                                        minHeight: 5,
                                        borderRadius: "8px",
                                    },
                                },
                            },
                        }}
                        {...other}
                    />
                </div>
            )}
        />
    );
}
