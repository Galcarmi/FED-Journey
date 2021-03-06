import { classes as todoAppClasses } from '../components/todo-app/todoApp';
import { classes as todoItemClasses } from '../components/todo-app/todoItem';

export const elementSelectors = {
  todoList: () => document.querySelector(`.${todoAppClasses.todoApp__list}`),
  actionTodoBtn: () => document.querySelector(`.${todoAppClasses.todoApp__inputContainer__addBtn}`),
  todoTxtInput: () => document.querySelector(`.${todoAppClasses.todoApp__inputContainer__textInput}`),
  getTodoItemById: (id) => document.querySelector(`[id='${id}']`),
  todoEmptyState: () => document.querySelector(`.${todoAppClasses.todoApp__list__emptyState}`),
  getTodoContentElementById: (id) => {
    const todoItem = elementSelectors.getTodoItemById(id);
    return todoItem.querySelector(`.${todoItemClasses.todoApp__list__item__content}`);
  },
  getDoneSVGElementOfTodoById: (id) => {
    const todoItem = elementSelectors.getTodoItemById(id);
    return todoItem.querySelector(`.${todoItemClasses.todoApp__list__item__actions__done}`);
  },
  getDeleteSVGElementOfTodoById: (id) => {
    const todoItem = elementSelectors.getTodoItemById(id);
    return todoItem.querySelector(`.${todoItemClasses.todoApp__list__item__actions__delete}`);
  },
  getEditSVGElementOfTodoById: (id) => {
    const todoItem = elementSelectors.getTodoItemById(id);
    return todoItem.querySelector(`.${todoItemClasses.todoApp__list__item__actions__edit}`);
  },
  getEditInputElementOfTodoById: (id) => {
    const todoItem = elementSelectors.getTodoItemById(id);
    return todoItem.querySelector(`.${todoItemClasses.todoApp__list__item__editInput}`);
  },
  getActionsContainerElementOfTodoById: (id) => {
    const todoItem = elementSelectors.getTodoItemById(id);
    return todoItem.querySelector(`.${todoItemClasses['todo-app__list__item__actions']}`);
  },
};

export const eShowHide = {
  SHOW: 'SHOW',
  HIDE: 'HIDE',
};

