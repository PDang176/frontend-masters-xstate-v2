import './style.css';
import { createMachine } from 'xstate';

console.log("Hello World!");

// state: { data: null, error: null }
// event: { type: 'FETCH' }
function transition(state, event){
  switch(state.status){
    case 'idle':
      if(event.type === 'FETCH'){
        console.log('Starting to fetch data');
        return { status: 'loading' };
      }
      return state;
    case 'loading':
      // other behavior
      break;
    default:
      break;
  }

  return state;
}

const machine = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: 'loading'
      }
    },
    loading: {}
  }
}

function transition2(state, event){
  const nextStatus = machine.states[state.status].on?.[event.type] ?? state.status;

  return {
    status: nextStatus
  };
}

window.machine = machine;
window.transition = transition;
window.transition2 = transition2;