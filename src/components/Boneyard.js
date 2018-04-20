import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactMarkdown from 'react-markdown';
import { firebase } from './firebase';
import { Player } from 'video-react';
import 'video-react/dist/video-react.css';

import './App.css';
import logo from './logo.svg';

const IMAGE_BASE = 'http://images.osteele.com/design-elements/';
const MOVIE_BASE = 'http://movies.osteele.com/design-elements/';
const IMAGE_SUFFIX = '-640x360-00001.jpg';

class App extends Component {
  static childContextTypes = {
    firestore: PropTypes.object,
    storage: PropTypes.object,
  };

  state = { valid: null };

  componentWillMount() {
    let apiURL = '';
    if (process.env.NODE_ENV === 'development') {
      // apiURL = 'http://localhost:5000/olin-odes/us-central1';
      apiURL = 'https://elements.olin.build';
    }
    fetch(apiURL + '/client/valid')
      .then(res => res.json())
      .then(state => this.setState(state), error => console.log('parsing failed', error));
  }

  getChildContext() {
    const firestore = firebase.firestore();
    const storageRef = firebase.storage().ref();
    return { firestore, storage: storageRef };
  }

  render() {
    const { client_ip, valid } = this.state;
    if (valid == null) {
      return 'Authorizing…';
    } else if (valid) {
      return <ElementList />;
    } else {
      return (
        <div>
          <p>This site can currently be viewed only from within the Olin intranet.</p>
          <p>To use it from outside the network, contact the developer to add {client_ip} to the whitelist.</p>
        </div>
      );
    }
  }
}

class ElementList extends Component {
  static contextTypes = {
    firestore: PropTypes.object,
  };
  state = { elements: [] };
  componentWillMount() {
    const db = this.context.firestore;
    db
      .collection('elements')
      .get()
      .then(
        qs => {
          const elements = [];
          qs.forEach(ds => {
            const el = ds.data();
            el.key = ds.id;
            elements.push(el);
          });
          this.setState({ elements });
        },
        error => console.error(error),
      );
  }
  render = () => this.state.elements.map(el => <ElementContainer key={el.key} element-key={el.key} />);
}

class ElementContainer extends Component {
  static contextTypes = {
    firestore: PropTypes.object,
  };

  state = { element: {}, sightings: [] };

  componentWillMount() {
    const db = this.context.firestore;
    const key = this.props['element-key'];
    db
      .collection('elements')
      .doc(key)
      .get()
      .then(doc => this.setState({ element: doc.data() }), error => console.error(error));
    let q = db.collection('sightings');
    if (key === 'uncategorized') {
      q = q.where('uncategorized', '==', true);
    } else {
      q = q.where('elements.' + key, '==', true);
    }
    q
      .get()
      .then(qs => {
        const sightings = [];
        qs.forEach(ds => {
          const sighting = ds.data();
          sighting.key = ds.id;
          const { movie, poster_url } = sighting;
          if (movie && !movie.startsWith('http')) {
            sighting.movie = MOVIE_BASE + movie.replace(/ /g, '%20') + '.mp4';
          }
          if (poster_url && !poster_url.startsWith('http')) {
            sighting.poster_url = IMAGE_BASE + poster_url.replace(/ /g, '%20') + IMAGE_SUFFIX;
          }
          sightings.push(sighting);
        });
        this.setState({ sightings });
      })
      .catch(console.error);
  }

  render = () => <Element {...this.state} />;
}

const Element = props => (
  <div>
    <header>
      <img src={logo} alt="logo" />
      <div>Design Elements</div>
    </header>

    <h1>{props.element.title}</h1>
    <p className="desc">{props.element.description}</p>

    <div>
      <header className="sightings">
        <h2>Sightings</h2>
      </header>
      <section className="sightings">{props.sightings.map(s => <SightingContainer key={s.key} {...s} />)}</section>
    </div>
  </div>
);

export default App;
