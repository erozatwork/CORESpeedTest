import { Accordion } from "./_examples/Accordion";
import { Autocomplete } from "./_examples/Autocomplete";
import { TextField } from "./_examples/Textfield";

const usePartialComponent = () => {
    const useComponent = (item) => {
        switch (item) {
            case "Accordion":
                return (
                    <>
                        <Accordion component={item} />
                    </>
                );
            case "Autocomplete":
                return (
                    <>
                        <Autocomplete component={item} />
                    </>
                );
            case "Textfield":
                return (
                    <>
                        <TextField component={item} />
                    </>
                );
            default:
                "No Rendered Component";
        }
    };

    return { useComponent };
};

export { usePartialComponent };
