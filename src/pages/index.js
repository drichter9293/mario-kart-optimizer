import React, { useState } from "react";

import { setConfig } from "react-hot-loader";
import { graphql } from "gatsby";
import Img from "gatsby-image";
import { Select, MenuItem } from "@material-ui/core";

import CharacterStats from "../components/CharacterStats";

// Unfortunate necessity to get hooks to work.
// Follow https://github.com/gatsbyjs/gatsby/issues/9489 for updates.
setConfig({ pureSFC: true });

export default ({ data }) => {
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(0);

  const characters = data.allCharactersJson.edges;
  const selectedCharacter = characters[selectedCharacterIndex].node;

  return (
    <>
      <Select
        value={selectedCharacterIndex}
        onChange={event => {
          console.log("handler", event.target.value);
          setSelectedCharacterIndex(event.target.value);
        }}
      >
        {characters.map(({ node }, index) => (
          <MenuItem key={index} value={index}>
            {node.name}
          </MenuItem>
        ))}
      </Select>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <Img fixed={selectedCharacter.icon.childImageSharp.fixed} />
        <CharacterStats character={selectedCharacter} />
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
  }
`;
