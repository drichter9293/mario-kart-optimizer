import React, { useState } from "react";

import { setConfig } from "react-hot-loader";
import { graphql } from "gatsby";

import StatsDisplay from "../components/StatsDisplay";
import ElementSelector from "../components/ElementSelector";
import Optimizer from "../components/Optimizer";

import { Typography } from '@material-ui/core'

// Unfortunate necessity to get hooks to work.
// Follow https://github.com/gatsbyjs/gatsby/issues/9489 for updates.
setConfig({ pureSFC: true });

export default ({ data }) => {
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(0);
  const characters = data.characters.edges;
  const selectedCharacter = characters[selectedCharacterIndex].node;

  const [selectedBodyIndex, setSelectedBodyIndex] = useState(0);
  const bodies = data.bodies.edges;
  const selectedBody = bodies[selectedBodyIndex].node;

  const [selectedTireIndex, setSelectedTireIndex] = useState(0);
  const tires = data.tires.edges;
  const selectedTire = tires[selectedTireIndex].node;

  const [selectedGliderIndex, setSelectedGliderIndex] = useState(0);
  const gliders = data.gliders.edges;
  const selectedGlider = gliders[selectedGliderIndex].node;

  const setSelectedElements = React.useCallback(({ characterIndex, bodyIndex, tireIndex, gliderIndex }) => {
    setSelectedCharacterIndex(characterIndex);
    setSelectedBodyIndex(bodyIndex);
    setSelectedTireIndex(tireIndex);
    setSelectedGliderIndex(gliderIndex);
  }, [setSelectedCharacterIndex, setSelectedBodyIndex, setSelectedTireIndex, setSelectedGliderIndex]);

  return (
    <>
      <Typography variant="h2" align="center">
        Mario Kart 8 Deluxe Optimizer
      </Typography>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <div>
          <ElementSelector
            elementName="Character"
            elements={characters}
            selectedElementIndex={selectedCharacterIndex}
            setSelectedElementIndex={setSelectedCharacterIndex}
          />
          <ElementSelector
            elementName="Body"
            elements={bodies}
            selectedElementIndex={selectedBodyIndex}
            setSelectedElementIndex={setSelectedBodyIndex}
          />
          <ElementSelector
            elementName="Tire"
            elements={tires}
            selectedElementIndex={selectedTireIndex}
            setSelectedElementIndex={setSelectedTireIndex}
          />
          <ElementSelector
            elementName="Glider"
            elements={gliders}
            selectedElementIndex={selectedGliderIndex}
            setSelectedElementIndex={setSelectedGliderIndex}
          />
        </div>
        <StatsDisplay
          character={selectedCharacter}
          body={selectedBody}
          tire={selectedTire}
          glider={selectedGlider}
        />
      </div>
      <Optimizer
        characters={characters}
        bodies={bodies}
        tires={tires}
        gliders={gliders}
        setSelectedElements={setSelectedElements}
      />
    </>
  );
};

export const query = graphql`
  query Data {
    characters: allJson(filter: { type: { eq: "character" } }) {
      ...DataFormatter
    }
    bodies: allJson(filter: { type: { eq: "body" } }) {
      ...DataFormatter
    }
    tires: allJson(filter: { type: { eq: "tire" } }) {
      ...DataFormatter
    }
    gliders: allJson(filter: { type: { eq: "glider" } }) {
      ...DataFormatter
    }
  }
`;

export const dataFieldsFragment = graphql`
  fragment DataFormatter on JsonConnection {
    edges {
      node {
        name
        group
        icon {
          childImageSharp {
            fluid(maxHeight: 150) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        speed
        acceleration
        weight
        handling
        traction
        turbo
      }
    }
  }
`;
