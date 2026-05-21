import { AsteriskSimple } from "@phosphor-icons/react";
import { IMaskInput } from "react-imask";

import PropTypes from "prop-types";

// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import TextField from "@mui/material/TextField";
import { Label } from "@shared/components/ui/label";
import { forwardRef } from "react";
import { ThemeSettings } from "@shared/styles/theme/overrides/ThemeSettings";

// ----------------------------------------------------------------------

RHFInputMask.propTypes = {
    name: PropTypes.string,
};

const MobileMaskedInput = forwardRef(function MaskedInput(props, ref) {
    const { onChange, style, ...other } = props;

    return (
        <IMaskInput
            {...other}
            inputRef={ref}
            mask="0000-000-0000"
            overwrite
            onAccept={(value) => onChange({ target: { value } })}
            style={style}
        />
    );
});

const SecuritySystemMaskedInput = forwardRef(function MaskedInput(props, ref) {
    const { onChange, ...other } = props;

    return (
        <IMaskInput
            {...other}
            inputRef={ref}
            mask="00-0000000-0"
            onAccept={(value) => onChange({ target: { value } })}
        />
    );
});

const PhilhealthMaskedInput = forwardRef(function MaskedInput(props, ref) {
    const { onChange, ...other } = props;

    return (
        <IMaskInput
            {...other}
            inputRef={ref}
            mask="00-000000000-0"
            onAccept={(value) => onChange({ target: { value } })}
        />
    );
});

const TinMaskedInput = forwardRef(function MaskedInput(props, ref) {
    const { onChange, ...other } = props;

    return (
        <IMaskInput
            {...other}
            inputRef={ref}
            mask="00000-000-000"
            onAccept={(value) => onChange({ target: { value } })}
        />
    );
});

const PagibigMaskedInput = forwardRef(function MaskedInput(props, ref) {
    const { onChange, ...other } = props;

    return (
        <IMaskInput
            {...other}
            inputRef={ref}
            mask="0000-0000-0000"
            onAccept={(value) => onChange({ target: { value } })}
        />
    );
});

