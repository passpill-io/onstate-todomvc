import React from 'react';
import TodoFooter from './Footer';
import TodoList from './TodoList';
import store from '../state/store';

var ENTER_KEY = 13;

class TodoApp extends React.Component {
	componentDidMount () {
		var me = this;

		// Here the magic happens. Everytime that the
		// state is updated the app will re-render.
		// A real data driven app.
		store.on('state', function(){
			me.forceUpdate();
		});
	}

	handleNewTodoKeyDown (event) {
		if (event.keyCode !== ENTER_KEY) {
			return;
		}

		event.preventDefault();
		store.emit('todo:create', store.todoInput.trim() );
	}

	updateTodoInput( e ){
		store.todoInput = e.target.value;
	}

	render () {
		var todos = store.todos,
			activeCount = 0,
			completedCount = 0,
			headerClass = 'header ' + store.status,
			main = '',
			footer = ''
		;

		// Let's count todos
		todos.forEach(function (todo) {
			if( !todo.model.completed )
				activeCount++;
			else
				completedCount++;
		}, this);

		if( todos.length ){
			footer = (
				<TodoFooter
					count={activeCount}
					completedCount={completedCount}
					nowShowing={ store.filter } />
			);

			main = (
				<section className="main">
					<TodoList todos={ todos } filter={ store.filter } />
				</section>
			);
		}

		return (
			<div>
				<header className={ headerClass }>
					<h1>todos</h1>
					<input className="new-todo"
						ref="newField"
						value={ store.todoInput }
						onChange={ this.updateTodoInput }
						placeholder="What needs to be done?"
						onKeyDown={this.handleNewTodoKeyDown}
						autoFocus={true} />
					<span className="loadingMessage">Saving...</span>
				</header>
				{main}
				{footer}
			</div>
		);
	}
};

export default TodoApp;
