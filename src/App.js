import React, { useState, useRef, useEffect } from "react"
import ToDoList from "./Components/ToDoList"

// number of items per page
const PER_PAGE = 5;

export default function App() {
  const [toDoArray, setToDoArray] = useState([]);
  const [page, setPage] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [inputEditValue, setInputEditValue] = useState('');
  const [editField, setEditField] = useState(null)

  const inputRef = useRef(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  //when remove last item from a page, focus page-1
  useEffect(() => {
    if (toDoArray.length % PER_PAGE === 0) {
      setPage(prevState => prevState > 0 ? prevState - 1 : prevState)
    }
  }, [toDoArray])

  function handleSort() {
    let dublicateToDoArray = [...toDoArray];
  
    // remove and save the dragged item
    const draggedItemContent = dublicateToDoArray.splice(dragItem.target, 1)[0];
  
    //switch the position
    dublicateToDoArray.splice(dragOverItem.target, 0, draggedItemContent)
  
    dragItem.target = null;
    dragOverItem.target = null;

    setToDoArray(dublicateToDoArray);
  }

  function addIntoArray(e) {
    //prevent refresh after form submit
    e.preventDefault();

    setToDoArray(prevState => ([inputValue, ...prevState]));
    //clear the input field after submit
    setInputValue('');

    //focus the input field after submit
    inputRef.current.focus();

    // focus first page after add todo Item
    setPage(0)
  }

  function deleteItem(indexElement) {
    const updatedArrayList = [...toDoArray];

    //remove indexElement item from array
    updatedArrayList.splice(indexElement, 1);
    setToDoArray(updatedArrayList);
  }

  //open edit field on double click
  function handleClick(event, indexElement) {
    if (event.detail === 2) {
      event.nativeEvent.stopImmediatePropagation();
      setInputEditValue(toDoArray[indexElement]);
      setEditField(indexElement);
    }
  }
 
  //edit element and save it
  function editItem(e, indexElement) {
    setInputEditValue(e.target.value)

    //save the edited item in ToDoArray at same index
    let dublicateArray = [...toDoArray]
    dublicateArray.splice(indexElement, 1, e.target.value)
    setToDoArray(dublicateArray)
  }

  //listen to ENTER to close the edit input field
  function listenToEnter(e) {
    if (e.key === "Enter") {
      setEditField(null)
    }
  }

  //when click anywhere outside set EditField to null
  useEffect(() => {
    document.addEventListener('click', () => {
      setEditField(null);
    });

    return () => {
      document.removeEventListener('click', () => {
        setEditField(null);
      });
    }
  }, []);

  return (
    <div className="main_Container">

      <div className="mainContent_Layout">
        <h1>You have {toDoArray.length} Todos</h1>

        <ul className="todo_List">
          {toDoArray.slice(page * PER_PAGE, (page + 1) * PER_PAGE).map((toDoElement, indexElement) => {
              return (
                <ToDoList 
                  key={indexElement}
                  id={indexElement}
                  dragOverItem1={(e) => dragOverItem.target = e}
                  dragItem1={(e) => dragItem.target = e}
                  toDoElement={toDoElement}
                  handleClick={(event) => handleClick(event, indexElement)}
                  editField={editField}
                  inputEditValue={inputEditValue}
                  listenToEnter={(e) => listenToEnter(e)}
                  editItem={(e) => editItem(e,indexElement)}
                  deleteItem={() => deleteItem(indexElement)}
                  handleSort={() => handleSort()}
                />
              )})
          }
        </ul>

        {toDoArray.length > PER_PAGE &&
          <div className="todo_Pages">
            {[...Array(Math.floor(toDoArray.length % PER_PAGE === 0
              ? (toDoArray.length / PER_PAGE) : (toDoArray.length / PER_PAGE + 1)))].map((_, i) => (
                <span key={i} onClick={() => setPage(i)}>{i + 1}</span>
              ))}
          </div>
        }
      </div>

      <form>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Double click item to edit"
          ref={inputRef}
        />
        <button
          className="todo_Button"
          onClick={addIntoArray}
          disabled={inputValue && inputValue.match(/\S/) ? false : true}>Submit</button>
      </form>

    </div>
  )
}