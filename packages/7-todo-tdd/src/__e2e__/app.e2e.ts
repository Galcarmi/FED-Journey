import { Chance } from 'chance';
import { AppDriver } from './app.e2e.driver';
import axios from 'axios';

const chance = new Chance();

describe('fetch todos test', () => {
  let appDriver: AppDriver;

  beforeEach(async () => {
    appDriver = new AppDriver();
    await appDriver.launchBrowser();
    await appDriver.navigateToTodoPage();
  });

  it('should fetch todos', async () => {
    const testContent = chance.word();
    await appDriver.given.createTodo(testContent);

    await appDriver.when.reloadingTheBrowser();

    const todoContent = await appDriver.then.getFirstTodoContent();

    expect(testContent).toBe(todoContent);
  })

  afterEach(async () => {
    await appDriver.closeBrowser();
  });
})

describe('add todos test', () => {
  let appDriver: AppDriver;

  beforeEach(async () => {
    appDriver = new AppDriver();
    await appDriver.launchBrowser();
    await appDriver.navigateToTodoPage();
  });

  it('should render todo properly', async ():Promise<void> => {
    const testContent = chance.word();
    await appDriver.given.createTodo(testContent)

    const todoContent = await appDriver.then.getFirstTodoContent();

    expect(todoContent).toBe(testContent);
  });

  it('should render isDone state properly', async () :Promise<void>=> {
    await appDriver.given.createTodo(chance.word());

    const isDone = await appDriver.then.isFirstTodoDone();

    expect(isDone).toBe(false);
  })

  afterEach(async () => {
    await appDriver.closeBrowser();
  });
});

describe('todo item action tests', () => {
  let appDriver: AppDriver;

  beforeEach(async () => {
    appDriver = new AppDriver();
    await appDriver.launchBrowser();
    await appDriver.navigateToTodoPage();
  });

  it('should mark todo as done', async () => {
    await appDriver.given.createTodo(chance.word())

    await appDriver.when.clickingOnFirstTodoDoneBtn();

    const isDone = await appDriver.then.isFirstTodoDone();

    expect(isDone).toBe(true);
  });

  it('should delete first todo', async () => {
    await appDriver.given.createTodo(chance.word())

    await appDriver.when.clickingOnFirstTodoDeleteBtn();

    const todosCount = await appDriver.then.getTodosCount();

    expect(todosCount).toBe(0);
  });

  it('should edit first todo', async () => {
    await appDriver.given.createTodo(chance.word())

    const newTodoContent: string = chance.word();

    await appDriver.when.editingFirstTodo(newTodoContent);

    const todoContent = await appDriver.then.getFirstTodoContent();

    expect(todoContent).toBe(newTodoContent);
  });

  afterEach(async () => {
    await appDriver.closeBrowser();
  });
});