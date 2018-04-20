import React from 'react';
import { Player } from 'video-react';

const Sighting = (props) => {
  const playing = false;
  console.info(props);
  return (
    <section className="sighting">
      {playing ? (
        <Player
          ref={(player) => {
            player.subscribeToStateChange(({ _paused }) => {});
          }}
          playsInline
          fluid
          autoPlay
          preload="metadata"
          poster={props.poster_url}
          src={props.movie}
        />
      ) : (
        <h3 style={{ background: props.background }} onClick={() => props.movie && this.setState({ playing: true })}>
          {props.title}
        </h3>
      )}
      <dl>
        <dt>Professor</dt>
        <dd>{props.instructors}</dd>
        <dt>Class</dt>
        <dd>{props.course}</dd>
      </dl>
      <div dangerouslySetInnerHTML={{ __html: props.html }} />
      <dl>
        <dt>Narrated by</dt>
        <dd>{props.narrators || props.instructors}</dd>
        <dt>Others involved</dt>
        <dd>{props.participants}</dd>
      </dl>
    </section>
  );
};

export default Sighting;
