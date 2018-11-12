import React from "react";

import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

const ElementSelector = props => {
  return (
    <div>
      <FormControl>
        <InputLabel>{props.elementName}</InputLabel>
        <Select
          value={props.selectedElementIndex}
          onChange={event => props.setSelectedElementIndex(event.target.value)}
        >
          {props.elements.map(({ node }, index) => (
            <MenuItem key={index} value={index}>
              {node.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ElementSelector;
