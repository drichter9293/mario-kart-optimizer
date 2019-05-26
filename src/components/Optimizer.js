import React, { useState } from "react";

import {
  Button,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  withStyles,
  Typography
} from "@material-ui/core";

import { useFormState } from "../utils/form";
import { standardize } from "../utils/stats";
import { STATS } from "../constants";

import OptimizerResults from "./OptimizerResults";

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit
  }
});

const getElementGroups = element => {
  const elementGroups = {};
  element.forEach(({ node }) => {
    if (!elementGroups[node.group]) {
      elementGroups[node.group] = node;
    }
  });
  return elementGroups;
};

const getOptimizedIndicesWithLimits = ({
  characters,
  bodies,
  tires,
  gliders,
  stats,
}) => {
  const characterGroups = getElementGroups(characters);
  const bodyGroups = getElementGroups(bodies);
  const tireGroups = getElementGroups(tires);
  const gliderGroups = getElementGroups(gliders);

  let groupCombos = [];

  let maxSum = Number.MIN_VALUE;
  Object.values(characterGroups).forEach(characterGroup => {
    Object.values(bodyGroups).forEach(bodyGroup => {
      Object.values(tireGroups).forEach(tireGroup => {
        Object.values(gliderGroups).forEach(gliderGroup => {
          let totalSum = 0
          let withinRestraints = true;
          stats.forEach((stat) => {
            const sum = standardize(characterGroup[stat.key], bodyGroup[stat.key], tireGroup[stat.key], gliderGroup[stat.key]);
            if (sum < stat.min || sum > stat.max) {
              withinRestraints = false;
            }
            if (stat.checked) {
              totalSum += sum;
            }
          })

          if (withinRestraints) {
            if (totalSum > maxSum) {
              groupCombos = [
                {
                  characterGroup: characterGroup.group,
                  bodyGroup: bodyGroup.group,
                  tireGroup: tireGroup.group,
                  gliderGroup: gliderGroup.group
                }
              ];
              maxSum = totalSum;
            } else if (totalSum === maxSum) {
              groupCombos.push({
                characterGroup: characterGroup.group,
                bodyGroup: bodyGroup.group,
                tireGroup: tireGroup.group,
                gliderGroup: gliderGroup.group
              });
            }
          }
        });
      });
    });
  });

  return groupCombos;
};

const Optimizer = React.memo(props => {
  const initialValues = STATS.reduce((initialValues, stat) => {
    initialValues[stat.key + "_checked"] = false;
    initialValues[stat.key + "_min"] = "0.00";
    initialValues[stat.key + "_max"] = "6.00";
    return initialValues;
  }, {});
  const [formValues, setFormValue] = useFormState(initialValues);
  const [optimizedGroupCombos, setOptimizedGroupCombos] = useState([]);

  const onOptimize = () => {
    const stats = STATS.map(stat => ({
      key: stat.key,
      checked: formValues[stat.key + "_checked"],
      min: formValues[stat.key + "_min"],
      max: formValues[stat.key + "_max"]
    }));

    if (!stats.length) {
      return;
    }

    const optimizedGroupCombos = getOptimizedIndicesWithLimits({
      characters: props.characters,
      bodies: props.bodies,
      tires: props.tires,
      gliders: props.gliders,
      stats
    });

    setOptimizedGroupCombos(optimizedGroupCombos);
  };

  const numericOptions = [];
  for (let i = 0; i <= 6; i += 0.25) {
    numericOptions.push(i.toFixed(2));
  }

  const { classes } = props;

  return (
    <div style={{ display: "flex" }}>
      <div>
        <div>
          <Typography variant="h4">
            Optimizer
          </Typography>
          <div>- Optimize sum of the selected statistics</div>
          <div>- Update min and max to restrict the results</div>
        </div>
        <div>
          {STATS.map(stat => (
            <div key={stat.key} style={{ width: "350px" }}>
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
              <FormControl key="min" className={classes.formControl}>
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
              <FormControl key="max" className={classes.formControl}>
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
        <Button variant="contained" color="primary" onClick={onOptimize}>
          Optimize
        </Button>
      </div>
      {optimizedGroupCombos.length > 0 && (
        <OptimizerResults
          groupCombos={optimizedGroupCombos}
          characters={props.characters}
          bodies={props.bodies}
          tires={props.tires}
          gliders={props.gliders}
          setSelectedElements={props.setSelectedElements}
        />
      )}
    </div>
  );
});

export default withStyles(styles)(Optimizer);
