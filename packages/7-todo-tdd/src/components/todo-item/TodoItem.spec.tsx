import { ITodoDTO } from 'fed-todo-journey_todo-common';
import { TodoItemDriver } from './TodoItem.driver';
import { Chance } from 'chance';
import { enzymeContainerSetupAndTeardown, initTodosServiceMocks } from '../../test/utils';

const chance = new Chance();

describe('todo item content should be rendered properly', () => {
  it('content should be rendered properly', () => {
    const { todoItemDriver, todo } = initDriverWithTodo();

    expect(todoItemDriver.getTodoItem().content).toBe(todo.content);
  });

  it('todo item id-proprety should be the correct _id', () => {
    const { todoItemDriver, todo } = initDriverWithTodo();

    expect(todoItemDriver.getTodoItem()._id).toBe(todo._id);
  });
});

describe('todo item should be rendered properly according to "isDone" state', () => {
  it('todo content should contain crossed-content class if "isDone" is true', () => {
    const todo: ITodoDTO = {
      content: chance.word(),
      _id: chance.guid(),
      userId: chance.guid(),
      isDone: true,
    };
    const todoItemDriver: TodoItemDriver = new TodoItemDriver(todo);

    expect(todoItemDriver.getTodoItem().isDone).toBe(true);
  });

  it('todo content should not contain crossed-content class if "isDone" is false', () => {
    const todo: ITodoDTO = {
      content: chance.word(),
      _id: chance.guid(),
      userId: chance.guid(),
      isDone: false,
    };
    const todoItemDriver: TodoItemDriver = new TodoItemDriver(todo);

    expect(todoItemDriver.getTodoItem().isDone).toBe(false);
  });
});

describe('todo action interactions testing', () => {
  enzymeContainerSetupAndTeardown();

  it('todo edit input should not be rendered if edit btn wasnt clicked', () => {
    const { todoItemDriver } = initDriverWithTodo();

    expect(todoItemDriver.isEditInputVisible()).toBe(false);
  });

  it('edit input should be rendered & focused after clicking on edit btn', async () => {
    const { todoItemDriver } = initDriverWithTodo();

    expect(todoItemDriver.isEditInputVisible()).toBe(false);
    expect(todoItemDriver.isEditInputFocused()).toBe(false);

    todoItemDriver.clickOnEditBtn();
    await todoItemDriver.waitForAppToUpdate();

    expect(todoItemDriver.isEditInputVisible()).toBe(true);
    expect(todoItemDriver.isEditInputFocused()).toBe(true);
  });

  it('edit input content should be the same as todo content while clicking on edit btn', async () => {
    const { todoItemDriver, todo } = initDriverWithTodo();

    expect(todoItemDriver.isEditInputVisible()).toBe(false);

    todoItemDriver.clickOnEditBtn();
    await todoItemDriver.waitForAppToUpdate();

    expect(todoItemDriver.getEditInputContent()).toBe(todo.content);
  });

  it('edit input should be hidden after clicking twice on edit btn', async () => {
    const { todoItemDriver } = initDriverWithTodo();

    expect(todoItemDriver.isEditInputVisible()).toBe(false);

    todoItemDriver.clickOnEditBtn();
    todoItemDriver.clickOnEditBtn();
    await todoItemDriver.waitForAppToUpdate();

    expect(todoItemDriver.isEditInputVisible()).toBe(false);
  });

  it('edit input should be hidden on edit input blur', async () => {
    const { todoItemDriver } = initDriverWithTodo();

    expect(todoItemDriver.isEditInputVisible()).toBe(false);

    todoItemDriver.clickOnEditBtn();
    todoItemDriver.blurEditInput();
    await todoItemDriver.waitForAppToUpdate();

    expect(todoItemDriver.isEditInputVisible()).toBe(false);
  });

  it('edit input should be hidden after clicking enter', async () => {
    const { todoItemDriver } = initDriverWithTodo();

    expect(todoItemDriver.isEditInputVisible()).toBe(false);

    todoItemDriver.clickOnEditBtn();
    todoItemDriver.simulateEditInputEnterClick();
    await todoItemDriver.waitForAppToUpdate();

    expect(todoItemDriver.isEditInputVisible()).toBe(false);
  });
});

const initDriverWithTodo = (): {
  todo: ITodoDTO;
  todoItemDriver: TodoItemDriver;
} => {
  initTodosServiceMocks({});

  const todo: ITodoDTO = {
    content: chance.word(),
    _id: chance.guid(),
    userId: chance.guid(),
    isDone: chance.bool(),
  };
  const todoItemDriver: TodoItemDriver = new TodoItemDriver(todo);

  return { todo, todoItemDriver };
};