export default function RHFInputMask({
    name,
    control,
    label,
    icon,
    maskType,
    readOnly = false,
    ...other
}) {
    const { settings } = ThemeSettings();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className="relative w-full">
                    {icon && (
                        <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2">
                            {icon}
                        </div>
                    )}

                    {label && (
                        <Label className="text-sm inline-flex items-center gap-0 mb-1">
                            <span>{label}</span>
                            <AsteriskSimple
                                size={10}
                                weight="duotone"
                                className="text-red-700 ml-0.5"
                            />
                        </Label>
                    )}

                    {maskType === "mobile" && (
                        <TextField
                            fullWidth
                            size="small"
                            error={!!error}
                            helperText={error?.message}
                            InputProps={{
                                readOnly: readOnly,
                                sx: {
                                    minHeight: 5,

                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderRadius: "8px",
                                        borderColor:
                                            settings?.themeMode === "dark"
                                                ? "#ffffff"
                                                : "rgba(0, 0, 0, 0.23)",
                                    },

                                    "&:hover .MuiOutlinedInput-notchedOutline":
                                        {
                                            borderColor:
                                                settings?.themeMode === "dark"
                                                    ? "#ffffff"
                                                    : "#000000",
                                        },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                            borderColor:
                                                settings?.themeMode === "dark"
                                                    ? "#ffffff"
                                                    : "#1976d2",
                                        },
                                },
                            }}
                            slotProps={{
                                root: {
                                    sx: {
                                        minHeight: 5,
                                    },
                                },
                                input: {
                                    inputComponent: MobileMaskedInput,
                                    value: field.value,
                                    onChange: field.onChange,
                                    onBlur: field.onBlur,
                                    ref: field.ref,
                                    style: {
                                        borderRadius: "8px",
                                        color:
                                            settings?.themeMode === "dark"
                                                ? "#ffffff"
                                                : "#000000",
                                        backgroundColor:
                                            settings?.themeMode === "dark"
                                                ? "#1C252E"
                                                : "#ffffff",
                                        WebkitTextFillColor:
                                            settings?.themeMode === "dark"
                                                ? "#ffffff"
                                                : "#000000",
                                        transition:
                                            "background-color 9999s ease-in-out 0s",
                                    },
                                },
                            }}
                            {...other}
                        />
                    )}

                    {maskType === "sss" && (
                        <TextField
                            fullWidth
                            size="small"
                            error={!!error}
                            helperText={error?.message}
                            {...other}
                            InputProps={{
                                readOnly: readOnly,
                                sx: {
                                    minHeight: 5,

                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderRadius: "8px",
                                        borderColor:
                                            settings?.themeMode === "dark"
                                                ? "#ffffff"
                                                : "rgba(0, 0, 0, 0.23)",
                                    },

                                    "&:hover .MuiOutlinedInput-notchedOutline":
                                        {
                                            borderColor:
                                                settings?.themeMode === "dark"
                                                    ? "#ffffff"
                                                    : "#000000",
                                        },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                            borderColor:
                                                settings?.themeMode === "dark"
                                                    ? "#ffffff"
                                                    : "#1976d2",
                                        },
                                },
                            }}
                            slotProps={{
                                root: {
                                    sx: {
                                        minHeight: 5,
                                    },
                                },
                                input: {
                                    inputComponent: SecuritySystemMaskedInput,
                                    value: field.value,
                                    onChange: field.onChange,
                                    onBlur: field.onBlur,
                                    ref: field.ref,
                                    style: {
                                        borderRadius: "8px",
                                        color:
                                            settings?.themeMode === "dark"
                                                ? "#ffffff"
                                                : "#000000",
                                        backgroundColor:
                                            settings?.themeMode === "dark"
                                                ? "#1C252E"
                                                : "#ffffff",
                                        WebkitTextFillColor:
                                            settings?.themeMode === "dark"
                                                ? "#ffffff"
                                                : "#000000",
                                        transition:
                                            "background-color 9999s ease-in-out 0s",
                                    },
                                },
                            }}
                        />
                    )}

                    {maskType === "philhealth" && (
                        <TextField
                            fullWidth
                            size="small"
                            error={!!error}
                            helperText={error?.message}
                            {...other}
                            InputProps={{
                                readOnly: readOnly,
                                sx: {
                                    minHeight: 5,

                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderRadius: "8px",
                                        borderColor:
                                            settings?.themeMode === "dark"
                                                ? "#ffffff"
                                                : "rgba(0, 0, 0, 0.23)",
                                    },

                                    "&:hover .MuiOutlinedInput-notchedOutline":
                                        {
                                            borderColor:
                                                settings?.themeMode === "dark"
                                                    ? "#ffffff"
                                                    : "#000000",
                                        },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                            borderColor:
                                                settings?.themeMode === "dark"
                                                    ? "#ffffff"
                                                    : "#1976d2",
                                        },
                                },
                            }}
                            slotProps={{
                                root: {
                                    sx: {
                                        minHeight: 5,
                                    },
                                },
                                input: {
                                    inputComponent: PhilhealthMaskedInput,
                                    value: field.value,
                                    onChange: field.onChange,
                                    onBlur: field.onBlur,
                                    ref: field.ref,
                                    style: {
                                        borderRadius: "8px",
                                        color:
                                            settings?.themeMode === "dark"
                                                ? "#ffffff"
                                                : "#000000",
                                        backgroundColor:
                                            settings?.themeMode === "dark"
                                                ? "#1C252E"
                                                : "#ffffff",
                                        WebkitTextFillColor:
                                            settings?.themeMode === "dark"
                                                ? "#ffffff"
                                                : "#000000",
                                        transition:
                                            "background-color 9999s ease-in-out 0s",
                                    },
                                },
                            }}
                        />
                    )}

                    {maskType === "tin" && (
                        <TextField
                            fullWidth
                            size="small"
                            error={!!error}
                            helperText={error?.message}
                            {...other}
                            InputProps={{
                                readOnly: readOnly,
                                sx: {
                                    minHeight: 5,

                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderRadius: "8px",
                                        borderColor:
                                            settings?.themeMode === "dark"
                                                ? "#ffffff"
                                                : "rgba(0, 0, 0, 0.23)",
                                    },

                                    "&:hover .MuiOutlinedInput-notchedOutline":
                                        {
                                            borderColor:
                                                settings?.themeMode === "dark"
                                                    ? "#ffffff"
                                                    : "#000000",
                                        },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                            borderColor:
                                                settings?.themeMode === "dark"
                                                    ? "#ffffff"
                                                    : "#1976d2",
                                        },
                                },
                            }}
                            slotProps={{
                                root: {
                                    sx: {
                                        minHeight: 5,
                                    },
                                },
                                input: {
                                    inputComponent: TinMaskedInput,
                                    value: field.value,
                                    onChange: field.onChange,
                                    onBlur: field.onBlur,
                                    ref: field.ref,
                                    style: {
                                        borderRadius: "8px",
                                        color:
                                            settings?.themeMode === "dark"
                                                ? "#ffffff"
                                                : "#000000",
                                        backgroundColor:
                                            settings?.themeMode === "dark"
                                                ? "#1C252E"
                                                : "#ffffff",
                                        WebkitTextFillColor:
                                            settings?.themeMode === "dark"
                                                ? "#ffffff"
                                                : "#000000",
                                        transition:
                                            "background-color 9999s ease-in-out 0s",
                                    },
                                },
                            }}
                        />
                    )}

                    {maskType === "pagibig" && (
                        <TextField
                            fullWidth
                            size="small"
                            error={!!error}
                            helperText={error?.message}
                            {...other}
                            InputProps={{
                                readOnly: readOnly,
                                sx: {
                                    minHeight: 5,

                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderRadius: "8px",
                                        borderColor:
                                            settings?.themeMode === "dark"
                                                ? "#ffffff"
                                                : "rgba(0, 0, 0, 0.23)",
                                    },

                                    "&:hover .MuiOutlinedInput-notchedOutline":
                                        {
                                            borderColor:
                                                settings?.themeMode === "dark"
                                                    ? "#ffffff"
                                                    : "#000000",
                                        },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                            borderColor:
                                                settings?.themeMode === "dark"
                                                    ? "#ffffff"
                                                    : "#1976d2",
                                        },
                                },
                            }}
                            slotProps={{
                                root: {
                                    sx: {
                                        minHeight: 5,
                                    },
                                },
                                input: {
                                    inputComponent: PagibigMaskedInput,
                                    value: field.value,
                                    onChange: field.onChange,
                                    onBlur: field.onBlur,
                                    ref: field.ref,
                                    style: {
                                        borderRadius: "8px",
                                        color:
                                            settings?.themeMode === "dark"
                                                ? "#ffffff"
                                                : "#000000",
                                        backgroundColor:
                                            settings?.themeMode === "dark"
                                                ? "#1C252E"
                                                : "#ffffff",
                                        WebkitTextFillColor:
                                            settings?.themeMode === "dark"
                                                ? "#ffffff"
                                                : "#000000",
                                        transition:
                                            "background-color 9999s ease-in-out 0s",
                                    },
                                },
                            }}
                        />
                    )}
                </div>
            )}
        />
    );
}
