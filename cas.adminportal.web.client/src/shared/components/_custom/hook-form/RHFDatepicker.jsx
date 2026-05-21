import { useState, useEffect } from "react";
import { AsteriskSimple } from "@phosphor-icons/react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import PropTypes from "prop-types";
import { format, parseISO } from "date-fns";
// shadcn/ui
import { Label } from "@shared/components/ui/label";
import { Button } from "@shared/components/ui/button";
import { Calendar } from "@shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import { cn } from "@shared/utils/index";

// form
import { useFormContext, Controller } from "react-hook-form";

// ----------------------------------------------------------------------

RHFDatepicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  readOnly: PropTypes.bool,
  isNotRequired: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

export default function RHFDatepicker({
  name,
  label,
  readOnly = false,
  isNotRequired = false,
  className,
  placeholder = "Pick a date",
  ...other
}) {
  const { control } = useFormContext();

  // Helper function to convert Date to ISO string preserving local date (no timezone shift)
  const toLocalISOString = (date) => {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}T00:00:00`;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // Ensure field.value is properly converted to Date object
        // Accept ISO strings (preferred), Date objects, or other date representations.
        // If parsing fails, treat as undefined so the calendar doesn't error.
        let fieldDate;
        if (field.value) {
          if (field.value instanceof Date) {
            fieldDate = !isNaN(field.value) ? field.value : undefined;
          } else if (typeof field.value === "string") {
            // Safe Parsing: extract YYYY-MM-DD only to avoid T00:00:00Z causing a shift
            const datePart = field.value.split("T")[0];
            const parsedISO = parseISO(datePart);
            if (!isNaN(parsedISO)) {
              fieldDate = parsedISO;
            } else {
              const fallback = new Date(datePart);
              fieldDate = !isNaN(fallback) ? fallback : undefined;
            }
          } else {
            const d = new Date(field.value);
            fieldDate = !isNaN(d) ? d : undefined;
          }
        } else {
          fieldDate = undefined;
        }

        const [open, setOpen] = useState(false);
        const [currentMonth, setCurrentMonth] = useState(fieldDate || new Date());
        const [inputValue, setInputValue] = useState(fieldDate ? format(fieldDate, "MM/dd/yyyy") : "");

        useEffect(() => {
          if (field.value) {
            let parsed;
            if (field.value instanceof Date) {
              parsed = field.value;
            } else if (typeof field.value === "string") {
              parsed = parseISO(field.value);
              if (isNaN(parsed)) parsed = new Date(field.value);
            }
            if (parsed && !isNaN(parsed)) {
              setInputValue(format(parsed, "MM/dd/yyyy"));
              setCurrentMonth(parsed);
            }
          } else {
            setInputValue("");
          }
        }, [field.value]);

        const handleInputChange = (e) => {
          let val = e.target.value.replace(/\D/g, "");
          if (val.length > 8) val = val.substring(0, 8);

          let formatted = val;
          if (val.length >= 3) formatted = val.substring(0, 2) + "/" + val.substring(2);
          if (val.length >= 5) formatted = formatted.substring(0, 5) + "/" + val.substring(4);

          setInputValue(formatted);

          if (formatted.length === 10) {
            const month = parseInt(formatted.substring(0, 2), 10);
            const day = parseInt(formatted.substring(3, 5), 10);
            const year = parseInt(formatted.substring(6, 10), 10);
            if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900 && year <= 2100) {
              const parsedDate = new Date(year, month - 1, day);
              if (!isNaN(parsedDate) && parsedDate.getDate() === day) {
                const newIso = toLocalISOString(parsedDate);
                const currentIso = fieldDate ? toLocalISOString(fieldDate) : undefined;
                if (newIso !== currentIso) {
                  field.onChange(newIso);
                  setCurrentMonth(parsedDate);
                }
              }
            }
          } else if (formatted === "") {
            if (field.value !== undefined) {
              field.onChange(undefined);
            }
          }
        };

        const handleReset = (e) => {
          e.preventDefault();
          e.stopPropagation();
          field.onChange(undefined);
          setInputValue("");
        };

        return (
          <div className="w-full space-y-2">
            {label && (
              <Label
                htmlFor={name}
                className="text-sm inline-flex items-center gap-0 px-1"
              >
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

            <div className={cn("relative flex items-center w-full date-input-wrapper", className)}>
              <Popover open={open} onOpenChange={setOpen} modal={false}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    disabled={readOnly}
                    className="absolute left-0 top-0 h-10 w-10 flex items-center justify-center text-gray-500 hover:text-gray-900 z-10 focus:outline-none disabled:opacity-50"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </button>
                </PopoverTrigger>

                <input
                  type="text"
                  maxLength={10}
                  placeholder={placeholder === "Pick a date" ? "MM/DD/YYYY" : placeholder}
                  value={inputValue}
                  readOnly={readOnly}
                  disabled={readOnly}
                  onChange={handleInputChange}
                  onClick={() => setOpen(true)}
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-red-500 focus-visible:ring-red-500",
                    readOnly && "pointer-events-none opacity-70 cursor-not-allowed"
                  )}
                  {...other}
                />

                <PopoverContent
                  className="w-auto p-0 rounded-2xl shadow-xl border-gray-100"
                  align="start"
                  sideOffset={8}
                  onInteractOutside={(e) => {
                    const target = e.target;
                    if (
                      target.closest("select") ||
                      target.tagName === "OPTION" ||
                      target.closest(".date-input-wrapper")
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <div className="flex justify-center gap-3 px-4 pt-5 pb-3 border-b border-gray-100/80">
                    {/* YEAR SELECTOR */}
                    <div className="relative">
                      <select
                        className="appearance-none bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-1.5 text-[14px] font-[700] text-gray-800 cursor-pointer hover:bg-gray-100 focus:outline-none focus:border-gray-300 transition-colors"
                        value={String(currentMonth.getFullYear())}
                        onChange={(e) =>
                          setCurrentMonth(
                            new Date(parseInt(e.target.value, 10), currentMonth.getMonth(), 1)
                          )
                        }
                      >
                        {Array.from({ length: 101 }, (_, i) => 2000 + i).map((y) => (
                          <option key={String(y)} value={String(y)}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* MONTH SELECTOR */}
                    <div className="relative">
                      <select
                        className="appearance-none bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-1.5 text-[14px] font-[700] text-gray-800 cursor-pointer hover:bg-gray-100 focus:outline-none focus:border-gray-300 transition-colors"
                        value={String(currentMonth.getMonth())}
                        onChange={(e) =>
                          setCurrentMonth(
                            new Date(currentMonth.getFullYear(), parseInt(e.target.value, 10), 1)
                          )
                        }
                      >
                        {[
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ].map((m, i) => (
                          <option key={String(i)} value={String(i)}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Calendar
                    mode="single"
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    selected={fieldDate}
                    onSelect={(date) => {
                      if (date) {
                        field.onChange(toLocalISOString(date));
                        setOpen(false);
                      }
                    }}
                    modifiersClassNames={{
                      selected: "!bg-red-50 !text-red-600 !font-bold rounded-lg shadow-sm border border-red-100",
                    }}
                  />
                </PopoverContent>
              </Popover>
              {fieldDate && !readOnly && (
                <Button
                  type="button"
                  variant="dim"
                  size="sm"
                  className="absolute top-1/2 right-1 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={handleReset}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
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
