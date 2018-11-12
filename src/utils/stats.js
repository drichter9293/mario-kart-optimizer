const STANDARD_POINTS = {
  body: {
    speed: 3,
    acceleration: 4,
    weight: 2,
    handling: 3,
    traction: 3,
    turbo: 2
  },
  tire: {
    speed: 2,
    acceleration: 4,
    weight: 2,
    handling: 3,
    traction: 5,
    turbo: 3
  },
  glider: {
    speed: 1,
    acceleration: 1,
    weight: 1,
    handling: 1,
    traction: 1,
    turbo: 1
  }
};

const standardize = ({
  characterPoints,
  bodyPoints,
  tirePoints,
  gliderPoints,
  statistic
}) => {
  if (bodyPoints === undefined) bodyPoints = STANDARD_POINTS.body[statistic];
  if (tirePoints === undefined) tirePoints = STANDARD_POINTS.tire[statistic];
  if (gliderPoints === undefined)
    gliderPoints = STANDARD_POINTS.glider[statistic];

  const level = characterPoints + bodyPoints + tirePoints + gliderPoints;

  return (level + 3) / 4;
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
  standardizeSpeed,
  standardizeAcceleration,
  standardizeWeight,
  standardizeHandling,
  standardizeTraction,
  standardizeTurbo
};

export default statUtils;
