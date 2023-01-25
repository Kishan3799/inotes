import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props)=>{
    const host = "http://localhost:5000"
    const notesInitial = []
    const[notes, setNotes] = useState(notesInitial);

    const getAllNotes = async () => {
      // API Call 
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": localStorage.getItem('token')
        }
      });
      const json = await response.json() 
      setNotes(json)
    }

    //Add a Note
    const addNote = async (title, description, tag) =>{
      //do api call
      const response = await fetch(`${host}/api/notes/addnote`,{
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          "auth-token":localStorage.getItem('token')
        },
        body:JSON.stringify({title, description, tag})
      });
      const note = await response.json();
      setNotes(notes.concat(note))
    }

    //DeleteNote
    const deleteNote = async(id)=>{
      //do api call
      const response = await fetch(`${host}/api/notes/deletenote/${id}`,{
        method: 'DELETE',
        headers: {
          'Content-Type':'application/json',
          "auth-token":localStorage.getItem('token')
        },
      });
      const json = response.json();
      console.log(json)

      console.log("Delete with this id" + id);
      const newNote = notes.filter((note)=>{return note._id!==id});
      setNotes(newNote)
    }


    //EditNote 
    const editNote = async (id, title, description, tag)=>{
      //Api Call
      const response = await fetch(`${host}/api/notes/updatenote/${id}`,{
        method: 'PUT',
        headers: {
          'Content-Type':'application/json',
          "auth-token":localStorage.getItem('token')
        },
        body:JSON.stringify({title, description, tag})
      });
      
      const json = response.json();
      console.log(json);

      let newNote = JSON.parse(JSON.stringify(notes))
      for (let index = 0; index < newNote.length; index++) {
        const element = newNote[index];
        if(element._id === id){
          newNote[index].title = title;
          newNote[index].description = description;
          newNote[index].tag = tag;
          break;
        }
      }
      setNotes(newNote);
    }
    return (
        <NoteContext.Provider value ={{notes, addNote, deleteNote, editNote, getAllNotes}}>
            {props.children}
        </NoteContext.Provider>
    ) 
}

export default NoteState;