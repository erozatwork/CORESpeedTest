import React from "react";
import PropTypes from "prop-types";
import { useFormContext, Controller } from "react-hook-form";
import { Badge, BadgeButton } from "@shared/components/ui/badge";
import { Button, ButtonArrow } from "@shared/components/ui/button";
import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import { X } from "lucide-react";
import { Label } from "@shared/components/ui/label";
import { AsteriskSimple } from "@phosphor-icons/react";

RHFMultipleSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  readOnly: PropTypes.bool,
  isNotRequired: PropTypes.bool,
};

export default function RHFMultipleSelect({
  name,
  label,
  placeholder = "Select items",
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
      render={({ field: { value = [], onChange }, fieldState: { error } }) => {
        // Ensure value is always an array
        const currentValue = Array.isArray(value) ? value : [];

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

            <div className="w-full">
              <Popover open={other.open} onOpenChange={other.setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={other.open}
                    autoHeight={true}
                    mode="input"
                    placeholder={currentValue.length === 0}
                    className="w-full p-1 relative"
                  >
                    <div className="flex flex-wrap items-center gap-1 pe-2.5">
                      {currentValue.length > 0 ? (
                        currentValue.map((val) => {
                          const item = options.find(
                            (opt) => String(opt.value) === String(val),
                          );
                          return item ? (
                            <Badge key={val} variant="outline">
                              {item.label}
                              <BadgeButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onChange(
                                    currentValue.filter(
                                      (v) => String(v) !== String(val),
                                    ),
                                  );
                                }}
                              >
                                <X />
                              </BadgeButton>
                            </Badge>
                          ) : null;
                        })
                      ) : (
                        <span className="px-2.5">{placeholder}</span>
                      )}
                    </div>
                    <ButtonArrow className="absolute top-2 end-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-(--radix-popper-anchor-width) p-0"
                  onWheel={(e) => e.stopPropagation()}
                >
                  <Command className="overflow-visible">
                    <CommandInput placeholder="Search..." />
                    <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden overscroll-contain">
                      <CommandEmpty>No Data Found</CommandEmpty>
                      <CommandGroup>
                        {options.map((item) => {
                          const itemValue = String(item.value);
                          const isSelected = currentValue.some(
                            (v) => String(v) === itemValue,
                          );

                          return (
                            <CommandItem
                              key={item.value}
                              value={item.label}
                              onSelect={() => {
                                onChange(
                                  isSelected
                                    ? currentValue.filter(
                                        (v) => String(v) !== itemValue,
                                      )
                                    : [...currentValue, itemValue],
                                );
                              }}
                            >
                              <span className="truncate">{item.label}</span>
                              {isSelected && <CommandCheck />}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
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
