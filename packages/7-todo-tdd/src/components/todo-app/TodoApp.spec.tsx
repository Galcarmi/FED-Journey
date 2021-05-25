import { TodoAppDriver } from './TodoApp.driver';
import { Chance } from 'chance';
import { TodoItemDriver } from '../todo-item/TodoItem.driver';
import { todosService } from '../../services/TodoService';
import { ITodoDTO, ITodoMap } from 'fed-todo-journey_todo-common';
import { aTodo, initTodosServiceMocks } from '../../test/utils';

const chance = new Chance();

describe('checks todo list - add functionality', () => {
  it('should not add todo item with empty content', async () => {
    const { appTestDriver } = await givenTodos({});

    expect(appTestDriver.getTodosCount()).toBe(0);

    appTestDriver.todoInputInsertContent('');
    appTestDriver.clickOnAddBtn();
    await appTestDriver.waitForAppToUpdate();

    expect(appTestDriver.getTodosCount()).toBe(0);
  });

  it('should add todo item with content when pressing enter', async () => {
    const content = chance.word();
    const { appTestDriver } = await givenTodos({});

    expect(appTestDriver.getTodosCount()).toBe(0);

    appTestDriver.todoInputInsertContent(content);
    appTestDriver.pressEnterOnTodoInput();
    await appTestDriver.waitForAppToUpdate();

    expect(appTestDriver.getFirstTodo().content).toBe(content);
  });

  it('should add todo item with content when clicking on add btn', async () => {
    const content = chance.word();
    const { appTestDriver } = await givenTodos({});

    expect(appTestDriver.getTodosCount()).toBe(0);

    appTestDriver.todoInputInsertContent(content);
    appTestDriver.clickOnAddBtn();
    await appTestDriver.waitForAppToUpdate();

    expect(appTestDriver.getFirstTodo().content).toBe(content);
  });

  it('todo input should be empty after adding todo', async () => {
    const { appTestDriver } = await givenTodos({});

    expect(appTestDriver.getTodoInputContent()).toBe('');

    appTestDriver.todoInputInsertContent(chance.word());
    appTestDriver.clickOnAddBtn();
    await appTestDriver.waitForAppToUpdate();

    expect(appTestDriver.getTodoInputContent()).toBe('');
  });
});

describe('app should render fetched todos properly', () => {
  it('should render a valid UUID', async () => {
    const todos: ITodoMap = {};
    const todo = aTodo();
    todos[todo._id] = todo;

    const { appTestDriver } = await givenTodos(todos);

    const UUIDPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    expect(appTestDriver.getFirstTodo()._id).toMatch(UUIDPattern);
  });

  it('should render the correct content', async () => {
    const todos: ITodoMap = {};
    const todo = aTodo();
    todos[todo._id] = todo;

    const { appTestDriver } = await givenTodos(todos);

    expect(appTestDriver.getFirstTodo().content).toBe(todo.content);
  });

  it('should render the correct state of isDone', async () => {
    const todos: ITodoMap = {};
    const todo = aTodo();
    todos[todo._id] = todo;

    const { appTestDriver } = await givenTodos(todos);

    expect(appTestDriver.getFirstTodo().isDone).toBe(todo.isDone);
  });
});

describe('todo item actions should change todos state properly', () => {
  it('todo item should be marked as done after clicking on done btn', async () => {
    const todos: ITodoMap = {};
    const todo = aTodo({ isDone: false });
    todos[todo._id] = todo;

    const { appTestDriver, todoItemTestDriver } = await givenTodos(todos);

    expect(appTestDriver.getFirstTodo().isDone).toBe(false);

    todoItemTestDriver.clickOnDoneBtn();
    await appTestDriver.waitForAppToUpdate();

    expect(appTestDriver.getFirstTodo().isDone).toBe(true);
  });

  it('todo item should be deleted after clicking on delete btn', async () => {
    const todos: ITodoMap = {};
    const todo = aTodo();
    todos[todo._id] = todo;

    const { appTestDriver, todoItemTestDriver } = await givenTodos(todos);

    expect(appTestDriver.getTodosCount()).toBe(1);

    todoItemTestDriver.clickOnDeleteBtn();
    await appTestDriver.waitForAppToUpdate();

    expect(appTestDriver.getTodosCount()).toBe(0);
  });

  it('todo item should be edited on edit input blur', async () => {
    const todos: ITodoMap = {};
    const todo = aTodo();
    todos[todo._id] = todo;

    let { appTestDriver, todoItemTestDriver } = await givenTodos(todos);

    todoItemTestDriver.clickOnEditBtn();
    todoItemTestDriver = new TodoItemDriver(
      appTestDriver.getFirstTodoItemWrapper()
    );
    const newContent = chance.word();
    todoItemTestDriver.insertContentToEditInput(newContent);
    todoItemTestDriver.blurEditInput();
    await appTestDriver.waitForAppToUpdate();

    expect(appTestDriver.getFirstTodo().content).toBe(newContent);
  });

  it('todo item should not be edited on edit input blur when edit input is empty', async () => {
    const todos: ITodoMap = {};
    const todo = aTodo();
    todos[todo._id] = todo;

    let { appTestDriver, todoItemTestDriver } = await givenTodos(todos);

    todoItemTestDriver.clickOnEditBtn();
    todoItemTestDriver = new TodoItemDriver(
      appTestDriver.getFirstTodoItemWrapper()
    );
    todoItemTestDriver.insertContentToEditInput('');
    todoItemTestDriver.blurEditInput();
    await appTestDriver.waitForAppToUpdate();

    expect(appTestDriver.getFirstTodo().content).toBe(todo.content);
  });

  it('todos service edit method should not be called when edit input content is the same as todo content', async () => {
    const todos: ITodoMap = {};
    const todo = aTodo();
    todos[todo._id] = todo;

    let { appTestDriver, todoItemTestDriver } = await givenTodos(todos);

    const spy: jest.SpyInstance<Promise<ITodoDTO>> = jest.spyOn(
      todosService,
      'editTodo'
    );
    spy.mockClear()
    
    todoItemTestDriver.clickOnEditBtn();
    todoItemTestDriver = new TodoItemDriver(
      appTestDriver.getFirstTodoItemWrapper()
    );
    todoItemTestDriver.insertContentToEditInput(todo.content);
    todoItemTestDriver.blurEditInput();
    await appTestDriver.waitForAppToUpdate();

    expect(spy).toHaveBeenCalledTimes(0);
  });
});

const givenTodos = async (
  todos: ITodoMap
): Promise<{
  appTestDriver: TodoAppDriver;
  todoItemTestDriver: TodoItemDriver;
}> => {
  initTodosServiceMocks(todos);
  const appTestDriver: TodoAppDriver = await new TodoAppDriver();
  await appTestDriver.waitForAppToUpdate();

  const todoItemTestDriver: TodoItemDriver = new TodoItemDriver(
    appTestDriver.getFirstTodoItemWrapper()
  );
  return {
    appTestDriver,
    todoItemTestDriver,
  };
};
