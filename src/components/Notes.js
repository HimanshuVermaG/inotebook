import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import contextValue from "../context/notes/NoteContext"
import { AddNote } from './AddNote'
import NoteItem from './NoteItem'

function Notes(props) {
    //Usecontext is used to fetch the details of the note
    const context = useContext(contextValue)
    const history = useHistory()
    // notes is an object as many item to extract in it
    const { notes, fetchNotes,editNote } = context
    useEffect(() => {
        if(localStorage.getItem('token')){
        fetchNotes()}
        else{
            history.push('/login')
        }
    }, [])

    const ref = useRef(null)
    const refClose = useRef(null)
    const [note, setNote] = useState({id:"",etitle:"",edescription:"",etag:""})
    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({id:currentNote._id, etitle:currentNote.title,edescription:currentNote.description,etag:currentNote.tag})
    }
    const handleUpdateNote = (e)=>{
        refClose.current.click()
        editNote(note.id, note.etitle,note.edescription,note.etag)
        props.showAlert("Updated Note Successfully","success")
    }
    // 'e' is event
    const onChange = (e)=>{
        // '...value' spread operaor {actual value}, [vlaue1,value2] overwrite these value  
        setNote({...note,[e.target.name] : e.target.value})
    }
    return (
        <>
            <AddNote showAlert={props.showAlert} />
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" value ={note.etitle} className="form-control" id="etitle" name="etitle" onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description"className="form-label">Description</label>
                                    <input type="text" value ={note.edescription} className="form-control" id="edescription" name="edescription" onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" value ={note.etag}  className="form-control" id="etag" name="etag" onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled = {note.etitle.length<5 || note.edescription.length<5 } onClick={handleUpdateNote} type="button" className="btn btn-primary">Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <h1>Your Notes</h1>
                <div className="container">
                <h4>{notes.length === 0 && 'No notes to display'}</h4>
                </div>
                {notes.map((note) => {
                    return <NoteItem showAlert={props.showAlert} key={note._id} updateNote={updateNote} note={note} />
                })}
            </div>
        </>
    )
}

export default Notes