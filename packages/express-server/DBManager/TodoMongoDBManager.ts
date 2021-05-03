import mongoose from 'mongoose';
import { ITodoDTO } from 'fed-todo-journey_todo-common';
import { ITodoDBManager } from './ITodoDBManager';
import { IdNotFoundError } from '../errors/IdNotFoundError';
import { MissingFieldsError } from '../errors/MissingFieldsError';
import { todoDAO } from '../dao/TodoDAO';
import { isTestEnv } from '../utils/cmdUtils';

export class TodoMongoDBManager implements ITodoDBManager {
  public async addTodo(userId: string, todo: ITodoDTO): Promise<ITodoDTO> {
    if (!todo.content) {
      throw new MissingFieldsError('content');
    }

    return todoDAO.addItem({ content: todo.content, userId, isDone: false });
  }

  public async removeTodo(userId: string, _id: string): Promise<ITodoDTO> {
    if (!_id) {
      throw new MissingFieldsError('id');
    }

    const deletedTodo = await todoDAO.removeItem({ userId, _id });

    if (!deletedTodo) {
      throw new IdNotFoundError(_id);
    }

    return deletedTodo;
  }

  public async editTodo(userId: string, todo: ITodoDTO): Promise<ITodoDTO> {
    if (!todo._id) {
      throw new MissingFieldsError('id');
    }

    const updatedTodo = await todoDAO.editItem({ userId, _id: todo._id }, todo);

    if (!updatedTodo) {
      throw new IdNotFoundError(todo._id);
    }

    return updatedTodo;
  }

  public async getAllTodos(userId: string) {
    return todoDAO.findItems({ userId });
  }

  public async connectToMongoServer(DBPassword?: string): Promise<void> {
    const DBURI = `mongodb+srv://admin:${DBPassword}@cluster0.5zncg.mongodb.net/todoapp?retryWrites=true&w=majority`;
    await mongoose.connect(DBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if(isTestEnv()){
      this.deleteAllTodos();
    }
  }

  public deleteAllTodos():void{
    todoDAO.deleteAllTodos();
  }
}
