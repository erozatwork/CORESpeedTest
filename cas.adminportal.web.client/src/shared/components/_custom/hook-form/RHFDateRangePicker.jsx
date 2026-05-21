import React from "react";
import { AsteriskSimple } from "@phosphor-icons/react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@shared/components/ui/label";
import { Button, buttonVariants } from "@shared/components/ui/button";
import { Calendar } from "@shared/components/ui/calendar";
import PropTypes from "prop-types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import {
  addDays,
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  parseISO,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@shared/utils";

RHFDateRangePicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  readOnly: PropTypes.bool,
  isNotRequired: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

export default function RHFDateRangePicker({
  name,
  label,
  readOnly = false,
  isNotRequired = false,
  className,
  placeholder = "Select a date range",
  showPresets = false,
  customPresets = null,
  ...other
}) {
  const { control } = useFormContext();

  const defaultPresets = [
    {
      label: "Today",
      getValue: () => {
        const today = new Date();
        return { from: today, to: today };
      },
    },
    {
      label: "Last 7 days",
      getValue: () => {
        const today = new Date();
        return { from: subDays(today, 6), to: today };
      },
    },
    {
      label: "Last 30 days",
      getValue: () => {
        const today = new Date();
        return { from: subDays(today, 29), to: today };
      },
    },
    {
      label: "This month",
      getValue: () => {
        const today = new Date();
        return { from: startOfMonth(today), to: endOfMonth(today) };
      },
    },
    {
      label: "This year",
      getValue: () => {
        const today = new Date();
        return { from: startOfYear(today), to: endOfYear(today) };
      },
    },
  ];

  const presets = customPresets || defaultPresets;

  // Helper function to convert Date to ISO string preserving local date (no timezone shift)
  const toLocalISOString = (date) => {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}T00:00:00.000Z`;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

        // Parse ISO strings back to Date objects for display and calendar
        const parsedValue = React.useMemo(() => {
          if (!value) return undefined;

          const parseDate = (dateValue) => {
            if (!dateValue) return undefined;
            if (dateValue instanceof Date) return dateValue;
            if (typeof dateValue === "string") {
              const parsed = parseISO(dateValue);
              return !isNaN(parsed) ? parsed : undefined;
            }
            return undefined;
          };

          return {
            from: parseDate(value.from),
            to: parseDate(value.to),
          };
        }, [value]);

        const handleApply = () => {
          setIsPopoverOpen(false);
        };

        const handleReset = () => {
          const today = new Date();
          const defaultDate = {
            from: toLocalISOString(today),
            to: toLocalISOString(addDays(today, 5)),
          };
          onChange(defaultDate);
          setIsPopoverOpen(false);
        };

        const handleSelect = (selected) => {
          onChange({
            from: toLocalISOString(selected?.from),
            to: toLocalISOString(selected?.to),
          });
        };

        const handlePresetClick = (preset) => {
          const presetValue = preset.getValue();
          onChange({
            from: toLocalISOString(presetValue?.from),
            to: toLocalISOString(presetValue?.to),
          });
        };

        return (
          <div className="w-full space-y-2">
            {label && (
              <Label
                htmlFor={name}
                className="text-sm inline-flex items-center gap-0 px-1"
              >
                <span className="dark:text-white">{label}</span>
                {isNotRequired && (
                  <AsteriskSimple
                    size={10}
                    weight="duotone"
                    className="text-red-700 ml-0.5"
                  />
                )}
              </Label>
            )}

            <div className={cn("relative", className)}>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !parsedValue?.from && "text-muted-foreground",
                      error && "border-red-500 focus-visible:ring-red-500",
                      className
                    )}
                    onClick={() => !readOnly && setIsPopoverOpen(true)}
                    disabled={readOnly}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {parsedValue?.from ? (
                      parsedValue.to ? (
                        <>
                          {format(parsedValue.from, "MM/dd/yyyy")} -{" "}
                          {format(parsedValue.to, "MM/dd/yyyy")}
                        </>
                      ) : (
                        format(parsedValue.from, "MM/dd/yyyy")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <div className={cn("flex", showPresets && "gap-0")}>
                    {showPresets && (
                      <div className="flex flex-col gap-1 border-r border-border p-3">
                        <div className="text-sm font-medium mb-1">Presets</div>
                        {presets.map((preset) => (
                          <Button
                            key={preset.label}
                            variant="ghost"
                            size="sm"
                            className="justify-start font-normal"
                            onClick={() => handlePresetClick(preset)}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                    )}
                    <div>
                      <Calendar
                        autoFocus
                        mode="range"
                        defaultMonth={parsedValue?.from}
                        showOutsideDays={false}
                        selected={parsedValue}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                        modifiersClassNames={{
                          range_middle: "!bg-gray-200",
                          range_start: "!bg-red-500 !text-white rounded-l-md",
                          range_end: "!bg-red-500 !text-white rounded-r-md",
                        }}
                      />
                      {!readOnly && (
                        <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
                          <Button variant="outline" onClick={handleReset}>
                            Reset
                          </Button>
                          <Button onClick={handleApply}>Apply</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

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
