const FormConverter = (data) => {
    const form = new FormData();

    Object.entries(data).map(([key,value])=>{
        /** Add Custom Validation If Needed [esp: ArrayTypes] */

        return form.append(key,value)
     });

   return form;
}

export { FormConverter }