import { v4 } from 'uuid';
import { ITodoDBManager } from './ITodoDBManager';
import { IdNotFoundError } from '../errors/IdNotFoundError';
import { MissingFieldsError } from '../errors/MissingFieldsError';
import { ITodoDTO } from 'fed-todo-journey_todo-common';

export class TodoInMemoryDBManager implements ITodoDBManager {
  private todos: { [key: string]: { [key: string]: ITodoDTO } };

  constructor() {
    this.todos = {};
  }

  public async addTodo(userId: string, todo: ITodoDTO): Promise<ITodoDTO> {
    if (!todo.content) {
      throw new MissingFieldsError('content');
    }
    this._createEmptyTodosIfUserIdNotExists(userId);
    const toInsertTodo = {
      content: todo.content,
      _id: v4(),
      isDone: false,
      userId,
    };
    this.todos[userId][toInsertTodo._id] = toInsertTodo;

    return toInsertTodo;
  }

  public async removeTodo(userId: string, _id: string): Promise<ITodoDTO> {
    if (!_id) {
      throw new MissingFieldsError('id');
    }

    this._createEmptyTodosIfUserIdNotExists(userId);
    this._throwIfTodoIdNotExists(userId, _id);
    const deletedTodo: ITodoDTO = this.todos[userId][_id];
    delete this.todos[userId][_id];

    return deletedTodo;
  }

  public async editTodo(userId: string, todo: ITodoDTO): Promise<ITodoDTO> {
    if (!todo._id) {
      throw new MissingFieldsError('id');
    }
    this._createEmptyTodosIfUserIdNotExists(userId);
    this._throwIfTodoIdNotExists(userId, todo._id);

    this.todos[userId][todo._id] = { ...this.todos[userId][todo._id], ...todo };

    return this.todos[userId][todo._id];
  }

  public async getAllTodos(userId: string): Promise<{[key:string]:ITodoDTO}> {
    this._createEmptyTodosIfUserIdNotExists(userId);

    return this.todos[userId];
  }

  private _throwIfTodoIdNotExists(userId: string, _id: string): void {
    if (!this.todos[userId][_id]) {
      throw new IdNotFoundError(_id);
    }
  }

  private _createEmptyTodosIfUserIdNotExists(userId: string): void {
    if (!this.todos[userId]) {
      this.todos[userId] = {};
    }
  }
}
