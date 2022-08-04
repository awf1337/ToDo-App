import React, {useState, useRef, useEffect} from "react"
import dndImage from "./images/bars-solid.svg"
import deleteImage from "./images/trash-can-solid.svg"

// number of items per page
const PER_PAGE = 5;

export default function App() {
  const [toDoArray, setToDoArray] = useState([]);
  const [page, setPage] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [inputEditValue, setInputEditValue] = useState('');
  const [editField,setEditField] = useState({index:-1,boolean:false})
  const [onMouseOutClick,setOnMouseOutClick] = useState(false)

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

    // focus first page after add todo Item
    setPage(0)
  }

  function deleteItem(indexElement) {
    //deep copy of toDoArray array 
    const updatedArrayList = JSON.parse(JSON.stringify(toDoArray));

    //remove indexElement item from array
    updatedArrayList.splice(indexElement,1);
    setToDoArray(updatedArrayList);
  }

  //when remove last item from a page, focus page-1
  useEffect(()=> {
    if(toDoArray.length%PER_PAGE === 0){
      setPage(prevState => prevState > 0 ? prevState-1 : prevState)
    }
  },[toDoArray])
  
  //open edit field on double click
  function handleClick (event,indexElement) {
    setInputEditValue(toDoArray[indexElement])
    switch (event.detail) {
      case 2:
        setEditField(prevState => ({boolean:!prevState.boolean,index:indexElement}))
        break;
    }
  }

  //edit element and save it
  function editItem (e,indexElement) {
    setInputEditValue(e.target.value)

    //save the edited item in ToDoArray
    let dublicateArray = [...toDoArray]
    dublicateArray.splice(indexElement,1,e.target.value)
    setToDoArray(dublicateArray)
  }

  //listen to ENTER to close the edit input field
  function listenToEnter(e) {
    if (e.key === "Enter") {
      setEditField(prevState => ({index:-1,boolean:!prevState.boolean}))
      setInputEditValue("")
    }
  }

  function listenToMouseClick(e) {
    if(onMouseOutClick === true){
      setEditField(prevState => ({index:-1,boolean:!prevState.boolean}))
      setInputEditValue("")
      setOnMouseOutClick(false)
    }
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

                  {editField.index === indexElement && editField.boolean === false
                  ?
                  <input 
                  value={inputEditValue} 
                  onMouseOut={() => setOnMouseOutClick(true)}
                  onKeyUp={(e) => listenToEnter(e)} 
                  onChange={(e)=> editItem(e,indexElement)}/> 
                  :
                  <p className="toDoElement" onClick={(event) => handleClick(event,indexElement)}> {toDoElement} </p>}
                  
                  <img 
                  onClick={() => deleteItem(indexElement)} 
                  src={deleteImage}
                  alt=""
                  className="deleteImage"
                  />
              </div>
        )
  })

  return (
      <div className="main_Container" onMouseDown={(e) => listenToMouseClick(e)}>

        <div>
          <h1>You have {toDoArray.length} Todos</h1>

          <ul className="todo_List">
            {toDoList.slice(page * PER_PAGE, (page + 1) * PER_PAGE)}
          </ul> 

          {toDoArray.length > PER_PAGE &&
            <div className="todo_Pages">
              {[...Array(Math.floor(toDoArray.length%PER_PAGE === 0
              ? (toDoArray.length/PER_PAGE) : (toDoArray.length/PER_PAGE + 1)))].map((_ , i) => (
                <span key={i} onClick={() => setPage(i)}>{i+1}</span> 
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
            <button className="todo_Button" onClick={addIntoArray} disabled={inputValue ? false : true}>Submit</button>
        </form>

      </div>
  )
}