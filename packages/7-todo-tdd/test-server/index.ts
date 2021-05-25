import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {TodoInMemoryDBManager} from './DBManager/TodoInMemoryDBManager'
import { errorMiddleware, wrapError } from './middleware/errorHandler';
import { userIdMiddleware } from './middleware/userIdMiddleware';
import { IDigestedRequest } from './types/IDigestedRequest';
import { ITodoDTO } from 'fed-todo-journey_todo-common';

process.title = 'test-server';
const todoMongoDBManager: TodoInMemoryDBManager = new TodoInMemoryDBManager();
const app: express.Express = express();
const port: number | string = 8000;

app.use(bodyParser.json());
app.use(express.static(process.cwd()+'/public'));
app.use(cookieParser());
app.use(userIdMiddleware);

app.get(
  '/',
  wrapError((req: IDigestedRequest, res: express.Response) => {
    res.sendFile(`public/index.html`, {
      root: process.cwd(),
    });
  })
);

app.post(
  '/todo',
  wrapError(async (req: IDigestedRequest, res: express.Response) => {
    const addedTodo: ITodoDTO = await todoMongoDBManager.addTodo(
      req.userId,
      req.body
    );
    res.status(200).send(addedTodo);
  })
);

app.put(
  '/todo',
  wrapError(async (req: IDigestedRequest, res: express.Response) => {
    const editedTodo: ITodoDTO = await todoMongoDBManager.editTodo(
      req.userId,
      req.body
    );
    res.status(200).send(editedTodo);
  })
);

app.delete(
  '/todo/:id',
  wrapError(async (req: IDigestedRequest, res: express.Response) => {
    const deletedTodo: ITodoDTO = await todoMongoDBManager.removeTodo(
      req.userId,
      req.params.id
    );
    res.status(200).send(deletedTodo);
  })
);

app.get(
  '/todos',
  wrapError(async (req: IDigestedRequest, res: express.Response) => {
    const todos: {[key:string]:ITodoDTO} = await todoMongoDBManager.getAllTodos(
      req.userId
    );
    res.status(200).send(todos);
  })
);

app.use(errorMiddleware);

app.listen(port, ():void => {});


setTimeout(() => {
  process.exit(0);
}, 20000)
