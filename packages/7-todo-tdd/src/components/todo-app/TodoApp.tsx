import React, {
  ChangeEvent,
  FC,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import { jss } from '../../styles/config';
import { TodoItem } from '../todo-item/TodoItem';
import { ITodoContext, TodoContext } from '../../context/TodoContext';
import withTodosContext from '../HOC/withTodos';
import { ITodoDTO } from 'fed-todo-journey_todo-common';
import { commonStyles, colors } from '../../styles/commonStyles';
import { dataHooks } from '../utils/dataHooks';

const TodoApp: FC<{}> = (): ReactElement => {
  const [todoInputValue, setTodoInputValue] = useState<string>('');
  const { todosService, todos, setTodos } =
    useContext<ITodoContext>(TodoContext);

  const onAddClick = async (): Promise<void> => {
    console.log('click');
    console.log(todoInputValue,'value');
    addTodo();
  };

  const onTodoInputEnter = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const addTodo = async (): Promise<void> => {
    if (todoInputValue) {
      const addedTodo: ITodoDTO = await todosService.addTodo(todoInputValue);
      todos[addedTodo._id] = addedTodo;
      setTodos({ ...todos });
      setTodoInputValue('');
    }
  };

  useEffect(() => {
    todosService.getAllTodos().then((todos) => setTodos({ ...todos }));
  }, []);

  return (
    <div className={s.container}>
      <div className={s.todo}>
        <div className={s.todo__list}>
          {Object.values(todos).map((todo) => (
            <TodoItem key={todo._id} todo={todo} />
          ))}
        </div>
        <div className={s.todo__inputContainer}>
          <input
            type="text"
            className={s.todo__inputContainer__input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setTodoInputValue(e.target.value);
            }}
            value={todoInputValue}
            onKeyPress={onTodoInputEnter}
            data-hook={dataHooks.TODO_INPUT}
          />
          <button
            className={s.todo__inputContainer__addBtn}
            onClick={onAddClick}
            data-hook={dataHooks.ADD_BTN}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export const s = jss
  .createStyleSheet({
    container: {
      height: '100vh',
      ...commonStyles.RLMarginLPercent,
    },
    '@media only screen and (max-width: 600px)': {
      container: {
        ...commonStyles.RLMarginMPercent,
      },
      todoApp__inputContainer: {
        width: `${
          100 - +commonStyles.RLMarginMPercent.marginLeft.split('%')[0] * 2
        }%`,
      },
    },
    '@media only screen and (max-width: 400px)': {
      container: {
        ...commonStyles.RLMarginSPercent,
      },
      todoApp__inputContainer: {
        width: `${
          100 - +commonStyles.RLMarginSPercent.marginLeft.split('%')[0] * 2
        }%`,
      },
    },
    todo: {
      ...commonStyles.TpaddingXXS,
      ...commonStyles.boxShadowM,
      backgroundColor: colors.white,
      minHeight: '100%',
      width: '100%',
      position: 'relative',
    },
    todo__list: {
      paddingBottom: `${
        commonStyles.minTodoItemHeight.minHeight.split('px')[0]
      }px`,
    },
    todo__inputContainer: {
      ...commonStyles.TPpaddingS,
      ...commonStyles.TGreyBorder,
      display: 'flex',
      position: 'fixed',
      width: `${
        100 - +commonStyles.RLMarginLPercent.marginLeft.split('%')[0] * 2
      }%`,
      bottom: 0,
      zIndex: 1000,
      backgroundColor: colors.white,
    },
    todo__inputContainer__input: {
      flex: 1,
      ...commonStyles.roundedBorderS,
      ...commonStyles.RLPaddingS,
      ...commonStyles.blackBorder,
      ...commonStyles.fontS,
      ...commonStyles.RLMarginS,
      overflow: 'visible',
      '&:focus': {
        flex: 1,
        ...commonStyles.roundedBorderS,
        ...commonStyles.RLPaddingS,
        ...commonStyles.focusedBlueBorder,
        ...commonStyles.fontS,
        ...commonStyles.RLMarginS,
        overflow: 'visible',
        outline: 'none',
      },
    },
    todo__inputContainer__addBtn: {
      ...commonStyles.RLMarginS,
      ...commonStyles.roundedBorderS,
      ...commonStyles.fontS,
      width: '80px',
      height: '30px',
      backgroundColor: colors.softBlue,
      color: colors.white,
      cursor: 'pointer',
      transition: 'all 0.2s',
      outline: 'none',
      border: 'none',
      '&:active': {
        ...commonStyles.RMarginS,
        ...commonStyles.roundedBorderS,
        ...commonStyles.fontS,
        backgroundColor: colors.blue,
        color: colors.white,
        width: '80px',
        cursor: 'pointer',
      },
    },
  })
  .attach().classes;

export default withTodosContext(TodoApp);
