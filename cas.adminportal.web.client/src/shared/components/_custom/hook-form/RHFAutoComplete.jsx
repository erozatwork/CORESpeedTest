import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// ----------------------------------------------------------------------

RHFAutoComplete.propTypes = {
    children: PropTypes.node,
    name: PropTypes.string,
};

export default function RHFAutoComplete({
    name,
    readOnly = false,
    options,
    getOptionLabel,
    getOptionKey,
    defaultValues,
    renderOption,
    disablePortal = false,
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
                            size="small"
                            freesolo="true"
                            filterselectedoptions="true"
                            handleHomeEndKeys
                            readOnly={readOnly}
                            disablePortal={disablePortal}
                            options={options || []}
                            defaultValue={defaultValues}
                            getOptionLabel={getOptionLabel}
                            getOptionKey={getOptionKey}
                            renderOption={renderOption}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    {...other}
                                    name={name}
                                    error={!!error}
                                    helperText={error?.message}
                                    slotProps={{
                                        htmlInput: {
                                            ...params.inputProps,
                                            readOnly: readOnly,
                                        }
                                    }}
                                />
                            )}
                            onChange={(e, value) => field.onChange(value)}
                        />
                    </>
                );
            }}
        />
    );
}
