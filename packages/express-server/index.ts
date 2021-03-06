import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { TodoMongoDBManager } from './DBManager/TodoMongoDBManager';
import { logger } from './logger/logger';
import { eClientLocations } from './constants/clientLocations';
import { errorMiddleware, wrapError } from './middleware/errorHandler';
import { userIdMiddleware } from './middleware/userIdMiddleware';
import { IDigestedRequest } from './types/IDigestedRequest';
import { ITodoDTO } from 'fed-todo-journey_todo-common';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const parentFolder: string = path.join(process.cwd(), '../');
const todoMongoDBManager: TodoMongoDBManager = new TodoMongoDBManager();
todoMongoDBManager.connectToMongoServer(process.env.DBPassword);
const app: express.Express = express();
const port: number | string = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(express.static(parentFolder + eClientLocations.PRODUCTION));
app.use(cookieParser());
app.use(userIdMiddleware);

app.get(
  '/',
  wrapError((req: IDigestedRequest, res: express.Response) => {
    res.sendFile(`${eClientLocations.PRODUCTION}/index.html`, {
      root: parentFolder,
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

app.listen(port, () => {
  logger.info(`listening on ${port}`);
});
