import { AsteriskSimple } from "@phosphor-icons/react";
import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
// shadcn/ui
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { cn } from "@shared/utils/index";

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
};

export default function RHFTextField({
  name,
  label,
  icon,
  readOnly = false,
  isRequired = true,
  className,
  multiline,
  minRows,
  maxRows,
  rows,
  inputProps, // Destructure to remove from DOM
  fullWidth, // Destructure to remove from DOM
  isCurrency = false,
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full space-y-2">
          {label && (
            <Label className="text-sm inline-flex items-center gap-0">
              <span className="dark:text-white">{label}</span>
              {isRequired && (
                <AsteriskSimple
                  size={10}
                  weight="duotone"
                  className="text-red-700 ml-0.5"
                />
              )}
            </Label>
          )}

          <div className="relative w-full">
            {icon && (
              <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2 z-10">
                {icon}
              </div>
            )}
            {isCurrency ? (
              <IMaskInput
                id={field.name}
                name={field.name}
                value={String(field.value || "")}
                onAccept={(value) => field.onChange(value)}
                onBlur={field.onBlur}
                inputRef={field.ref}
                mask={Number}
                scale={2}
                thousandsSeparator=","
                padFractionalZeros={true}
                normalizeZeros={true}
                radix="."
                mapToRadix={["."]}
                readOnly={readOnly}
                disabled={readOnly}
                className={cn(
                  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed",
                  readOnly && "pointer-events-none opacity-70",
                  icon && "pl-8",
                  error && "border-red-500 focus-visible:ring-red-500",
                  className
                )}
                {...other}
              />
            ) : multiline ? (
              <textarea
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  if (other.onChange) {
                    other.onChange(e);
                  }
                }}
                readOnly={readOnly}
                disabled={readOnly}
                tabIndex={readOnly ? -1 : 0}
                rows={rows || minRows || 3}
                className={cn(
                  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed",
                  icon && "pl-8",
                  error && "border-red-500 focus-visible:ring-red-500",
                  className
                )}
                {...other}
              />
            ) : (
              <Input
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  if (other.onChange) {
                    other.onChange(e);
                  }
                }}
                readOnly={readOnly}
                disabled={readOnly}
                tabIndex={readOnly ? -1 : 0}
                className={cn(
                  icon && "pl-8",
                  error && "border-red-500 focus-visible:ring-red-500",
                  className
                )}
                {...other}
              />
            )}
          </div>

          {error && (
            <p className="text-xs ml-1 font-semibold text-red-500">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
