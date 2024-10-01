import { useState } from "react";
import { useTodoStore } from "../../store/todoStore";

const TodoList = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>("");

  const { todos, addTodo, removeTodo, editTodoTitle, toggleComplete } =
    useTodoStore();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleAddTodo = () => {
    if (newTodoTitle.trim() === "") return;
    addTodo(newTodoTitle);
    setNewTodoTitle("");
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="absolute bottom-4 right-4 z-20 bg-purple-500 text-white p-2 ml-96 rounded"
      >
        {isOpen ? "Close" : "Open"}
      </button>
      <div
        className={`fixed top-1/2 left-1/2 w-[500px] h-auto bg-white z-10 flex flex-col p-5 outline transition-transform duration-500 ease-in-out transform ${
          isOpen
            ? "scale-100 translate-x-[200px] translate-y-[-50%]" // 冒出後向右移動 200px
            : "scale-0 translate-x-[-50%] translate-y-[-50%]" // 初始狀態縮小並居中
        }`}
      >
        <h2 className="text-xl mb-4">Todo List</h2>

        <div className="mb-4 flex">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            className="flex-grow p-2 border rounded"
            placeholder="New Todo"
          />
          <button
            onClick={handleAddTodo}
            className="bg-green-500 text-white p-2 ml-2 rounded"
          >
            +
          </button>
        </div>

        <ul className="flex-grow overflow-y-auto">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
                className="mr-2 w-6 h-6"
              />
              <input
                type="text"
                value={todo.title}
                onChange={(e) => editTodoTitle(todo.id, e.target.value)}
                className={`flex-grow p-1 ${
                  todo.completed ? "line-through text-gray-500" : ""
                } text-xl`}
              />
              <button
                onClick={() => removeTodo(todo.id)}
                className="bg-red-500 text-white p-1 ml-2 rounded"
              >
                刪除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TodoList;
