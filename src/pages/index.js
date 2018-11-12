import React from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";

import CharacterStats from "../components/CharacterStats";

export default ({ data }) => {
  const characters = data.allCharactersJson.edges;
  return (
    <>
      {characters.map(({ node }, index) => (
        <div
          key={index}
          style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
        >
          <Img fixed={node.icon.childImageSharp.fixed} />
          <CharacterStats character={node} />
        </div>
      ))}
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
