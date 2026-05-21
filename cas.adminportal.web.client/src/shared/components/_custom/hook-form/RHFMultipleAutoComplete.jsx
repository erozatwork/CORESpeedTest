import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import Autocomplete from "@mui/material/Autocomplete";

import RHFTextField from "./RHFTextField";

// ----------------------------------------------------------------------

RHFMultipleAutoComplete.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
};

export default function RHFMultipleAutoComplete({
  name,
  readOnly,
  options,
  getOptionLabel,
  getOptionKey,
  defaultValues,
  renderOption,
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <>
            <Autocomplete
              {...field}
              // ensure Autocomplete is always controlled: use empty array when undefined
              value={field.value ?? []}
              freesolo="true"
              multiple={true}
              size="small"
              filterselectedoptions="true"
              handleHomeEndKeys
              readOnly={readOnly}
              options={options}
              defaultValue={defaultValues}
              getOptionLabel={getOptionLabel}
              getOptionKey={getOptionKey}
              renderOption={renderOption}
              renderInput={(params) => (
                <RHFTextField
                  {...params}
                  {...other}
                  name={name}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
              onChange={(e, value) => field.onChange(value)}
              sx={{
                "& .MuiInputBase-root": {
                  flexWrap: "wrap",
                  paddingRight: "40px",
                },
                "& .MuiAutocomplete-tag": {
                  maxWidth: "100%",
                },
                "& .MuiAutocomplete-inputRoot": {
                  alignItems: "flex-start",
                },
              }}
            />
          </>
        );
      }}
    />
  );
}
