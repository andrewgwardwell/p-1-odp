import React from 'react';
import 'video-react/dist/video-react.css';
import logo from './logo.svg';
import Sighting from './Sighting';

const Principle = props => (
  <div>
    <header>
      <img src={logo} alt="logo" />
      <div>Design Principle</div>
    </header>

    <h1>{props.title}</h1>
    <div className="desc" dangerouslySetInnerHTML={{ __html: props.description }} />
    <div>
      <header className="sightings">
        <h2>Sightings</h2>
      </header>
      <section className="sightings">
        {props.sightings.map(({ id, html, frontmatter: fm }) => <Sighting key={id} html={html} {...fm} />)}
      </section>
    </div>
  </div>
);

export default Principle;
