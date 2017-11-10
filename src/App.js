import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import logo from './logo.svg';

let config = {
  apiKey: "AIzaSyDW_PeMTIDfRwff2vev-PzQS2R1IV9_ZN0",
  authDomain: "olin-odes.firebaseapp.com",
  projectId: "olin-odes",
  storageBucket: "olin-odes.appspot.com",
};
let firebase = window.firebase;
firebase.initializeApp(config);
let db = firebase.firestore();
let storage = firebase.storage();
let storageRef = storage.ref();

class App extends Component {
  render() {
    return <ODE ode-key='foster-student-autonomy' />
  }
}

class ODE extends Component {
  constructor(props) {
    super(props);
    this.state = { ode: {}, sightings: [] };
  }

  componentWillMount() {
    db.collection('odes').doc(this.props['ode-key']).get().then((doc) => {
      this.setState({ ode: doc.data() })
    }).catch(console.error);
    db.collection('sightings').get().then((qs) => {
      let sightings = [];
      qs.forEach((ds) => {
        let s = ds.data()
        s.key = ds.id;
        sightings.push(s)
      })
      this.setState({ sightings })
    }).catch(console.error);
  }

  render() {
    return (
      <div>
        <header>
          <img src={logo} alt="logo" />
          <div>Design Elements</div>
        </header>

        <h1>{this.state.ode.title}</h1>
        <p className="desc">
          {this.state.ode.description}
        </p>

        <div>
          <header className="sightings">
            <h2>Sightings</h2>
          </header>
          <section className="sightings">
            {this.state.sightings.map((x) => <Sighting key={x.key} {...x} />)}
          </section>
        </div>
      </div>
    );
  }
}

class Sighting extends Component {
  constructor(props) {
    super(props);
    this.state = { background: 'blue' };
  }

  componentWillMount() {
    if (this.props.poster) {
      let posterRef = storageRef.child(this.props.poster);
      posterRef.getDownloadURL().then((poster_url) => {
        this.setState({ background: `url(${poster_url})` });
      }).catch(console.error);
    }
  }

  render() {
    let props = this.props;
    return <section className="sighting" key={props.key}>
      <h3 style={{ background: this.state.background }}>{props.title}</h3>
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
  }
}

export default App;
