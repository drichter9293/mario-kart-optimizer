import React from "react";

import { BarChart, Bar, ReferenceLine, XAxis, YAxis } from "recharts";
import statUtils from "../utils/stats";

const CharacterStats = props => {
  const data = [
    {
      category: "Speed",
      value: statUtils.standardizeSpeed({
        characterPoints: props.character.speed
      })
    },
    {
      category: "Acceleration",
      value: statUtils.standardizeAcceleration({
        characterPoints: props.character.acceleration
      })
    },
    {
      category: "Weight",
      value: statUtils.standardizeWeight({
        characterPoints: props.character.weight
      })
    },
    {
      category: "Handling",
      value: statUtils.standardizeHandling({
        characterPoints: props.character.handling
      })
    },
    {
      category: "Traction",
      value: statUtils.standardizeTraction({
        characterPoints: props.character.traction
      })
    },
    {
      category: "Mini Turbo",
      value: statUtils.standardizeTurbo({
        characterPoints: props.character.turbo
      })
    }
  ];

  return (
    <BarChart
      data={data}
      height={150}
      width={500}
      layout="vertical"
      barCategoryGap={"20%"}
      style={{
        backgroundColor: "rgb(52, 126, 150)",
        borderRadius: 10
      }}
      margin={{ top: 5, right: 10, bottom: 5, left: 5 }}
    >
      <YAxis
        type="category"
        dataKey="category"
        width={95}
        tick={{ fill: "white" }}
        axisLine={false}
        tickLine={false}
      />
      <XAxis type="number" domain={[0, 6]} hide={true} />
      <Bar
        dataKey="value"
        fill="rgb(253, 238, 80"
        background={{ fill: "rgb(23, 62, 74)", radius: 5 }}
        radius={5}
      />
      {[1, 2, 3, 4, 5].map(index => (
        <ReferenceLine
          x={index}
          stroke="rgb(52, 126, 150)"
          strokeWidth={3}
          isFront={true}
        />
      ))}
    </BarChart>
  );
};

export default CharacterStats;
