import TextField from "@mui/material/TextField";
import MUIAutocomplete from "@mui/material/Autocomplete";

const Autocomplete = ({ mock }) => {
	return (
		<>
			<MUIAutocomplete
				disablePortal
				options={mock}
				fullWidth
				renderInput={(params) => <TextField {...params} label="Movie" />}
			/>
		</>
	);
};

export { Autocomplete };
