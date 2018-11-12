import React, { useState } from "react";

import {
  Button,
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

const getOptimizedIndices = ({ characters, bodies, statsToOptimize }) => {
  const characterIndices = getElementIndexOptimizedForStats(
    characters,
    statsToOptimize
  );
  const bodyIndices = getElementIndexOptimizedForStats(bodies, statsToOptimize);

  return {
    characterIndices,
    bodyIndices
  };
};

const Optimizer = props => {
  const [formValues, setFormValue] = useFormState();

  const onOptimize = () => {
    const statsToOptimize = [];
    Object.entries(formValues).forEach(([key, value]) => {
      if (value) {
        statsToOptimize.push(key);
      }
    });

    if (!statsToOptimize.length) {
      return;
    }

    const optimizedIndices = getOptimizedIndices({
      characters: props.characters,
      bodies: props.bodies,
      statsToOptimize
    });

    const characterIndex = optimizedIndices.characterIndices[0];
    const bodyIndex = optimizedIndices.bodyIndices[0];

    props.setSelectedCharacterIndex(characterIndex);
    props.setSelectedBodyIndex(bodyIndex);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={onOptimize}>
        Optimize
      </Button>
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
                  onChange={event =>
                    setFormValue(stat.key, event.target.checked)
                  }
                />
              }
            />
          ))}
        </FormGroup>
      </FormControl>
    </div>
  );
};

export default Optimizer;
