// @ts-check
import '../style.css';
// @ts-ignore
import { createMachine, assign, interpret, send } from 'xstate';
import elements from '../utils/elements';
import { raise } from 'xstate/lib/actions';
import { formatTime } from '../utils/formatTime';

const playerMachine = createMachine({
  initial: 'loading',
  context: {
    // Add initial context here for:
    // title, artist, duration, elapsed, likeStatus, volume
    title: undefined,
    artist: undefined,
    duration: 0,
    elapsed: 0,
    likeStatus: 'unliked',
    volume: 20,
  },
  states: {
    loading: {
      on: {
        LOADED: {
          actions: 'assignSongData',
          target: 'playing',
        },
      },
    },
    paused: {
      on: {
        PLAY: { target: 'playing' },
      },
    },
    playing: {
      entry: 'playAudio',
      exit: 'pauseAudio',
      on: {
        PAUSE: { target: 'paused' },
      },
    },
  },
  on: {
    SKIP: {
      actions: 'skipSong',
      target: 'loading',
    },
    LIKE: {
      actions: 'likeSong',
    },
    UNLIKE: {
      actions: 'unlikeSong',
    },
    DISLIKE: {
      actions: ['dislikeSong', raise('SKIP')],
    },
    VOLUME: {
      actions: 'assignVolume',
    },
    'AUDIO.TIME': {
      actions: 'assignTime',
    },
  },
}).withConfig({
  actions: {
    assignSongData: assign({
      // Assign the `title`, `artist`, and `duration` from the event.
      // Assume the event looks like this:
      // {
      //   type: 'LOADED',
      //   data: {
      //     title: 'Some title',
      //     artist: 'Some artist',
      //     duration: 123
      //   }
      // }
      // Also, reset the `elapsed` and `likeStatus` values.
    }),
    likeSong: assign({
      // Assign the `likeStatus` to "liked"
    }),
    unlikeSong: assign({
      // Assign the `likeStatus` to 'unliked',
    }),
    dislikeSong: assign({
      // Assign the `likeStatus` to 'disliked',
    }),
    assignVolume: assign({
      // Assign the `volume` to the `level` from the event.
      // Assume the event looks like this:
      // {
      //   type: 'VOLUME',
      //   level: 5
      // }
    }),
    assignTime: assign({
      // Assign the `elapsed` value to the `currentTime` from the event.
      // Assume the event looks like this:
      // {
      //   type: 'AUDIO.TIME',
      //   currentTime: 10
      // }
    }),
    skipSong: () => {
      console.log('Skipping song');
    },
    playAudio: () => {},
    pauseAudio: () => {},
  },
});

const service = interpret(playerMachine).start();
// @ts-ignore
window.service = service;

// @ts-ignore
elements.elPlayButton.addEventListener('click', () => {
  service.send({ type: 'PLAY' });
});
// @ts-ignore
elements.elPauseButton.addEventListener('click', () => {
  service.send({ type: 'PAUSE' });
});
// @ts-ignore
elements.elSkipButton.addEventListener('click', () => {
  service.send({ type: 'SKIP' });
});
// @ts-ignore
elements.elLikeButton.addEventListener('click', () => {
  service.send({ type: 'LIKE' });
});
// @ts-ignore
elements.elDislikeButton.addEventListener('click', () => {
  service.send({ type: 'DISLIKE' });
});

service.subscribe((state) => {
  console.log(state.context);
  const { context } = state;

  // @ts-ignore
  elements.elLoadingButton.hidden = !state.hasTag('loading');
  // @ts-ignore
  elements.elPlayButton.hidden = !state.can({ type: 'PLAY' });
  // @ts-ignore
  elements.elPauseButton.hidden = !state.can({ type: 'PAUSE' });
  // @ts-ignore
  elements.elVolumeButton.dataset.level =
    context.volume === 0
      ? 'zero'
      : context.volume <= 2
      ? 'low'
      : context.volume >= 8
      ? 'high'
      : undefined;

  // @ts-ignore
  elements.elScrubberInput.setAttribute('max', context.duration);
  // @ts-ignore
  elements.elScrubberInput.value = context.elapsed;
  // @ts-ignore
  elements.elElapsedOutput.innerHTML = formatTime(
    context.elapsed - context.duration
  );

  // @ts-ignore
  elements.elLikeButton.dataset.likeStatus = context.likeStatus;
  // @ts-ignore
  elements.elArtist.innerHTML = context.artist;
  // @ts-ignore
  elements.elTitle.innerHTML = context.title;
});

service.send({
  type: 'LOADED',
  data: {
    title: 'Some song title',
    artist: 'Some song artist',
    duration: 100,
  },
});
