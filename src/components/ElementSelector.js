import React from "react";

import Img from "gatsby-image";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  withStyles
} from "@material-ui/core";

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit
  }
});

const ElementSelector = props => {
  const currentNode = props.elements[props.selectedElementIndex].node;
  const { classes } = props;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Img
        style={{ width: "50px" }}
        fluid={currentNode.icon.childImageSharp.fluid}
      />
      <FormControl className={classes.formControl} style={{ width: "170px" }}>
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

export default withStyles(styles)(ElementSelector);
