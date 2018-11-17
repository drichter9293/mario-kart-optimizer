import React, { useState } from "react";

import { setConfig } from "react-hot-loader";
import { graphql } from "gatsby";
import Img from "gatsby-image";

import StatsDisplay from "../components/StatsDisplay";
import ElementSelector from "../components/ElementSelector";
import Optimizer from "../components/Optimizer";

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

  return (
    <>
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
        <Img fixed={selectedCharacter.icon.childImageSharp.fixed} />
        <Img fixed={selectedBody.icon.childImageSharp.fixed} />
        <Img fixed={selectedTire.icon.childImageSharp.fixed} />
        <Img fixed={selectedGlider.icon.childImageSharp.fixed} />
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
        setSelectedCharacterIndex={setSelectedCharacterIndex}
        setSelectedBodyIndex={setSelectedBodyIndex}
        setSelectedTireIndex={setSelectedTireIndex}
        setSelectedGliderIndex={setSelectedGliderIndex}
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
        icon {
          childImageSharp {
            fixed(width: 200, height: 125) {
              ...GatsbyImageSharpFixed
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
