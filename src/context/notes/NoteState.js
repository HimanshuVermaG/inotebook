import React, { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = "http://localhost:1111"
  const notesInitial = [ ]
  const [notes, setNotes] = useState(notesInitial)
  // 1: Fetch all notes
  const fetchNotes = async ()=>{
    //Api Call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
    });
    const json = await response.json()
    setNotes(json)
  }

  // 2: Add Note
  const addNote = async (title, description, tag) => {
    //Api Call
    const response = await fetch(`${host}/api/notes/addnotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({title,description,tag}) // body data type must match "Content-Type" header
    });
    const note = await response.json()

    setNotes(notes.concat(note))
  }

  // 3: Edit Note
  const editNote = async (id, title, description, tag) => {
    //Api Call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({title,description,tag}) // body data type must match "Content-Type" header
    });
    // Creaitng new object to update it in realtime
    let newNotes = JSON.parse(JSON.stringify(notes))

    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break
      }
    }
    // Updating value in db
    setNotes(newNotes)
  }
  // 4:Delete Note
  const deleteNote = async (id) => {
    // Api Call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      }
    });
    // Logic to delete note

    const newNote = notes.filter((note) => { return note._id !== id })
    setNotes(newNote)
  }

  return (
    <NoteContext.Provider value={{ notes, addNote, editNote, deleteNote,fetchNotes }} >
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;