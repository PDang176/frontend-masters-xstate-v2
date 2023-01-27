import './style.css';
import { createMachine, interpret, assign } from 'xstate';

const machine = createMachine({
  initial: 'loading',
  context: {
    count: 42
  },
  states: {
    loading: {
      entry: ['loadData'],
      exit: [],
      on: {
        SUCCESS: {
          actions: [
            () => console.log('Data Loaded'), 
            assign({
              count: (context, event ) => context.count + event.value
            })
          ],
          target: 'loaded',
        }
      },
    },
    loaded: {},
  }
}).withConfig({
  actions: {
    loadData: () => {
      console.log('Configured Loading Data');
    }
  }
});

// console.log(machine.initialState);

// const nextState = machine.transition(undefined, {
//   type: 'SUCCESS'
// });

// console.log(nextState);

// console.log(nextState.matches('loaded'));

const service = interpret(machine).start();

service.subscribe((state) => {
  console.log(state.value, state.actions, state.context);
});

window.service = service;

// Lesson 00
// console.log("Hello World!");

// // state: { data: null, error: null }
// // event: { type: 'FETCH' }
// function transition(state, event){
//   switch(state.status){
//     case 'idle':
//       if(event.type === 'FETCH'){
//         console.log('Starting to fetch data');
//         return { status: 'loading' };
//       }
//       return state;
//     case 'loading':
//       // other behavior
//       break;
//     default:
//       break;
//   }

//   return state;
// }

// const machine = {
//   initial: 'idle',
//   states: {
//     idle: {
//       on: {
//         FETCH: 'loading'
//       }
//     },
//     loading: {}
//   }
// }

// function transition2(state, event){
//   const nextStatus = machine.states[state.status].on?.[event.type] ?? state.status;

//   return {
//     status: nextStatus
//   };
// }

// window.machine = machine;
// window.transition = transition;
// window.transition2 = transition2;