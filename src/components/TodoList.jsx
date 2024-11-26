import "./TodoList.css";
import React, { useState } from 'react';


const todosKey='reactTodo';

const TodoList = () => {
  const [inputValue, setInputValue] = useState('');
  const [tasks, setTasks] = useState(()=>{
    const rawTodos = localStorage.getItem(todosKey);
    if(!rawTodos) return [];
    return JSON.parse(rawTodos)
  });
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleInputChange = (event) => setInputValue(event.target.value);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;
    if (tasks.map((task) => task.text).includes(trimmedInput)) {
      alert('Task already exists!'); // Notify user
      setInputValue(''); // Clear input field
      return;
    } 

    setTasks((prevTasks) => [
      ...prevTasks,
      { text: trimmedInput, completed: false },
    ]);
    setInputValue('');
  };

  //todo add data to localstorage

  localStorage.setItem('reactTodo',JSON.stringify(tasks));


  const handleDelete = (taskToDelete) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.text !== taskToDelete.text)
    );
  };

  const handleCompletionToggle = (index) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditValue(tasks[index].text);
  };

  const handleEditSubmit = (index) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, text: editValue } : task
      )
    );
    setEditIndex(null);
    setEditValue('');
  };

  const totalCompleted = tasks.filter((task) => task.completed).length;

  return (
    <div className="todo-container">
      <header>
        <h1>To-Do List</h1>
        <p>Total Completed Tasks: {totalCompleted}</p>
      </header>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
              placeholder="Add a task..."
          className="input"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button type="submit" className="btn">
          Add Task
        </button>
      </form>
      <ul>
        {tasks.map((task, index) => (
          <li key={index} className={`todo-list ${task.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleCompletionToggle(index)}
              className="checkbox"
            />
            {editIndex === index ? (
              <div className="edit-section">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="edit-input"
                />
                <button
                  className="save-btn"
                  onClick={() => handleEditSubmit(index)}
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <span>{task.text}</span>
                <button
                  className="edit-btn"
                  onClick={() => handleEditClick(index)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(task)}
                >
                  X
                </button>
              
              </>
            )}
          </li>
        ))}
      </ul>

    </div>
  );
};

export default TodoList;
