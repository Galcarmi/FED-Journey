import {
  Browser,
  ElementHandle,
  HTTPResponse,
  launch,
  Page,
  Protocol,
} from 'puppeteer';
import { HTTPMethods } from '../test/constants';

export class AppDriver {
  private page!: Page;
  private browser!: Browser;

  public given = {
    createTodo: async (todoContent: string): Promise<void> => {
      await this.insertContentTodoInput(todoContent);
      await this.clickOnAddTodo();
      await this.waitForRequestToResolve(HTTPMethods.POST, 'todo');
    }
  };

  public when = {
    clickingOnFirstTodoDoneBtn: async (): Promise<void> => {
      const todoItem = (await this.page.waitForSelector(
        '[data-hook="TODO_ITEM"]'
      )) as ElementHandle<Element>;
      const doneBtn = await todoItem.$('[data-hook="TODO_ITEM_DONE"]');
      await doneBtn?.click();
      await this.waitForRequestToResolve(HTTPMethods.PUT, 'todo');
    },
    clickingOnFirstTodoDeleteBtn: async (): Promise<void> => {
      const todoItem = (await this.page.waitForSelector(
        '[data-hook="TODO_ITEM"]'
      )) as ElementHandle<Element>;
      const deleteBtn = await todoItem.$('[data-hook="TODO_ITEM_DELETE"]');
      await deleteBtn?.click();
      await this.waitForRequestToResolve(HTTPMethods.DELETE, 'todo');
    },
    editingFirstTodo: async (content: string): Promise<void> => {
      const todoItem = (await this.page.waitForSelector(
        '[data-hook="TODO_ITEM"]'
      )) as ElementHandle<Element>;
      const editBtn = await todoItem.$('[data-hook="TODO_ITEM_EDIT"]');
      await editBtn?.click();

      const todoEditInput = (await this.page.$(
        '[data-hook="TODO_ITEM_EDIT_INPUT"]'
      )) as ElementHandle<Element>;
      await this.insertContentToInputElem(todoEditInput, content);

      await todoEditInput.evaluate((elem: HTMLInputElement) => {
        elem.blur();
      });
      await this.waitForRequestToResolve(HTTPMethods.PUT, 'todo');
    },
    reloadingTheBrowser: async (): Promise<void> => {
      const cookies : Protocol.Network.Cookie[] = await this.getPageCookies();
      await this.closeBrowser();
      await this.launchBrowser();
      await this.setPageCookies(cookies);
      await this.navigateToTodoPage();
    }
  };

  public then = {
    getFirstTodoContent: async (): Promise<string | undefined> => {
      const todoItems = await this.page.waitForSelector(
        '[data-hook="TODO_ITEM"]'
      );
      return todoItems?.$eval(
        '[data-hook="TODO_ITEM_CONTENT"]',
        (elem: Element) => elem.innerHTML
      );
    },
    getTodosCount: async (): Promise<number> => {
      const todoItems = await this.page.$$('[data-hook="TODO_ITEM"]');

      return todoItems.length;
    },
    isFirstTodoDone: async (): Promise<boolean> => {
      const todoItem = (await this.page.waitForSelector(
        '[data-hook="TODO_ITEM"]'
      )) as ElementHandle<Element>;
      return todoItem.$eval(
        '[data-hook="TODO_ITEM_CONTENT"]',
        (elem: Element) => {
          let isDone = false;
          elem.classList.forEach((clazz: string): void => {
            if (clazz.includes('crossedContent')) {
              isDone = true;
            }
          });

          return isDone;
        }
      );
    },
  };

  public async launchBrowser() {
    this.browser = await launch({
      headless: true,
      executablePath:
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    });
    this.page = await this.browser.newPage();
  }

  public async navigateToTodoPage(): Promise<HTTPResponse> {
    return this.page.goto('http://localhost:8000/');
  }

  public async insertContentTodoInput(content: string): Promise<void> {
    const todoInput = (await this.page.waitForSelector(
      '[data-hook="TODO_INPUT"]'
    )) as ElementHandle<Element>;

    return this.insertContentToInputElem(todoInput, content);
  }

  public async clickOnAddTodo(): Promise<void> {
    return this.page.click('[data-hook="ADD_BTN"]');
  }

  public async closeBrowser(): Promise<void> {
    return this.browser.close();
  }

  private async insertContentToInputElem(
    elem: ElementHandle<Element>,
    content: string
  ): Promise<void> {
    await elem.evaluate((elem: HTMLInputElement) => {
      elem.value = '';
    });
    await elem.focus();

    return this.page.keyboard.type(content);
  }

  private waitForRequestToResolve(
    HTTPMethod: string,
    URLPath: string
  ): Promise<void> {
    return new Promise((res) => {
      this.page.on('response', (response: HTTPResponse) => {
        if (
          response.request().method() === HTTPMethod &&
          response.url().includes(URLPath)
        ) {
          res();
        }
      });
    });
  }

  private getPageCookies(): Promise<Protocol.Network.Cookie[]> {
    return this.page.cookies();
  }

  private async setPageCookies(
    cookies: Protocol.Network.Cookie[]
  ): Promise<void> {
    await this.page.setCookie(...cookies);
  }
}
