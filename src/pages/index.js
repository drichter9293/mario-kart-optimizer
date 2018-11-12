import React, { useState } from "react";

import { setConfig } from "react-hot-loader";
import { graphql } from "gatsby";
import Img from "gatsby-image";
import { Select, MenuItem } from "@material-ui/core";

import StatsDisplay from "../components/StatsDisplay";

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
      <Select
        value={selectedCharacterIndex}
        onChange={event => setSelectedCharacterIndex(event.target.value)}
      >
        {characters.map(({ node }, index) => (
          <MenuItem key={index} value={index}>
            {node.name}
          </MenuItem>
        ))}
      </Select>
      <Select
        value={selectedBodyIndex}
        onChange={event => setSelectedBodyIndex(event.target.value)}
      >
        {bodies.map(({ node }, index) => (
          <MenuItem key={index} value={index}>
            {node.name}
          </MenuItem>
        ))}
      </Select>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <Img fixed={selectedCharacter.icon.childImageSharp.fixed} />
        <Img fixed={selectedBody.icon.childImageSharp.fixed} />
        <StatsDisplay character={selectedCharacter} body={selectedBody} />
      </div>
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
