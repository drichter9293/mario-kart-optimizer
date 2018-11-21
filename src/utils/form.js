import { useState } from "react";

export const useFormState = initialValues => {
  const [formValues, setFormValues] = useState(initialValues);
  const setFormValue = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value
    });
  };

  return [formValues, setFormValue];
};
