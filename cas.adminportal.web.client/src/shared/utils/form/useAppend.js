import { useState } from "react"
const useAppend = (defaultKeys) => {

    const [appendData, setAppendData] = useState(defaultKeys);

    const appendBtn = (string, defaultValue, objectValue, getValues, setValue) => {
        setAppendData([...appendData, string]);
        setValue(defaultValue, [
            ...getValues(defaultValue),
           objectValue,
        ]);
    };

    const deleteBtn = (index, getValues, setValue, defaultValue ) => {
        const newAppendInfo = [...appendData];
        newAppendInfo.splice(index, 1);
        setAppendData(newAppendInfo);

        const newIndividuals = [...getValues(defaultValue)];
        newIndividuals.splice(index, 1);
        setValue(defaultValue, newIndividuals, { shouldDirty: true });
    };

    return { appendData, appendBtn, deleteBtn }
}

export { useAppend }


// string = "name & position & email"
// defaultValue or columnName = "individuals"
// objectValue = { name: "", position: "", email: "" }