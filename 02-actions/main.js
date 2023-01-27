// @ts-check
import '../style.css';
// @ts-ignore
import { createMachine, assign, interpret, send } from 'xstate';
import { raise } from 'xstate/lib/actions';
import elements from '../utils/elements';

const playerMachine = createMachine({
  initial: 'loading',
  states: {
    loading: {
      on: {
        LOADED: {
          // Add an action here to assign the song data
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
      // When this state is entered, add an action to play the audio
      // When this state is exited, add an action to pause the audio
      entry: 'playAudio',
      exit:'pauseAudio',
      on: {
        PAUSE: { target: 'paused' },
      },
    },
  },
  on: {
    SKIP: {
      // Add an action to skip the song
      actions: 'skipSong',
      target: 'loading',
    },
    LIKE: {
      // Add an action to like the song
      actions: 'likeSong',
    },
    UNLIKE: {
      // Add an action to unlike the song
      actions: 'unlikeSong',
    },
    DISLIKE: {
      // Add two actions to dislike the song and raise the skip event
      actions: ['dislikeSong', raise('SKIP')],
    },
    VOLUME: {
      // Add an action to assign to the volume
      actions: 'assignVolume',
    },
    TIME: {
      actions: 'assignTime',
    }
  },
}).withConfig({
  actions: {
    // Add implementations for the actions here, if you'd like
    // For now you can just console.log something
    assignSongData: () => {},
    playAudio: () => {},
    pauseAudio: () => {},
    skipSong: () => {},
    likeSong: () => {},
    unlikeSong: () => {},
    dislikeSong: () => {},
    assignVolume: () => {},
    assignTime: () => {},
  },
});

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

const service = interpret(playerMachine).start();

service.subscribe((state) => {
  console.log(state.actions);

  // @ts-ignore
  elements.elLoadingButton.hidden = !state.matches('loading');
  // @ts-ignore
  elements.elPlayButton.hidden = !state.can({ type: 'PLAY' });
  // @ts-ignore
  elements.elPauseButton.hidden = !state.can({ type: 'PAUSE' });
});

service.send('LOADED');
