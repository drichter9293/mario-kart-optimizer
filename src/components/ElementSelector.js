import React from "react";

import Img from "gatsby-image";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText
} from "@material-ui/core";

const ElementSelector = props => {
  const currentNode = props.elements[props.selectedElementIndex].node;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ width: "70px" }}>
        <Img
          style={{ width: "50px" }}
          fluid={currentNode.icon.childImageSharp.fluid}
        />
      </div>
      <FormControl style={{ width: "170px" }}>
        <InputLabel>{props.elementName}</InputLabel>
        <Select
          value={props.selectedElementIndex}
          onChange={event => props.setSelectedElementIndex(event.target.value)}
          renderValue={index => {
            const node = props.elements[index].node;
            return node.name;
          }}
        >
          {props.elements.map(({ node }, index) => (
            <MenuItem key={index} value={index}>
              <Img
                style={{ width: "40px" }}
                fluid={node.icon.childImageSharp.fluid}
              />
              <ListItemText>{node.name}</ListItemText>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ElementSelector;
