import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import get from 'lodash/get';

const IndexPage = ({ data, props }) => {
  const siteTitle = get(props, 'data.site.siteMetadata.title');
  const principles = data.allMarkdownRemark.edges.map(({ node }) => node);

  return (
    <div>
      <Helmet title={siteTitle} />
      <h1>Design Principles</h1>
      <ul>
        {principles.map(({ id, frontmatter: fm }) => (
          <li key={id}>
            <Link to={fm.path}>{fm.name}</Link>
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
};

export default IndexPage;

export const pageQuery = graphql`
  query indexPageQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(filter: { fields: { collection: { eq: "principles" } } }) {
      edges {
        node {
          id
          html
          frontmatter {
            path
            name
          }
        }
      }
    }
  }
`;
