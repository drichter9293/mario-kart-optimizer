import { STATS } from "../constants";

const standardize = (characterPoints, bodyPoints, tirePoints, gliderPoints) => {
  const level = characterPoints + bodyPoints + tirePoints + gliderPoints;

  return (level + 3) / 4;
};

export const getStandardizedStats = ({ character, body, tire, glider }) => {
  return STATS.reduce((stats, stat) => {
    const characterPoints = character ? character[stat.key] : 0;
    const bodyPoints = body ? body[stat.key] : 0;
    const tirePoints = tire ? tire[stat.key] : 0;
    const gliderPoints = glider ? glider[stat.key] : 0;
    stats[stat.key] = standardize(
      characterPoints,
      bodyPoints,
      tirePoints,
      gliderPoints
    );
    return stats;
  }, {});
};
