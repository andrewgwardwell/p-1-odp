import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactMarkdown from 'react-markdown';
import { firebase } from './firebase';
import { Player } from 'video-react';
import "video-react/dist/video-react.css";

import './App.css';
import logo from './logo.svg';

const IMAGE_BASE = 'http://images.osteele.com/design-elements/';
const MOVIE_BASE = 'http://movies.osteele.com/design-elements/';
const IMAGE_SUFFIX = '-640x360-00001.jpg'

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
      .then(
      ({ valid }) => this.setState({ valid }),
      error => console.log('parsing failed', error)
      );
  }

  getChildContext() {
    const firestore = firebase.firestore()
    const storageRef = firebase.storage().ref();
    return { firestore, storage: storageRef };
  }

  render() {
    const { valid } = this.state;
    if (valid == null) {
      return "Authorizing…";
    } else if (valid) {
      return <ODEContainer ode-key='foster-student-autonomy' />
    } else {
      return "This site can currently be viewed only from within the Olin intranet.";
    }
  }
}

class ODEContainer extends Component {
  static contextTypes = {
    firestore: PropTypes.object
  };

  state = { ode: {}, sightings: [] };

  componentWillMount() {
    const db = this.context.firestore;
    db.collection('elements').doc(this.props['ode-key']).get().then(
      doc => this.setState({ ode: doc.data() }),
      error => console.error(error)
    );
    db.collection('sightings').get().then((qs) => {
      const sightings = [];
      qs.forEach((ds) => {
        const s = ds.data()
        s.key = ds.id;
        const { movie, poster_url } = s
        if (movie && !movie.startsWith('http')) {
          s.movie = MOVIE_BASE + movie.replace(/ /g, '%20') + '.mp4';
        }
        if (poster_url && !poster_url.startsWith('http')) {
          s.poster_url = IMAGE_BASE + poster_url.replace(/ /g, '%20') + IMAGE_SUFFIX;
        }
        console.info(s.title, s.poster_url)
        sightings.push(s)
      })
      this.setState({ sightings })
    }).catch(console.error);
  }

  render = () => <ODE {...this.state } />
}

const ODE = (props) =>
  <div>
    <header>
      <img src={logo} alt="logo" />
      <div>Design Elements</div>
    </header>

    <h1>{props.ode.title}</h1>
    <p className="desc">
      {props.ode.description}
    </p>

    <div>
      <header className="sightings">
        <h2>Sightings</h2>
      </header>
      <section className="sightings">
        {props.sightings.map((s) => <SightingContainer key={s.key} {...s} />)}
      </section>
    </div>
  </div>

class SightingContainer extends Component {
  static contextTypes = {
    storage: PropTypes.object
  };

  state = { background: 'blue' };

  componentWillMount() {
    const { poster, poster_url } = this.props;
    if (poster_url) {
      this.setState({ poster_url, background: `url(${poster_url})` })
    } else if (poster) {
      const { storage } = this.context;
      const posterRef = storage.child(poster);
      posterRef.getDownloadURL().then(
        poster_url => this.setState({ poster_url, background: `url(${poster_url})` }),
        error => console.error(error)
      )
    }
  }

  render = () => <Sighting {...this.state} {...this.props} />
}

class Sighting extends Component {
  state = {}

  render = () => {
    const { props, state } = this;
    return <section className="sighting">
      {state.playing ? <Player
        ref={player => {
          player.subscribeToStateChange(({ paused }) => {
          });
        }}
        playsInline
        fluid
        autoPlay
        preload="metadata"
        poster={props.poster_url}
        src={props.movie}
      /> : <h3 style={{ background: props.background }}
        onClick={() => props.movie && this.setState({ playing: true })}>
          {props.title}</h3>}
      <dl>
        <dt>Professor</dt>
        <dd>{props.instructors}</dd>
        <dt>Class</dt>
        <dd>{props.course}</dd>
      </dl>
      <ReactMarkdown className="description" source={props.description.replace(/\\n/g, '\n')} />
      <dl>
        <dt>Narrated by</dt>
        <dd>{props.narrators || props.instructors}</dd>
        <dt>Others involved</dt>
        <dd>{props.participants}</dd>
      </dl>
    </section>
  }
}

export default App;
