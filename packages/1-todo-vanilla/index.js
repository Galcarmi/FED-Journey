const elementClasses = {
    todoList:'.todo-list',
    actionTODOBtn: '.add-todo-btn',
    todoTxtInput:'.todo-text-input',
    actionDoneSVG: '.action-done-svg',
    actionDeleteSVG: '.action-delete-svg',
    actionEditSVG: '.action-edit-svg',
    todoItemContent:'.todo-item-content',
    todoEmptyState: '.todo-empty-state',
}

const elementSelectors = {
    todoList : ()=>document.querySelector(elementClasses.todoList),
    actionTODOBtn : ()=> document.querySelector(elementClasses.actionTODOBtn),
    todoTxtInput : ()=> document.querySelector(elementClasses.todoTxtInput),
    getTODOItemById : (id) => document.querySelector(`[id='${id}']`),
    todoEmptyState : () => document.querySelector(elementClasses.todoEmptyState),
}

const eTODOActionBtnMode = {
    EDIT:'EDIT',
    ADD:'ADD',
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

class TODOManager{
    constructor(){
        this.todos = [];
        this.state = { TODOBtnMode: eTODOActionBtnMode.ADD, id:0};
        this._initEventListeners();
    }


    _getTODOTemplate({content, id}){
        return `<div class="todo-item" id="${id}">
        <div class="todo-item-content">${content}</div>
        <div class="todo-item-actions">
                        <svg class ="action-done-svg"xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.393 7.5l-5.643 5.784-2.644-2.506-1.856 1.858 4.5 4.364 7.5-7.643-1.857-1.857z"/></svg>
                        <svg class = "action-delete-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 16.538l-4.592-4.548 4.546-4.587-1.416-1.403-4.545 4.589-4.588-4.543-1.405 1.405 4.593 4.552-4.547 4.592 1.405 1.405 4.555-4.596 4.591 4.55 1.403-1.416z"/></svg>
                        <svg class = "action-edit-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.994 12.964l3.106 3.105-4.112.931 1.006-4.036zm9.994-3.764l-5.84 5.921-3.202-3.202 5.841-5.919 3.201 3.2z"/></svg>
                        </div>
    </div>`
    }

    _renderTodo({content, id}){
        const todoHTMLList = elementSelectors.todoList();
        todoHTMLList.insertAdjacentHTML('beforeend', this._getTODOTemplate({content, id}))
    }

    _handleActionAddTodo(){
        if(this.state.TODOBtnMode === eTODOActionBtnMode.ADD){
            const content = elementSelectors.todoTxtInput().value;
            if(!content) {
                return;
            }

            this.addTodo(content);
            this._resetTODOInputValue();
        }
        else{
            const currentEditContent = elementSelectors.todoTxtInput().value;
            if(currentEditContent){
                const todoItem = elementSelectors.getTODOItemById(this.state.id);
                todoItem.querySelector(elementClasses.todoItemContent).innerHTML = currentEditContent;
                const editedIndex = this.todos.findIndex(todo=>todo.id === this.state.id);
                this.todos[editedIndex].content = currentEditContent;
            }

            this._changeTODOBtnMode(eTODOActionBtnMode.ADD);
            this._resetTODOInputValue();
        }
    }

    _initEventListeners(){
        elementSelectors.actionTODOBtn().addEventListener('click', (e)=>{
            this._handleActionAddTodo(); 
            e.stopPropagation();
            elementSelectors.todoTxtInput().focus();
        });

        elementSelectors.todoTxtInput().addEventListener('keypress', (e)=>{
            if (e.key === 'Enter') {
                this._handleActionAddTodo(); 
              }
        });

        document.addEventListener('click', () =>{
            if(this.state.TODOBtnMode === eTODOActionBtnMode.EDIT){
                this._changeTODOBtnMode(eTODOActionBtnMode.ADD);
                this._resetTODOInputValue();
            }
        });

        elementSelectors.todoTxtInput().addEventListener('click',(e)=>{e.stopPropagation()})
    }

    _resetTODOInputValue(){
        elementSelectors.todoTxtInput().value = '';
    }

    _changeTODOBtnMode(mode){
        if(mode === eTODOActionBtnMode.EDIT){
            this.state.TODOBtnMode = eTODOActionBtnMode.EDIT;
            elementSelectors.actionTODOBtn().innerHTML = 'Edit';
        }
        else if (mode === eTODOActionBtnMode.ADD){
            this.state.TODOBtnMode = eTODOActionBtnMode.ADD;
            elementSelectors.actionTODOBtn().innerHTML = 'Add';
        }
    }

    _addEventListenersForTODOItem({id}){
        const todoItem = elementSelectors.getTODOItemById(id);
        todoItem.querySelector(elementClasses.actionDeleteSVG).addEventListener('click',()=>{
            const deletedIndex = this.todos.findIndex(todo=>todo.id === id);
            this.todos.splice(deletedIndex,1);
            elementSelectors.todoList().removeChild(todoItem);
            this._updateEmptyState();
        });

        todoItem.querySelector(elementClasses.actionDoneSVG).addEventListener('click',()=>{
            todoItem.querySelector(elementClasses.todoItemContent).classList.toggle('crossed-content');
        });

        todoItem.querySelector(elementClasses.actionEditSVG).addEventListener('click',(e)=>{
            this.state.id = id;
            this._changeTODOBtnMode(eTODOActionBtnMode.EDIT);
            const currentContent = todoItem.querySelector(elementClasses.todoItemContent).innerHTML;
            elementSelectors.todoTxtInput().value = currentContent;
            elementSelectors.todoTxtInput().focus();
            e.stopPropagation();
        });
    }

    _updateEmptyState(){
        const isTODOListEmpty  = !this.todos.length;
        if(isTODOListEmpty){
            elementSelectors.todoEmptyState().classList.add('visible');
        }
        else{
            elementSelectors.todoEmptyState().classList.remove('visible'); 
        }
    }

    addTodo(content){
        const id = uuidv4();
        const todo = {content, id};
        this.todos.push(todo);
        this._renderTodo(todo);
        this._addEventListenersForTODOItem(todo);
        this._updateEmptyState();
    }
}

const todoManager = new TODOManager();

window.todoManager = todoManager.todos;