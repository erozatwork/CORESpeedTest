import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
// shadcn/ui
import { Switch } from "@shared/components/ui/switch";
import { Label } from "@shared/components/ui/label";

// ----------------------------------------------------------------------

RHFSwitch.propTypes = {
  name: PropTypes.string,
};

export default function RHFSwitch({ name, label, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex items-center space-x-2">
          <Switch
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
      )}
    />
  );
}
