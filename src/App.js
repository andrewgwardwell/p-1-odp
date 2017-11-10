import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import './App.css';
import logo from './logo.svg';
import { firebase } from './firebase';

class App extends Component {
  static childContextTypes = {
    firestore: PropTypes.object,
    storage: PropTypes.object,
  };

  getChildContext() {
    const firestore = firebase.firestore()
    const storageRef = firebase.storage().ref();
    return { firestore, storage: storageRef };
  }

  render() {
    return <ODEContainer ode-key='foster-student-autonomy' />
  }
}

class ODEContainer extends Component {
  static contextTypes = {
    firestore: PropTypes.object
  };

  state = { ode: {}, sightings: [] };

  componentWillMount() {
    const db = this.context.firestore;
    db.collection('odes').doc(this.props['ode-key']).get().then(
      doc => this.setState({ ode: doc.data() }),
      error => console.error(error)
    );
    db.collection('sightings').get().then((qs) => {
      const sightings = [];
      qs.forEach((ds) => {
        const s = ds.data()
        s.key = ds.id;
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
    if (this.props.poster) {
      const { storage } = this.context;
      const posterRef = storage.child(this.props.poster);
      posterRef.getDownloadURL().then(
        poster_url => this.setState({ background: `url(${poster_url})` }),
        error => console.error(error)
      )
    }
  }

  render = () => <Sighting background={this.state.background} {...this.props} />
}

const Sighting = (props) =>
  <section className="sighting" key={props.key}>
    <h3 style={{ background: props.background }}>{props.title}</h3>
    <dl>
      <dt>Professor</dt>
      <dd>{props.instructors}</dd>
      <dt>Class</dt>
      <dd>{props.course}</dd>
    </dl>
    <ReactMarkdown source={props.description.replace(/\\n/g, '\n')} />
    <dl>
      <dt>Narrated by</dt>
      <dd>{props.narrators}</dd>
      <dt>Others involved</dt>
      <dd>{props.participants}</dd>
    </dl>
  </section>

export default App;
