import '../style.css';

// Create a state machine transition function either using:
// - a switch statement (or nested switch statements)
// - or an object (transition lookup table)

// Also, come up with a simple way to "interpret" it, and
// make it an object that you can `.send(...)` events to.

const machine = {
  initialState: 'loading',
  states: {
    loading: {
      on: { LOADED: 'playing' }
    },
    playing: {
      on: { PAUSE: 'paused' }
    },
    paused: {
      on: { PLAY: 'playing' }
    }
  }
}

/**
 * 
 * @param {status: string} state 
 * @param {type: string} event 
 * @returns 
 */
function transition(state, event) {
  const newStatus = machine.states[state.status]?.on?.[event.type] ?? state.status;

  return {
    status: newStatus
  };
}

window.machine = machine;
window.transition = transition;