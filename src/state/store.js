import onState from 'onstate';
import Utils from './utils';

// Try to recover the state from the localStorage
var state = Utils.store('freezerTodos') || {
	todos: [],
	todoInput: '',
	status: 'ready',
	filter: 'all'
};

// Returns the freezer instance with the state.
export default onState(state);
