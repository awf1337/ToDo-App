import dndImage from "../images/bars-solid.svg";
import deleteImage from "../images/trash-can-solid.svg";
import React from "react";

export default function toDoList(props) {
    
    return (
        <li
          key={props.id}
          className={`todo_LineContent Color${props.id % 2 === 0 && "Grey"}`}
          onDragEnter={() => props.dragOverItem1(props.id)}
        >
          <img
            src={dndImage}
            alt=""
            className="dndImage"
            draggable
            onDragStart={() => props.dragItem1(props.id)}
            onDragEnd={() => props.handleSort()}
            onDragOver={(e) => e.preventDefault()}
          />
  
          {props.editField === props.id
            ?
            <input
              style={{"textAlign": "center", "backgroundColor" : "rgb(255, 255, 255, 0.8)", "border" : "none"}}
              value={props.inputEditValue}
              onKeyUp={(e) => props.listenToEnter(e)}
              onChange={(e) => props.editItem(e)}
              onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); }} />
            :
            <p className="toDoElement" onClick={(event) => props.handleClick(event)}> {props.toDoElement} </p>}
          <img
            onClick={() => props.deleteItem()}
            src={deleteImage}
            alt=""
            className="deleteImage"
          />
        </li>
      )  
}