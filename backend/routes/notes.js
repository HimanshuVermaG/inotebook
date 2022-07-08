const express = require('express');
const Notes = require('../models/Notes');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator'); // Used for validation purpose

// //ROUT 1: Add notes:: POST:'/api/auth/addnotes - Login required'

router.post('/addnotes',fetchuser,[
    body('title', "Enter a valid Title!!!").isLength({ min: 3 }),
    body('description', "Description must be greater than 5 char!!!").isLength({ min: 5 }),
] ,async (req,res)=>{
    const {title,description,tag} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const note = new Notes({title,description,tag,user:req.user.id})
        const savedNote = await note.save()
        res.json(savedNote)
    }   
    catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured in structure!!!")
    }
})

//ROUT 2: GET all the notes:: GET:'/api/auth/fetchallnotes - Login required'
router.get('/fetchallnotes',fetchuser, async (req,res)=>{
    try {
    const notes = await Notes.find({user:req.user.id});
    res.json(notes)
    } 
    catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured in structure!!!")
    }
})

//ROUT 3: Update an existing notes:: PUT:'/api/auth/updatenote - Login required'
router.put('/updatenote/:id',fetchuser,async (req,res)=>{
    try {
        const {title,description,tag} = req.body;
        // Create a newNote object
        const newNote = {}
        if(title){newNote.title=title};
        if(description){newNote.description=description};
        if(tag){newNote.tag=tag};

        // Find a note to be updated and then update it
        let notes = await Notes.findById(req.params.id)
        if(notes.user.toString()!== req.user.id){
            return res.status(401).send("Not Allowed!!!")
        }
        if (!notes){return res.status(404).send("Not Found!!!")}
        notes = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.json({notes})
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured in structure!!!");
    }
})

//ROUT 4: Delete an existing notes:: DELETE:'/api/auth/deletenote - Login required'
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    try {
        // Create a newNote object
        // Find a note to be deleted and then delete it
        let notes = await Notes.findById(req.params.id)

        // Allow deletion only if user own this note
        if(notes.user.toString()!== req.user.id){
            return res.status(401).send("Not Allowed!!!")
        }
        if (!notes){return res.status(404).send("Not Found!!!")}
        notes = await Notes.findByIdAndDelete(req.params.id)
        res.json({"Success":"Note Deleted Successfully!!!",note:notes})
    }    
        catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured in structure!!!")
    }
})

module.exports = router;