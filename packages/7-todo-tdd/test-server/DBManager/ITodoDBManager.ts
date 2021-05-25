import { ITodoDTO } from 'fed-todo-journey_todo-common';

export interface ITodoDBManager {
  addTodo(userId: string, todo: ITodoDTO): Promise<ITodoDTO>;
  removeTodo(userId: string, _id: string): Promise<ITodoDTO>;
  editTodo(userId: string, todo: ITodoDTO): Promise<ITodoDTO>;
  getAllTodos(userId: string): Promise<{[key:string]:ITodoDTO}>;
}
