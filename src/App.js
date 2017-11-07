import React, { Component } from 'react';
import './App.css';
import logo from './logo.svg';

var text = `
There’s no substitute for the experience of working with a live client - real schedules, real feedback, real politics, real changes, etc.…

1. STUDENT PRESENTATION
In order to present the work to clients students are forced to put words to the work that they have done in a way that allows an outside audience to understand whats being shown.

2. CLIENT RESPONSE
Instant feedback, both through body language and verbal response, exposes students to authentic critique which will allow them to deliver a stronger second round of designs.
This interaction also “ups the ante” for students and creates a motivation for delivering appropriate solutions for their specific audience.

3. PROFESSOR INPUT
At the end of the meeting the professor takes the opportunity to add in anything that the student may have missed.
This serves as instant feedback for the student on then quality of their presentation and creates the feeling of presenting as a team rather than the student feeling like the success of failure of the presentation rests only on them.

>> READ MORE
NARRATED BY: Tim Ferguson Sauder
OTHERS INVOLVED: Annabel Consilvio, Kristen O’Neil
`

class App extends Component {
  render() {
    return (
      <div class="App">
        <header>
          <img src={logo} alt="logo" />
          <div>Design Elements</div>
        </header>
        <h1>Foster Student Autonomy</h1>
        <p class="desc">
          “Student development of self-directed learning skills is critical for success in today’s rapidly-changing engineering world. The details of how instructors may best foster engagement in life-long learning, however, are unclear; many educators have struggled to define, implement, and assess lifelong learning in engineering curricula.”
          – JON STOLK
        </p>
        <div class="sightings">
          <header>
            <h2>Sightings</h2>
          </header>
          <section class="sighting">
            <h3 style={{ background: 'url(logox.svg)' }}>Student-Run Meetings</h3>
            <dl>
              <dt>Professor</dt>
              <dd>Tim Ferguson Sauder</dd>
              <dt>Class</dt>
              <dd>Return Design Studio Practicum</dd>
            </dl>
            {text}
          </section>
        </div>
      </div>
    );
  }
}

export default App;
