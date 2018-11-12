import React from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";

export default ({ data }) => {
  const characters = data.allCharactersJson.edges;
  return (
    <>
      <div>
        {characters.map(({ node }, index) => (
          <Img key={index} fixed={node.icon.childImageSharp.fixed} />
        ))}
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
        }
      }
    }
  }
`;
