const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const Notes = require('../models/Note');
const { body, validationResult } = require('express-validator');



// Route 1 : Get all Notes using: GET "api/auth/fetchallnotes".  login require
router.get('/fetchallnotes',fetchuser, async (req, res)=>{
    try {
        const notes = await Notes.find({user: req.user.id});
        res.json(notes)
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }
})

// Route 2 : Add a new Note using: Post "api/auth/addnote".  login require
router.post('/addnote',fetchuser,[
    body('title','Please enter a title').isLength({min:3}),
    body('description','Please enter a Description').isLength({min:5}),
], async (req, res)=>{
    try {
    const {title, description , tag}= req.body;
    //if there an error : return Bad request and the errors 
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        });
    }
    const note = new Notes({
        title, description, tag, user: req.user.id
    }) 
    const savedNote = await note.save()
    res.json(savedNote)
    } catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }
})

// Route 3 : Update an existing Note using: Put "api/auth/updatenote".  login require
router.put('/updatenote/:id',fetchuser, async (req, res)=>{
    const {title, description, tag} = req.body;
    try {
        //create a new note object
    const newNote = {};
    if(title){newNote.title = title}
    if(description){newNote.description = description}
    if(tag){newNote.tag = tag}

    //find the note to be update and updateit
    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")};

    if(note.user.toString() !== req.user.id){return res.status(401).send("Not Allowed")}

    note = await Notes.findByIdAndUpdate(req.params.id, {$set:newNote}, {new:true})
    res.json({note});
    } catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }
    
})

// Route 4 : Delete an existing Note using: Delete "api/auth/deletenote".  login require
router.delete('/deletenote/:id',fetchuser, async (req, res)=>{
    try {
    //find the note to be update and updateit
    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")};

    if(note.user.toString() !== req.user.id){return res.status(401).send("Not Allowed")}

    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({"Success":"Note has been deleted", note:note});
    } catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }
    
})

module.exports = router