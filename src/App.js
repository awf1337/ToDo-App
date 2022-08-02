import React, {useState, useRef} from "react"

const PER_PAGE = 5;

export default function App() {
  const [toDoArray, setToDoArray] = useState([]);
  const [page, setPage] = useState(0);
  const inputRef = useRef(null);

  const [inputValue, setInputValue] = useState('');


  // adds into array
  function addIntoArray() {
    setToDoArray(prevState => ([inputValue, ...prevState]))
    setInputValue('');

    //clear the input after submit
    inputRef.current.focus()
  }

  function deleteItem(indexElement) {
    //deep copy of ToDo array 
    const updatedArrayList = JSON.parse(JSON.stringify(toDoArray))

    //remove indexElement item from array
    updatedArrayList.splice(indexElement,1)
    setToDoArray(updatedArrayList)
  }


  const toDoList = toDoArray.map((toDoElement,indexElement) => {
        return (
              <div className="todo_Content" key={indexElement}>
                {/* <div> for layout */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <li className="list"> {toDoElement} </li>
                </div>
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
          <>
            
            {[...Array(parseInt(toDoArray.length/5) + 1)].map((_, i) => (
              <a onClick={() => setPage(i)}>{i+1}</a> 
            ))}

          </>
          }
        </div>
        
        <div className="todo_Form">
            <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} ref={inputRef} id="todo_Input" />
            <button className="todo_Button" onClick={addIntoArray}>Submit</button>
        </div>

      </div>
  )
}