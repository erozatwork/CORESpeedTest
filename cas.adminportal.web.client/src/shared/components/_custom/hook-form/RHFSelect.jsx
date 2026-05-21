import { AsteriskSimple } from "@phosphor-icons/react";
import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
// shadcn/ui
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { Label } from "@shared/components/ui/label";

// ----------------------------------------------------------------------

RHFSelect.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
};

export default function RHFSelect({
  name,
  label,
  placeholder = "Select an option",
  children,
  options = [],
  readOnly = false,
  isNotRequired = false,
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="relative w-full space-y-2">
            {label && (
              <Label className="text-sm inline-flex items-center gap-0">
                <span className="dark:text-white">{label}</span>
                {!isNotRequired && (
                  <AsteriskSimple
                    size={10}
                    weight="duotone"
                    className="text-red-700 ml-0.5"
                  />
                )}
              </Label>
            )}

            <Select
              disabled={readOnly}
              onValueChange={field.onChange}
              value={field.value ? field.value.toString() : ""}
              {...other}
            >
              <SelectTrigger
                className={
                  error ? "border-red-500 focus-visible:ring-red-500" : ""
                }
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {children}
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {error && (
              <p className="text-xs ml-1 font-semibold text-red-500">
                {error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
