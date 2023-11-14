import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import cors from "cors";

const app = express();
const port = 3005;
let Note; // mongoose model 

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// create and init database 
// create note, delete note, update note

async function initDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/keeperApp");
    } catch (error) {
        console.error(error);
    }

    const NoteSchema = new mongoose.Schema({
        title: String,
        contents: String,
    });

    Note = mongoose.model("Note", NoteSchema);
}
initDB();


app.get("/", async (req, res) => {
    try {
        const notes = await Note.find({});
        return res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        return res.status(400).json({errorMsg: "Could not fetch data. Try again later."})
    }
    
})

app.post("/", async (req, res) => {
    const {title, contents} = req.body;

    const newNote = new Note({
        title: title,
        contents: contents,
    });

    try {
        await newNote.save();
    } catch (error) {
        console.error(error);
        return res.status(404).json({errorMsg: "No data created."})
    }

    return res.status(201).json("Successfully created a new note");
})

app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await Note.deleteOne({_id: id});
    } catch (error) {
        console.error(error);
        return res.status(400).json({errorMsg: "Could not delete data. Try again later."})
    }

    return res.status(200).json("Successfully deleted the note.");
}) 

app.put("/update/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await Note.findOneAndUpdate({_id: id}, {
            title: req.body.title,
            contents: req.body.contents,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({errorMsg: "Could not updaate data. Try again later."})
    }

    return res.status(200).json("Successfully updated the note.");
})


app.listen(port, () => console.log(`Server's up. Listening on port ${port}`));

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('Mongoose connection is disconnected due to application termination');
        process.exit(0);
    } catch (error) {
        console.error(error);
    }
});