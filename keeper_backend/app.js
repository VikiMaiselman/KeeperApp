import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import cors from "cors";

import session from 'express-session';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';

const app = express();
const port = 3005;
let Note, User; // mongoose model 

app.use(cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
}));
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// 1. Configure a session, initialize passport
app.use(session({
    secret: process.env.PASSPORT_SECRET,
    resave: true,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


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

    const userSchema = new mongoose.Schema({
        username: String, 
        password: String,
        notes: [NoteSchema],
    });

    // 2. Initialize passportLocalMongoose
    userSchema.plugin(passportLocalMongoose);

    Note = mongoose.model("Note", NoteSchema);
    User = mongoose.model("User", userSchema);

    // 3. Configure passport-local
    passport.use(User.createStrategy()); // creates local login strategy
    
    passport.serializeUser(User.serializeUser()); // creates session cookie
    passport.deserializeUser(User.deserializeUser()); // cracks session cookie to obtain info 
}
initDB();


app.get("/:userId", async (req, res) => {
    let notes; 
    const userId = req.params?.userId;
    if(!userId) return res.status(200);

    try {
        notes = await User.find({_id: userId});
        return res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        return res.status(400).json({errorMsg: "Could not fetch data. Try again later."});
    }
});

app.post("/", async (req, res) => {
    const {title, contents, currentUser} = req.body;

    const newNote = new Note({
        title: title,
        contents: contents,
    });

    try {
        await User.updateOne({_id: currentUser}, {$push: {notes: newNote}});
    } catch (error) {
        console.error(error);
        return res.status(404).json({errorMsg: "No data created."})
    }

    return res.status(201).json("Successfully created a new note");
})

app.delete("/delete/:noteId/:userId", async (req, res) => {
    const noteId = req.params.noteId;
    const userId = req.params.userId;

    try {
        await User.updateOne({_id: userId}, {$pull: { notes : { _id: noteId } }});
        // await Note.deleteOne({_id: id});
    } catch (error) {
        console.error(error);
        return res.status(400).json({errorMsg: "Could not delete data. Try again later."})
    }

    return res.status(200).json("Successfully deleted the note.");
}) 

app.put("/update/:noteId/:userId", async (req, res) => {
    const noteId = req.params.noteId;
    const userId = req.params.userId;

    try {
        await User.findOneAndUpdate(
            { _id: userId, 'notes._id': noteId }, 
            { 
                $set: { 
                    'notes.$.title': req.body.title,
                    'notes.$.contents': req.body.contents,
                    'notes.$.currentUser': req.body.currentUser,
                } 
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(400).json({errorMsg: "Could not update data. Try again later."});
    }

    return res.status(200).json("Successfully updated the note.");
})

/* ***************** A U T H E N T I C A T I O N ***************** */
app.post('/register', async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    User.register({username: email}, password, function(err, user) {
        if (err) {
            console.error(err);
            res.status(404).json({errorMsg: "Registration failed. Try again."});
            return;
        }

        // if we are here - the user created sucessfully, now we will authenticate him
        passport.authenticate("local")(req, res, function() {
            // res.redirect('/');
            res.json({isAuthenticated: true, user: req.user});
        });

    })
});

app.post('/login', async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    const user = new User({
        username: email, password: password
    });

    // passport package does the login, but it does in on req param
    req.login(user, function(err) {
        if (err) {
            // the user was not found in the DB
            console.error(err);
            res.status(404).json({isAuthenticated: false});
            return;
        } 
        
        // if we are here - the user was found sucessfully, now we will authenticate him
        passport.authenticate("local")(req, res, function() {
            res.json({isAuthenticated: true, user: req.user});
        });
    })
});

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