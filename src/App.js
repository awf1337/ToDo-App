import React, {useState, useRef} from "react"

// number of items per page
const PER_PAGE = 5;

export default function App() {
  const [toDoArray, setToDoArray] = useState([]);
  const [page, setPage] = useState(0);
  const [inputValue, setInputValue] = useState('');

  const inputRef = useRef(null);

  function addIntoArray(e) {
    //prevent refresh after form submit
    e.preventDefault()

    setToDoArray(prevState => ([inputValue, ...prevState]))
    //clear the input field after submit
    setInputValue('');

    //focus the input field after submit
    inputRef.current.focus()
  }

  function deleteItem(indexElement) {
    //deep copy of toDoArray array 
    const updatedArrayList = JSON.parse(JSON.stringify(toDoArray))

    //remove indexElement item from array
    updatedArrayList.splice(indexElement,1)
    setToDoArray(updatedArrayList)
  }


  const toDoList = toDoArray.map((toDoElement,indexElement) => {
        return (
              <div className="todo_Content" key={indexElement}>
                <div className="todo_Items">
                  <li> {toDoElement} </li>
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
            <div className="todo_Pages">
              {[...Array(parseInt(toDoArray.length/5) + 1)].map((_ , i) => (
                <span onClick={() => setPage(i)}>{i+1}</span> 
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