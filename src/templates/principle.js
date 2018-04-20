import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import get from 'lodash/get';
import Principle from '../components/Principle';

const PrincipleTemplate = ({ data }) => {
  const siteTitle = get(data, 'site.siteMetadata.title');
  const post = data.markdownRemark;
  const sightings = data.allMarkdownRemark.edges.map(({ node }) => node);

  return (
    <div>
      <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
      <Principle description={post.html} sightings={sightings} {...post.frontmatter} />
      <hr />
      <h2>Sightings</h2>
      <ul>
        {sightings.map(({ id, frontmatter: fm }) => (
          <li key={id}>
            <Link to={fm.path}>{fm.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrincipleTemplate;

export const pageQuery = graphql`
  query PrincipleByPath($path: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      id
      html
      frontmatter {
        title
        principles
      }
    }
    allMarkdownRemark(filter: { fields: { collection: { eq: "sightings" } } }) {
      edges {
        node {
          id
          html
          frontmatter {
            course
            instructors
            movie
            narrators
            participants
            path
            poster_url
            title
          }
        }
      }
    }
  }
`;
