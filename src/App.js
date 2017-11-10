import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import logo from './logo.svg';
import sightingsLogo from './sightings.svg';

var config = {
  apiKey: "AIzaSyDW_PeMTIDfRwff2vev-PzQS2R1IV9_ZN0",
  authDomain: "olin-odes.firebaseapp.com",
  projectId: "olin-odes",
};
var firebase = window.firebase;
firebase.initializeApp(config);
var db = firebase.firestore();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { sightings: [] };
  }

  componentWillMount() {
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
      <div className="App">
        <header>
          <img src={logo} alt="logo" />
          <div>Design Elements</div>
        </header>
        <h1>Foster Student Autonomy</h1>
        <p className="desc">
          “Student development of self-directed learning skills is critical for success in today’s rapidly-changing engineering world. The details of how instructors may best foster engagement in life-long learning, however, are unclear; many educators have struggled to define, implement, and assess lifelong learning in engineering curricula.”
          – JON STOLK
        </p>

        <div >
          <header className="sightings">
            <h2><img src={sightingsLogo} alt="logo" />Sightings</h2>
          </header>
          <section className="sighting-list">
            {this.state.sightings.map(Sighting)}
          </section>
        </div>
      </div>
    );
  }
}

function Sighting(props) {
  return <section className="sighting" key={props.key}>
    <h3 style={{ background: 'url(poster.png)' }}>{props.title}</h3>
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

export default App;
