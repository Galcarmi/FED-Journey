import { jss } from '../../styles/config';
import React, {
  FC,
  ReactElement,
  PropsWithChildren,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import { ITodoDTO } from 'fed-todo-journey_todo-common';
import { s as commonClasses } from '../../styles/commonClasses';
import { ITodoContext, TodoContext } from '../../context/TodoContext';
import { colors, commonStyles } from '../../styles/commonStyles';
import { ActionBtn } from '../action-btn/ActionBtn';
import { btnIcons } from '../action-btn/BtnIcons';
import { dataHooks } from '../utils/dataHooks';

interface TodoItemProps {
  todo: ITodoDTO;
}

export const TodoItem: FC<TodoItemProps> = (
  props: PropsWithChildren<TodoItemProps>
): ReactElement => {
  const { todosService, todos, setTodos } =
    useContext<ITodoContext>(TodoContext);
  const [editInputVisibility, setEditInputVisibility] =
    useState<boolean>(false);
  const [editInputValue, setEditInputValue] = useState<string>('');
  const editInputRef = useRef<HTMLInputElement>(null);

  const onDoneClick = async (): Promise<void> => {
    const updatedTodo: ITodoDTO = await todosService.editTodo({
      ...props.todo,
      isDone: !props.todo.isDone,
    });
    todos[updatedTodo._id] = updatedTodo;
    setTodos({ ...todos });
  };

  const onDeleteClick = async (): Promise<void> => {
    await todosService.deleteTodo(props.todo._id);
    delete todos[props.todo._id];
    setTodos({ ...todos });
  };

  const onEditClick = (): void => {
    setEditInputVisibility(!editInputVisibility);
  };

  const onEditInputEnter = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      setEditInputVisibility(false);
    }
  };

  const editTodo = async () => {
    if (props.todo.content !== editInputValue && editInputValue !== '') {
      const updatedTodo: ITodoDTO = await todosService.editTodo({
        ...props.todo,
        content: editInputValue,
      });
      todos[updatedTodo._id] = updatedTodo;
      setTodos({ ...todos });
    }
  };

  const hideEditInput = () => {
    setEditInputVisibility(false);
  };

  useEffect(() => {
    if (editInputVisibility) {
      setEditInputValue(props.todo.content);
      editInputRef.current?.focus();
    } else {
      editTodo();
    }
  }, [editInputVisibility]);

  return (
    <div
      id={props.todo._id}
      className={s.todo__list__item}
      key={props.todo._id}
      data-hook={dataHooks.TODO_ITEM}
    >
      {editInputVisibility && (
        <input
          type="text"
          className={s.todo__list__item__editInput}
          ref={editInputRef}
          onBlur={hideEditInput}
          value={editInputValue}
          onChange={(e) => setEditInputValue(e.target.value)}
          onKeyPress={onEditInputEnter}
          data-hook={dataHooks.TODO_ITEM_EDIT_INPUT}
        />
      )}
      <div
        className={`${s.todo__list__item__content} ${
          props.todo.isDone && commonClasses.crossedContent
        }`}
        data-hook={dataHooks.TODO_ITEM_CONTENT}
      >
        {props.todo.content}
      </div>
      <div className={s.todo__list__item__actions}>
        <ActionBtn
          onClick={onEditClick}
          svgIconPath={btnIcons.EditBtn}
          color={colors.softYellow}
        />
        <ActionBtn
          onClick={onDeleteClick}
          svgIconPath={btnIcons.DeleteBtn}
          color={colors.red}
        />
        <ActionBtn
          onClick={onDoneClick}
          svgIconPath={btnIcons.DoneBtn}
          color={colors.green}
        />
      </div>
    </div>
  );
};

export const s = jss
  .createStyleSheet({
    todo__list__item: {
      ...commonStyles.minTodoItemHeight,
      ...commonStyles.RLMarginS,
      ...commonStyles.roundedBorderS,
      ...commonStyles.blackBorder,
      ...commonStyles.TPmarginM,
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      '&:hover $todo__list__item__actions': {
        opacity: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
      },
    },
    todo__list__item__editInput: {
      ...commonStyles.fontS,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: '400',
      border: 'none',
      textAlign: 'center',
    },
    todo__list__item__content: {
      ...commonStyles.fontS,
      width: '55%',
      overflowWrap: 'break-word',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    todo__list__item__actions: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      right: 0,
      opacity: 0,
      transition: 'all 0.5s ease',
    },
  })
  .attach().classes;
