import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const Autocomplete = ({ options, placeholder }) => {
    return (
        <>
            <MUIAutocomplete
                disablePortal
                options={options}
                fullWidth
                renderInput={(params) => (
                    <TextField {...params} label={placeholder} />
                )}
            />
        </>
    );
};

export { Autocomplete };
