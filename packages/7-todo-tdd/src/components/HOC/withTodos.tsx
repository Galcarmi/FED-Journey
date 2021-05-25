import { ITodoMap } from 'fed-todo-journey_todo-common';
import React, { FC, useState } from 'react';
import { TodoContext, TodosState } from '../../context/TodoContext';
import { todosService } from '../../services/TodoService';

const withTodosContext =
  <Props extends Object>(WrappedComponent: FC<Props>) =>
  (props: Props) => {
    const [todos, setTodos] = useState<ITodoMap>({});

    return (
      <TodoContext.Provider
        value={new TodosState(todos, setTodos, todosService)}
      >
        <WrappedComponent {...props} />
      </TodoContext.Provider>
    );
  };

export default withTodosContext;
