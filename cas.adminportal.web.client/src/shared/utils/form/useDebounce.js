import { useMemo, useState } from "react";
import debounce from "lodash.debounce";

const useSearchDebounce = () => {

    const [search, setSearchFilter] = useState("");

    const handleSearch = (event) => {
        setSearchFilter(event.target.value)
    }

    const useDebounce = useMemo(() => {
        return debounce(handleSearch, 400);
    }, []);


    return { search, useDebounce };
}

export { useSearchDebounce }