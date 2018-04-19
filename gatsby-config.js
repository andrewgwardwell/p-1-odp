module.exports = {
  siteMetadata: {
    title: 'Olin Design Principles',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'markdown-pages',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-plugin-sharp',
          'gatsby-remark-smartypants',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 500,
              linkImagesToOriginal: true,
            },
          },
        ],
        options: {
          dashes: 'oldschool',
        },
      },
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-nprogress',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
  ],
};
