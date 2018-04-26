/*
The reactions is what make the app state to change.

They are similar to the Flux concept of actions, but you never
call them imperatively. Reactions just respond to an event,
so ideally your React components just trigger events, being
completely decoupled from actions/reactions.
 */

import store from './store';
import Utils from './utils';

// Wait to emulate a server request.
var lag = 1000;


/**
 * Creates a new todo and add it to the list.
 * @param  {String} The todo content.
 */
store.on('todo:create', function( text ){

	// We set the app into a loading status
	// to let the user know
	store.status = 'loading';

	// Call the fake server
	setTimeout( function(){
		store.status = 'ready';
		store.todoInput = '';
		store.todos.push({
			model: {
				title: text,
				id: Utils.uuid(),
				completed: false
			},
			ui: {
				status: 'ready',
				input: text
			}
		})

		// Save the state in localStorage
		Utils.store('freezerTodos', store);
	}, lag);
});

/**
 * Deletes a todo.
 * @param  { FreezerNode } The todo to delete.
 */
store.on('todo:delete', function( todo ){
	var index = getTodoIndex(todo);

	// Since we are receiving the todo to delete from
	// the arguments. We can use directly instead of
	// making use of the state.
	todo.ui.status = 'deleting';

	setTimeout( function(){
		// We just remove the todo from the list
		store.todos.splice( index, 1 );

		// Save the state in localStorage
		Utils.store('freezerTodos', store);
	}, lag);
});

/**
 * Updates a todo text. Shows how a reaction can receive more
 * than one parameter.
 *
 * @param  {FreezerNode} todo   The todo to update.
 * @param  {String} text    The new text for the todo.
 */
store.on('todo:update', function( todo, text ){
	var index = getTodoIndex(todo);
	// Set the todo in an 'updating' state
	// to let the user know.
	// The updated node is returned.
	todo.ui.status = 'updating';

	// Call the server
	setTimeout( function(){
		var target = store.todos[ index ];

		target.model.title = text;
		target.ui.status = 'ready';

		// Save the state in localStorage
		Utils.store('freezerTodos', store);
	}, lag);
});

/**
 * Set a filter for the todos.
 * @param  {String} The filter to apply. It can be 'all'|'completed'|'active'.
 */
store.on('todo:filter', function( filter ){
	store.filter = filter;

	// Save the state in localStorage
	Utils.store('freezerTodos', store);
});

/**
 * Removes completed nodes from the list.
 */
store.on('todo:clearCompleted', function(){
	var toRemove = [];

	// Let's mark all the completed nodes as deleting
	for( var i = store.todos.length - 1; i>= 0; i-- ){
		if( store.todos[i].model.completed ){
			store.todos[i].ui.status = 'deleting';
			toRemove.push( i );
		}
	}

	// Call the server
	setTimeout( function(){

		// Remove all the completed children now.
		toRemove.forEach( function( i ){
			store.todos.splice( i, 1 );
		});

		// Save the state in localStorage
		Utils.store('freezerTodos', store);
	}, lag);
});

/**
 * Marks a todo as complete or active.
 * @param {FreezerNode} The todo to toggle.
 */
store.on('todo:toggle', function( todo ){
	todo.model.completed = !todo.model.completed;

	// Save the state in localStorage
	Utils.store('freezerTodos', store);
});


/**
 * HELPER function. Find a todo in the state and return
 * its index in the array.
 * @param  {FreezerNode} todo The todo to find.
 * @return {Number|Boolean}   The index or false if not found.
 */
var getTodoIndex = function( todo ){
	var i = 0,
		found = false,
		todos = store.todos
	;

	while( i<todos.length && found === false ){
		// Since todos are immutable, we can use
		// direct comparison here instead of using uuid.
		if( todos[i] === todo )
			found = i;
		i++;
	}

	return found;
};
