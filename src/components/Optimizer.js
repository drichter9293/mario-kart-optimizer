import React from "react";

import {
  Button,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  withStyles
} from "@material-ui/core";

import { useFormState } from "../utils/form";
import { STATS } from "../constants";

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit
  }
});

const getStatSumForElement = (element, stats) => {
  return stats.reduce((accumulator, statKey) => {
    return accumulator + element[statKey];
  }, 0);
};

const getElementIndexOptimizedForStats = (elements, stats) => {
  let sum = Number.MIN_VALUE;
  let elementIndices = [];
  elements.forEach(({ node }, index) => {
    const nodeSum = getStatSumForElement(node, stats);
    if (nodeSum === sum) {
      elementIndices.push(index);
    } else if (nodeSum > sum) {
      elementIndices = [index];
      sum = nodeSum;
    }
  });

  return elementIndices;
};

const getOptimizedIndices = ({
  characters,
  bodies,
  tires,
  gliders,
  statsToOptimize
}) => {
  const characterIndices = getElementIndexOptimizedForStats(
    characters,
    statsToOptimize
  );
  const bodyIndices = getElementIndexOptimizedForStats(bodies, statsToOptimize);
  const tireIndices = getElementIndexOptimizedForStats(tires, statsToOptimize);
  const gliderIndices = getElementIndexOptimizedForStats(
    gliders,
    statsToOptimize
  );

  return {
    characterIndices,
    bodyIndices,
    tireIndices,
    gliderIndices
  };
};

const Optimizer = props => {
  const initialValues = STATS.reduce((initialValues, stat) => {
    initialValues[stat.key + "_checked"] = false;
    initialValues[stat.key + "_min"] = "0.00";
    initialValues[stat.key + "_max"] = "6.00";
    return initialValues;
  }, {});
  const [formValues, setFormValue] = useFormState(initialValues);

  const onOptimize = () => {
    const statsToOptimize = [];
    STATS.forEach(stat => {
      if (formValues[stat.key + "_checked"]) {
        statsToOptimize.push(stat.key);
      }
    });

    if (!statsToOptimize.length) {
      return;
    }

    const optimizedIndices = getOptimizedIndices({
      characters: props.characters,
      bodies: props.bodies,
      tires: props.tires,
      gliders: props.gliders,
      statsToOptimize
    });

    const characterIndex = optimizedIndices.characterIndices[0];
    const bodyIndex = optimizedIndices.bodyIndices[0];
    const tireIndex = optimizedIndices.tireIndices[0];
    const gliderIndex = optimizedIndices.gliderIndices[0];

    props.setSelectedCharacterIndex(characterIndex);
    props.setSelectedBodyIndex(bodyIndex);
    props.setSelectedTireIndex(tireIndex);
    props.setSelectedGliderIndex(gliderIndex);
  };

  const numericOptions = [];
  for (let i = 0; i <= 6; i += 0.25) {
    numericOptions.push(i.toFixed(2));
  }

  const { classes } = props;

  return (
    <div>
      <Button variant="contained" color="primary" onClick={onOptimize}>
        Optimize
      </Button>
      {STATS.map(stat => (
        <div style={{ width: "500px" }}>
          <FormControlLabel
            key={stat.key}
            label={stat.displayName}
            className={classes.formControl}
            style={{ width: "130px" }}
            control={
              <Checkbox
                value={stat.key}
                checked={formValues[stat.key + "_checked"]}
                onChange={event =>
                  setFormValue(stat.key + "_checked", event.target.checked)
                }
              />
            }
          />
          <FormControl className={classes.formControl}>
            <InputLabel>Min</InputLabel>
            <Select
              key="min"
              value={formValues[stat.key + "_min"]}
              onChange={event => {
                setFormValue(stat.key + "_min", event.target.value);
              }}
            >
              {numericOptions.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel>Max</InputLabel>
            <Select
              key="max"
              value={formValues[stat.key + "_max"]}
              onChange={event => {
                setFormValue(stat.key + "_max", event.target.value);
              }}
            >
              {numericOptions.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ))}
    </div>
  );
};

export default withStyles(styles)(Optimizer);
