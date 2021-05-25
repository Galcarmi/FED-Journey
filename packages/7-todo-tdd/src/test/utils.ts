import { mount as enzymeMount, ReactWrapper } from 'enzyme';
import { ITodoDTO, ITodoMap } from 'fed-todo-journey_todo-common';
import { ReactElement } from 'react';
import { todosService } from '../services/TodoService';
import { Chance } from 'chance';

const chance = new Chance();

export const enzymeContainerMount = (component: ReactElement): ReactWrapper =>
  enzymeMount(component, {
    attachTo: document.getElementById('enzymeContainer'),
  });

export const enzymeContainerSetupAndTeardown = (): void => {
  let container: HTMLDivElement | null;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'enzymeContainer';
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }

    container = null;
  });
};

export const initTodosServiceMocks = (initTodos?: ITodoMap): void => {
  const todos: ITodoMap = initTodos || {};

  (todosService.getAllTodos as jest.Mock<any, any>).mockImplementation(
    async (): Promise<ITodoMap> => todos
  );

  (todosService.addTodo as jest.Mock<any, any>).mockImplementation(
    async (content: string): Promise<ITodoDTO> => {
      const _id = chance.guid();
      const userId = chance.guid();
      const todoToInsert = { content, _id, userId, isDone: false };
      todos[_id] = todoToInsert;

      return todoToInsert;
    }
  );

  (todosService.editTodo as jest.Mock<any, any>).mockImplementation(
    async (todo: Partial<ITodoDTO>): Promise<ITodoDTO> => {
      const foundTodo: ITodoDTO = todos[todo._id as string];
      const updatedTodo = { ...foundTodo, ...todo };
      todos[todo._id as string] = updatedTodo;

      return updatedTodo;
    }
  );

  (todosService.deleteTodo as jest.Mock<any, any>).mockImplementation(
    async (_id: string): Promise<ITodoDTO> => {
      const foundTodo: ITodoDTO = todos[_id];
      delete todos[_id];

      return foundTodo;
    }
  );
};

export const aTodo = (todo?: Partial<ITodoDTO>): ITodoDTO => {
  return {
    content: todo?.content || chance.word(),
    _id: todo?._id || chance.guid(),
    userId: todo?.userId || chance.guid(),
    isDone: todo?.isDone || chance.bool(),
  };
};

