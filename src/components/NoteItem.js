import React ,{useContext} from 'react'
import contextValue from "../context/notes/NoteContext"

const NoteItem = (props) => {
    const context  = useContext(contextValue)
    const {deleteNote} = context
    const { note, updateNote} = props

    return (
        <>
        <div className='col-md-3 my-3'>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.description}</p>
                    <p className="card-text">{note.tag}</p>
        
                    <i className="fa-solid fa-trash-can" onClick={()=>{deleteNote(note._id); props.showAlert("Deleted Note Successfully","success")}} ></i>
                    <i className="fa-solid fa-file-pen ms-3" onClick={()=>{updateNote(note)}} ></i>
                </div>
            </div>
        </div>
        </>
    )
}

export default NoteItem