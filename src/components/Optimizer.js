import React from "react";

import {
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";

import { useFormState } from "../utils/form";
import { STATS } from "../constants";

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
                  checked={formValues[stat.key + "_checked"]}
                  onChange={event =>
                    setFormValue(stat.key + "_checked", event.target.checked)
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
