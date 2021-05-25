import { ReactWrapper } from 'enzyme';
import { enzymeContainerMount } from '../../test/utils';
import { ITodoDTO } from 'fed-todo-journey_todo-common';
import { act } from 'react-dom/test-utils';
import { TodoItem } from './TodoItem';
import { s } from './TodoItem';
import { wrapperGenerator } from '../../styles/utils';
import { s as commonStyles } from '../../styles/commonClasses';
import { btnClasses } from '../action-btn/BtnIcons';
import { initTodosServiceMocks } from '../../test/utils';


const c = wrapperGenerator('.');

export class TodoItemDriver {
  public todoItem: ReactWrapper;

  constructor(todo: ITodoDTO | ReactWrapper) {
    if ((todo as ITodoDTO)._id) {
      this.todoItem = enzymeContainerMount(
        <TodoItem todo={todo as ITodoDTO} />
      );
    } else {
      this.todoItem = todo as ReactWrapper;
    }
  }

  public getTodoItem(): ITodoDTO {
    const todoElement: ReactWrapper = this.todoItem.find(c(s.todo__list__item));
    const _id: string = todoElement.getDOMNode().getAttribute('id') as string;
    const contentElement = todoElement.find(c(s.todo__list__item__content));
    const content: string = contentElement.getDOMNode().innerHTML;
    const isDone: boolean = contentElement
      .getDOMNode()
      .classList.contains(commonStyles.crossedContent);

    return { _id, content, isDone, userId: '' };
  }

  public clickOnEditBtn(): void {
    this.todoItem
      .find(c(btnClasses.todo__list__item__actions__edit))
      .simulate('click');
  }

  public isEditInputVisible(): boolean {
    return this.todoItem.find(c(s.todo__list__item__editInput)).exists();
  }

  public isEditInputFocused(): boolean {
    const editInput: ReactWrapper = this.todoItem.find(
      c(s.todo__list__item__editInput)
    );
    const activeElement: Element | null = document.activeElement;

    return editInput.exists()
      ? editInput.getDOMNode() === activeElement
      : false;
  }

  public async waitForAppToUpdate(): Promise<void> {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve));
      this.todoItem.update();
    });
  }

  public blurEditInput(): void {
    this.todoItem.find(c(s.todo__list__item__editInput)).simulate('blur');
  }

  public clickOnDoneBtn(): void {
    this.todoItem
      .find(c(btnClasses.todo__list__item__actions__done))
      .simulate('click');
  }

  public clickOnDeleteBtn(): void {
    this.todoItem
      .find(c(btnClasses.todo__list__item__actions__delete))
      .simulate('click');
  }

  public insertContentToEditInput(content: string): void {
    this.todoItem
      .find(c(s.todo__list__item__editInput))
      .simulate('change', { target: { value: content } });
  }

  public getEditInputContent(): string {
    return (
      this.todoItem
        .find(c(s.todo__list__item__editInput))
        .getDOMNode() as HTMLInputElement
    ).value;
  }

  public simulateEditInputEnterClick(): void {
    this.todoItem
      .find(c(s.todo__list__item__editInput))
      .simulate('keypress', { key: 'Enter' });
  }
}
