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
  const characters = data.allCharactersJson.edges;
  const selectedCharacter = characters[selectedCharacterIndex].node;

  const [selectedBodyIndex, setSelectedBodyIndex] = useState(0);
  const bodies = data.allBodiesJson.edges;
  const selectedBody = bodies[selectedBodyIndex].node;

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
        </div>
        <Img fixed={selectedCharacter.icon.childImageSharp.fixed} />
        <Img fixed={selectedBody.icon.childImageSharp.fixed} />
        <StatsDisplay character={selectedCharacter} body={selectedBody} />
      </div>
      <Optimizer
        characters={characters}
        bodies={bodies}
        setSelectedCharacterIndex={setSelectedCharacterIndex}
        setSelectedBodyIndex={setSelectedBodyIndex}
      />
    </>
  );
};

export const query = graphql`
  query {
    allCharactersJson {
      edges {
        node {
          name
          icon {
            childImageSharp {
              fixed(width: 125, height: 125) {
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
    allBodiesJson {
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
  }
`;
