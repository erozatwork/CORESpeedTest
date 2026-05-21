import { AsteriskSimple } from "@phosphor-icons/react";
import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
// shadcn/ui
import { Textarea } from "@shared/components/ui/textarea";
import { Label } from "@shared/components/ui/label";
import { cn } from "@shared/utils/index";

// ----------------------------------------------------------------------

RHFTextarea.propTypes = {
  name: PropTypes.string,
};

export default function RHFTextarea({
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
            <Textarea
              {...field}
              readOnly={readOnly}
              disabled={readOnly}
              tabIndex={readOnly ? -1 : 0}
              rows={rows}
              className={cn(
                icon && "pl-8",
                readOnly && "pointer-events-none opacity-70",
                error && "border-red-500 focus-visible:ring-red-500",
                className
              )}
              {...other}
            />
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
