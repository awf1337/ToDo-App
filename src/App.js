import React, {useState, useRef} from "react"
import dndImage from "./images/bars-solid.svg"

// number of items per page
const PER_PAGE = 5;

export default function App() {
  const [toDoArray, setToDoArray] = useState([]);
  const [page, setPage] = useState(0);
  const [inputValue, setInputValue] = useState('');

  const inputRef = useRef(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  function handleSort() {
    let dublicateToDoArray = [...toDoArray];

    // remove and save the dragged item
    const draggedItemContent = dublicateToDoArray.splice(dragItem.current,1)[0];

    //switch the position
    dublicateToDoArray.splice(dragOverItem.current, 0, draggedItemContent)

    //reset refs
    dragItem.current = null;
    dragOverItem.current = null;
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
  }

  function deleteItem(indexElement) {
    //deep copy of toDoArray array 
    const updatedArrayList = JSON.parse(JSON.stringify(toDoArray));

    //remove indexElement item from array
    updatedArrayList.splice(indexElement,1);
    setToDoArray(updatedArrayList);
  }


  const toDoList = toDoArray.map((toDoElement,indexElement) => {
        return (
              <div className={`todo_LineContent Color${ indexElement % 2 === 0 && "Grey" }`} key={indexElement}>
                  <img 
                  src={dndImage} 
                  alt="" 
                  className="dndImage"
                  draggable
                  onDragStart={() => dragItem.current = indexElement}
                  onDragEnter={() => dragOverItem.current = indexElement}
                  onDragEnd={handleSort}
                  onDragOver={(e) => e.preventDefault()}
                  />
                  <li> {toDoElement} </li>
                  <span className="todo_DeleteItem" onClick={() => deleteItem(indexElement)}>X</span>
              </div>
        )
  })

  return (
      <div className="main_Container">

        <div>
          <h1>You have {toDoArray.length} Todos</h1>

          <ul className="todo_List">
            {toDoList.slice(page * PER_PAGE, (page + 1) * PER_PAGE)}
          </ul> 

          {toDoArray.length > 5 &&
            <div className="todo_Pages">
              {[...Array(parseInt(toDoArray.length/5) + 1)].map((_ , i) => (
                <span key={i}onClick={() => setPage(i)}>{i+1}</span> 
              ))}
            </div>
          }
        </div>
        
        <form>
            <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} ref={inputRef}/>
            <button className="todo_Button" onClick={addIntoArray}>Submit</button>
        </form>

      </div>
  )
}