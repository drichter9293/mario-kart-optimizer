import React, { useState } from "react";

import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";

import { STATS } from "../constants";

const useFormState = () => {
  const initialValues = STATS.reduce((initialValues, stat) => {
    initialValues[stat.key] = false;
    return initialValues;
  }, {});
  const [formValues, setFormValues] = useState(initialValues);
  const setFormValue = (stat, value) => {
    setFormValues({
      ...formValues,
      [stat]: value
    });
  };

  return [formValues, setFormValue];
};

const Optimizer = props => {
  const [formValues, setFormValue] = useFormState();

  return (
    <FormControl>
      <FormLabel>Optimize for:</FormLabel>
      <FormGroup row={true}>
        {STATS.map(stat => (
          <FormControlLabel
            key={stat.key}
            label={stat.displayName}
            control={
              <Checkbox
                value={stat.key}
                checked={formValues[stat.key]}
                onChange={event => setFormValue(stat.key, event.target.checked)}
              />
            }
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};

export default Optimizer;
