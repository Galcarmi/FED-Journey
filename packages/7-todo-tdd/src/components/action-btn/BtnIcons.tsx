import { dataHooks } from '../utils/dataHooks';

export const btnClasses = {
  todo__list__item__actions__done: 'todo__list__item__actions__done',
  todo__list__item__actions__delete: 'todo__list__item__actions__delete',
  todo__list__item__actions__edit: 'todo__list__item__actions__edit',
};

export const btnIcons = {
  DeleteBtn: (
    <path
      className={btnClasses.todo__list__item__actions__delete}
      data-hook={dataHooks.TODO_ITEM_DELETE}
      d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 16.538l-4.592-4.548 4.546-4.587-1.416-1.403-4.545 4.589-4.588-4.543-1.405 1.405 4.593 4.552-4.547 4.592 1.405 1.405 4.555-4.596 4.591 4.55 1.403-1.416z"
    />
  ),
  DoneBtn: (
    <path
      className={btnClasses.todo__list__item__actions__done}
      data-hook={dataHooks.TODO_ITEM_DONE}
      d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.393 7.5l-5.643 5.784-2.644-2.506-1.856 1.858 4.5 4.364 7.5-7.643-1.857-1.857z"
    />
  ),
  EditBtn: (
    <path
      className={btnClasses.todo__list__item__actions__edit}
      data-hook={dataHooks.TODO_ITEM_EDIT}
      d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.994 12.964l3.106 3.105-4.112.931 1.006-4.036zm9.994-3.764l-5.84 5.921-3.202-3.202 5.841-5.919 3.201 3.2z"
    />
  ),
};
