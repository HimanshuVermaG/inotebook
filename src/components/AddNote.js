import React,{useContext,useState} from 'react'
import contextValue from "../context/notes/NoteContext"

export const AddNote = (props) => {
    //Usecontext is used to fetch the details of the note
    const context  = useContext(contextValue)
    // notes is an object as many item to extract in it
    const {addNote} = context
    const [note, setNote] = useState({title:"",description:"",tag:""})
    const handleAddNote = (e)=>{
        e.preventDefault()
        addNote(note.title,note.description,note.tag);
        setNote({title:"",description:"",tag:""})
        props.showAlert("Added Note Successfully","success")
    }
    // 'e' is event
    const onChange = (e)=>{
        // '...value' spread operaor {actual value}, [vlaue1,value2] overwrite these value  
        setNote({...note,[e.target.name] : e.target.value})
    }
    return (
        <div className="container my-5">
        <h1>Add Notes:-</h1>
        <form>
        <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input type="text" className="form-control" id="title" value={note.title} name = "title" onChange={onChange} />
        </div>
        <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input type="text" className="form-control" id="description" value={note.description} name="description" onChange={onChange} />
        </div>
        <div className="mb-3">
            <label htmlFor="tag" className="form-label">Tag</label>
            <input type="text" className="form-control" id="tag" value={note.tag} name="tag" onChange={onChange} />
        </div>
        <button disabled = {note.title.length<5 || note.description.length<5 } type="submit" className="btn btn-primary" onClick={handleAddNote}>Add Note</button>
        </form>
    </div>
    )
}
