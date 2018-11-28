import React, { useState } from "react";

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

import OptimizerResults from "./OptimizerResults";

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
  statsToOptimize
}) => {
  const characterGroups = getElementGroups(characters);
  const bodyGroups = getElementGroups(bodies);
  const tireGroups = getElementGroups(tires);
  const gliderGroups = getElementGroups(gliders);

  let groupCombos = [];

  let maxSum = Number.MIN_VALUE;

  Object.values(characterGroups).forEach(characterGroup => {
    const characterSum = getStatSumForElement(characterGroup, statsToOptimize);
    Object.values(bodyGroups).forEach(bodyGroup => {
      const bodySum = getStatSumForElement(bodyGroup, statsToOptimize);
      Object.values(tireGroups).forEach(tireGroup => {
        const tireSum = getStatSumForElement(tireGroup, statsToOptimize);
        Object.values(gliderGroups).forEach(gliderGroup => {
          const gliderSum = getStatSumForElement(gliderGroup, statsToOptimize);
          const totalSum = characterSum + bodySum + tireSum + gliderSum;
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
        });
      });
    });
  });

  return groupCombos;
};

const Optimizer = props => {
  const initialValues = STATS.reduce((initialValues, stat) => {
    initialValues[stat.key + "_checked"] = false;
    initialValues[stat.key + "_min"] = "0.00";
    initialValues[stat.key + "_max"] = "6.00";
    return initialValues;
  }, {});
  const [formValues, setFormValue] = useFormState(initialValues);
  const [optimizedGroupCombos, setOptimizedGroupCombos] = useState([]);

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

    const optimizedGroupCombos = getOptimizedIndicesWithLimits({
      characters: props.characters,
      bodies: props.bodies,
      tires: props.tires,
      gliders: props.gliders,
      statsToOptimize
    });

    setOptimizedGroupCombos(optimizedGroupCombos);

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
    <div style={{ display: "flex" }}>
      <Button variant="contained" color="primary" onClick={onOptimize}>
        Optimize
      </Button>
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
      {optimizedGroupCombos.length > 0 && (
        <OptimizerResults
          groupCombos={optimizedGroupCombos}
          characters={props.characters}
          bodies={props.bodies}
          tires={props.tires}
          gliders={props.gliders}
        />
      )}
    </div>
  );
};

export default withStyles(styles)(Optimizer);
