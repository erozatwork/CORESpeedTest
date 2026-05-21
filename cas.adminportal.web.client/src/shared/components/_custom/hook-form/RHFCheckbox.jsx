import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@shared/components/ui/checkbox";
import { Label } from "@shared/components/ui/label";

// ----------------------------------------------------------------------

export function RHFCheckbox({ name, helperText, label, className, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={className}>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              {...other}
            />
            {label && (
              <Label
                htmlFor={name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
              </Label>
            )}
          </div>

          {(!!error || helperText) && (
            <p className="text-sm text-red-500 mt-1">
              {error ? error?.message : helperText}
            </p>
          )}
        </div>
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFMultiCheckbox({
  name,
  label,
  options,
  helperText,
  className,
  ...other
}) {
  const { control } = useFormContext();

  const getSelected = (selectedItems, item) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={className}>
          {label && (
            <Label className="text-sm font-medium mb-2 block">{label}</Label>
          )}

          <div className="space-y-2" {...other}>
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${name}-${option.value}`}
                  checked={field.value.includes(option.value)}
                  onCheckedChange={() =>
                    field.onChange(getSelected(field.value, option.value))
                  }
                />
                <Label
                  htmlFor={`${name}-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>

          {(!!error || helperText) && (
            <p className="text-sm text-red-500 mt-1">
              {error ? error?.message : helperText}
            </p>
          )}
        </div>
      )}
    />
  );
}
