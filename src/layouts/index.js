import './App.scss';

import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React from 'react';
import config from '../../gatsby-config';

const TemplateWrapper = ({ children }) => (
    <div className="sans-serif">
        <Helmet>
            <title>{`${config.siteMetadata.title}`}</title>
            <meta
                name="description"
                content={config.siteMetadata.description}
            />
        </Helmet>
        <main className="page-content">
            <div className="wrapper lh-copy">{children()}</div>
        </main>
    </div>
);

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

export default TemplateWrapper;
