import React, {useContext, useEffect, useRef, useState} from 'react';
import noteContext from "../context/notes/noteContext";
import Noteitem from './Noteitem';
import AddNotes from "./AddNotes";
import { useNavigate } from 'react-router-dom';


const Notes = (props) => {
    const context = useContext(noteContext);
    const {notes, getAllNotes, editNote} = context;
    const navigate = useNavigate();
    useEffect(()=>{
      if(localStorage.getItem('token')){
        getAllNotes()
      }else{
        navigate("/login")
      }
      // eslint-disable-next-line
    },[])

    const ref = useRef(null)
    const refClose = useRef(null)

    const [note,setNote] = useState({id:"", etitle:"", edescription:"", etag:""})

    const updateNote = (currentNote) => {
      ref.current.click();
      setNote({id:currentNote._id ,etitle: currentNote.title, edescription: currentNote.description , etag: currentNote.tag})
    }

    const handleClick = (e)=>{
      console.log("Updated",note);
      editNote(note.id, note.etitle, note.edescription, note.etag);
      refClose.current.click();
      props.showAlert("Updated successfully", "success");
    }

    const onChange = (e)=>{
      setNote({...note,  [e.target.name]: e.target.value})
    }


  return (
    <>
        <AddNotes showAlert={props.showAlert}/>
         {/* Button trigger modal */}
        <button ref={ref} type="button"  className="d-none btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Launch demo modal
        </button>

        {/* Modal  */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
              <form>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="etitle"
              value={note.etitle}
              name="etitle"
              aria-describedby="emailHelp"
              onChange={onChange}
              minLength={5} required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="edescription"
              value={note.edescription}
              name="edescription"
              onChange={onChange}
              minLength={5} required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tag" className="form-label">
              Tag
            </label>
            <input
              type="text"
              className="form-control"
              id="etag"
              name="etag"
              value={note.etag}
              onChange={onChange}
            />
          </div>
        </form>
              </div>
              <div className="modal-footer">
                <button ref={refClose} type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleClick} >Update Note</button>
              </div>
            </div>
          </div>
        </div>

       <div className="row my-3">
        <h2>Your's Note</h2>
        <div className="container">
          {notes.length ===0 && 'No notes to display'}
        </div>
        {notes.map((note)=>{
          return <Noteitem key ={note._id} updateNote={updateNote} note = {note} showAlert={props.showAlert}/>
        })}
        </div>
    </>
  )
}

export default Notes
