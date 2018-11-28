import React from "react";

import Img from "gatsby-image";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from "@material-ui/core";

import { STATS } from "../constants";

const getElementsByGroup = elements => {
  return elements.reduce((reduction, element) => {
    if (!reduction[element.node.group]) {
      reduction[element.node.group] = [element.node];
    } else {
      reduction[element.node.group].push(element.node);
    }
    return reduction;
  }, {});
};

const getTotalStatSumForElement = element => {
  return STATS.reduce((accumulator, stat) => {
    return accumulator + element[stat.key];
  }, 0);
};

const IconCell = ({ elements }) => {
  return (
    <TableCell>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {elements.map(element => (
          <Img
            key={element.name}
            style={{ width: "40px" }}
            fluid={element.icon.childImageSharp.fluid}
          />
        ))}
      </div>
    </TableCell>
  );
};

const OptimizerResults = ({
  groupCombos,
  characters,
  bodies,
  tires,
  gliders
}) => {
  const charactersByGroup = getElementsByGroup(characters);
  const bodiesByGroup = getElementsByGroup(bodies);
  const tiresByGroup = getElementsByGroup(tires);
  const glidersByGroup = getElementsByGroup(gliders);

  const getScoreForCombo = combo => {
    const characters = charactersByGroup[combo.characterGroup];
    const bodies = bodiesByGroup[combo.bodyGroup];
    const tires = tiresByGroup[combo.tireGroup];
    const gliders = glidersByGroup[combo.gliderGroup];
    const characterScore = getTotalStatSumForElement(characters[0]);
    const bodyScore = getTotalStatSumForElement(bodies[0]);
    const tireScore = getTotalStatSumForElement(tires[0]);
    const gliderScore = getTotalStatSumForElement(gliders[0]);
    return characterScore + bodyScore + tireScore + gliderScore;
  };

  const sortedGroups = groupCombos.sort((a, b) => {
    const scoreA = getScoreForCombo(a);
    const scoreB = getScoreForCombo(b);
    return scoreB - scoreA;
  });

  const top20Groups = sortedGroups.slice(0, 20);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell numeric>Average Score</TableCell>
          <TableCell>Character</TableCell>
          <TableCell>Body</TableCell>
          <TableCell>Tire</TableCell>
          <TableCell>Glider</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {top20Groups.map(combo => {
          const comboScore = getScoreForCombo(combo);
          const averageStatScore = (comboScore / 6).toFixed(2);
          return (
            <TableRow>
              <TableCell numeric>{averageStatScore}</TableCell>
              <IconCell elements={charactersByGroup[combo.characterGroup]} />
              <IconCell elements={bodiesByGroup[combo.bodyGroup]} />
              <IconCell elements={tiresByGroup[combo.tireGroup]} />
              <IconCell elements={glidersByGroup[combo.gliderGroup]} />
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default OptimizerResults;
