import React from 'react';
import { Player } from 'video-react';
import 'video-react/dist/video-react.css';

const IMAGE_BASE = 'http://images.osteele.com/design-elements';
const MOVIE_BASE = 'http://movies.osteele.com/design-elements';
const IMAGE_SUFFIX = '-640x360-00001.jpg';

const Sighting = (props) => {
  const playing = true;
  let { movie, poster_url: posterUrl } = props;
  if (movie && !movie.startsWith('http')) {
    movie = `${MOVIE_BASE}/${encodeURI(movie)}.mp4`;
  }
  if (posterUrl && !posterUrl.startsWith('http')) {
    posterUrl = `${IMAGE_BASE}/${encodeURI(posterUrl)}${IMAGE_SUFFIX}`;
  }
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
          poster={posterUrl}
          src={movie}
        />
      ) : (
        <h3 style={{ backgroundImage: `url(${posterUrl})` }} onClick={() => movie && this.setState({ playing: true })}>
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
