const standardize = (characterPoints, bodyPoints, tirePoints, gliderPoints) => {
  const level = characterPoints + bodyPoints + tirePoints + gliderPoints;

  return (level + 3) / 4;
};

export const getStandardizedStats = ({ character, body, tire, glider }) => {
  return [
    "speed",
    "acceleration",
    "weight",
    "handling",
    "traction",
    "turbo"
  ].reduce((stats, stat) => {
    const characterPoints = character ? character[stat] : 0;
    const bodyPoints = body ? body[stat] : 0;
    const tirePoints = tire ? tire[stat] : 0;
    const gliderPoints = glider ? glider[stat] : 0;
    stats[stat] = standardize(
      characterPoints,
      bodyPoints,
      tirePoints,
      gliderPoints
    );
    return stats;
  }, {});
};

export const standardizeSpeed = points => {
  return standardize({ ...points, statistic: "speed" });
};

export const standardizeAcceleration = points => {
  return standardize({ ...points, statistic: "acceleration" });
};

export const standardizeWeight = points => {
  return standardize({ ...points, statistic: "weight" });
};

export const standardizeHandling = points => {
  return standardize({ ...points, statistic: "handling" });
};

export const standardizeTraction = points => {
  return standardize({ ...points, statistic: "traction" });
};

export const standardizeTurbo = points => {
  return standardize({ ...points, statistic: "turbo" });
};

const statUtils = {
  getStandardizedStats,
  standardizeSpeed,
  standardizeAcceleration,
  standardizeWeight,
  standardizeHandling,
  standardizeTraction,
  standardizeTurbo
};

export default statUtils;
