const fs = require('fs');
const path = require('path');

const { createFilePath } = require('gatsby-source-filesystem');
const moment = require('moment');

const baseAbsolutePath = path.join(__dirname, 'src', 'pages');

exports.createPages = async ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;
  const topicTemplate = path.resolve('src/templates/topic.js');
  const collectionTemplates = {
    sightings: path.resolve('src/templates/sighting.js'),
    principles: path.resolve('src/templates/principle.js'),
    default: path.resolve('src/templates/page.js'),
  };
  const query = graphql(nodeQuery);
  const result = await query;

  if (result.errors) {
    console.error(result.errors);
    return Promise.reject(result.errors);
  }

  // create markdown pages
  const markdownNodes = result.data.allMarkdownRemark.edges.map(({ node }) => node);
  markdownNodes.forEach((node) => {
    const { path } = node.frontmatter;
    const relativePath = node.fileAbsolutePath.slice(baseAbsolutePath.length);
    const collection = getPathCollection(relativePath);
    const component = collectionTemplates[collection] || collectionTemplates.default;
    createPage({ path, component, context: {} });
  });

  // collect markdown page topics
  const topics = {};
  markdownNodes.forEach((post) => {
    (post.frontmatter.topics || []).forEach((topic) => {
      // eslint-disable-next-line no-multi-assign
      const topicPosts = (topics[topic] = topics[topic] || []);
      topicPosts.push(post);
    });
  });

  // create topic pages
  Object.keys(topics).forEach((topic) => {
    const path = `/topics/${topic}`;
    createPage({
      path,
      component: topicTemplate,
      context: { topic },
    });
  });
};

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators;
  const { internal, frontmatter: fm } = node;

  // Set default frontmatter collection, date, slug, and title from pathname.
  if (internal.type === 'MarkdownRemark') {
    const relativePath = createFilePath({ node, getNode, basePath: 'pages' });
    const collection = getPathCollection(relativePath);
    {
      const m = path.basename(relativePath).match(/^(\d{4}-\d{2}-\d{2})-(.+)/);
      if (m) {
        const [, date, slug] = m;
        if (!fm.date) fm.date = `${moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS')}Z`;
        if (!fm.slug) fm.slug = slugify(slug);
        if (!fm.title) fm.title = titleize(slug);
      } else {
        const m = relativePath.match(/([^/]+)\/?$/);
        const [, slug] = m;
        if (!fm.slug) fm.slug = slugify(slug);
        if (!fm.title) fm.title = titleize(slug);
      }
    }
    // This needs to come after the previous block, since this block relies on
    // the frontmatter date that that block may have set.
    if (!fm.path) {
      const slug = fm.slug || slugify(fm.title);
      fm.path =
        collection === 'posts'
          ? replaceLastComponent(
            relativePath,
            `${moment(fm.date)
              .utc()
              .format('YYYY/MM/DD')}/${slug}`,
          )
          : collection === 'handouts'
            ? replaceLastComponent(
              relativePath,
              `${moment(fm.date)
                .utc()
                .format('YYYY-MM-DD')}-${slug}`,
            )
            : relativePath;
    }
    if (fm.thumbnail) {
      const thumbnailPath = path.join(path.dirname(node.fileAbsolutePath), fm.thumbnail);
      if (!fs.existsSync(thumbnailPath)) {
        console.error(`Missing image: ${relativePath} specifies ${fm.thumbnail}`);
      }
    }
    createNodeField({ node, name: 'collection', value: collection });
    createNodeField({ node, name: 'slug', value: fm.path });
  }
};

const capitalize = str => (str.length > 0 ? str.slice(0, 1).toUpperCase() + str.slice(1) : str);

const titleize = str => capitalize(str).replace(/-./g, str => ` ${str.slice(1).toUpperCase()}`);

const getPathCollection = (relativePath) => {
  const m = relativePath.match(/\/(.+?)\/[^/]/);
  return m && m[1];
};

const slugify = s => s.replace(/[^a-z0-9]+/gi, '-').toLowerCase();

const replaceLastComponent = (path, slug) => {
  const components = path.split('/');
  let index = components.length - 1;
  if (components[index] === '') {
    index -= 1;
  }
  components[index] = slug;
  return components.join('/');
};

const nodeQuery = `
{
  allMarkdownRemark(
    sort: { order: DESC, fields: [] }
    limit: 1000
  ) {
    edges {
      node {
        fileAbsolutePath
        frontmatter {
          path
          principles
        }
      }
    }
  }
}
`;