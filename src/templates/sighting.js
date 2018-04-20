import React from 'react';
import Helmet from 'react-helmet';
import get from 'lodash/get';
import Sighting from '../components/Sighting';

const SightingTemplate = ({ data, props }) => {
  const post = data.markdownRemark;
  const siteTitle = get(props, 'site.siteMetadata.title');

  return (
    <div>
      <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
      <Sighting html={post.html} {...post.frontmatter} />
    </div>
  );
};

export default SightingTemplate;

export const pageQuery = graphql`
  query SightingByPath($path: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      id
      html
      frontmatter {
        course
        instructors
        movie
        narrators
        participants
        poster_url
        principles
        title
      }
    }
  }
`;
