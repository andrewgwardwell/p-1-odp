import React from 'react';
import Helmet from 'react-helmet';
import get from 'lodash/get';
import Sighting from '../components/Sighting';

const SightingTemplate = ({ data, props }) => {
  const post = data.markdownRemark;
  const siteTitle = get(props, 'data.site.siteMetadata.title');

  return (
    <div>
      <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
      <Sighting post={post} html={post.html} frontmatter={post.frontmatter} />
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
        title
        instructors
        narrators
        poster_url
        principles
      }
    }
  }
`;
