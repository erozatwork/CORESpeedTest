import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Label } from "@shared/components/ui/label";
import { AsteriskSimple } from "@phosphor-icons/react";

// ----------------------------------------------------------------------

RHFRadioGroup.propTypes = {
    name: PropTypes.string,
    options: PropTypes.array,
};

export default function RHFRadioGroup({ name, label, options, ...other }) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className="w-full flex flex-col">
                    {/* mb-1 */}
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
                    <RadioGroup {...field} row {...other}>
                        {options.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={
                                    <Radio
                                        sx={{
                                            color: "var(--tw-primary)",
                                            "&.Mui-checked": {
                                                color: "var(--tw-primary)",
                                            },
                                        }}
                                    />
                                }
                                label={option.label}
                            />
                        ))}
                    </RadioGroup>

                    {!!error && (
                        <FormHelperText error sx={{ px: 2 }}>
                            {error.message}
                        </FormHelperText>
                    )}
                </div>
            )}
        />
    );
}
