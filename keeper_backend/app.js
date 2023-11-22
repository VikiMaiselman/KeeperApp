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
app.use("*", function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "https://foothillfitness.com");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
// enable pre-flight
app.options("*", cors());

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// 1. Configure a session, initialize passport
app.use(session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
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


/* ***************** M A I N   F U N C T I O N A L I T Y ***************** */
app.get("/", async (req, res) => {
    let user; 

    if(!req.user) return res.status(200).json({isAuthenticated: false, notes:[]});

    try {
        user = await User.find({_id: req.user._id});
        return res.status(200).json({notes: user[0].notes, isAuthenticated: true});
    } catch (error) {
        console.error(error);
        return res.status(400).json({errorMsg: "Could not fetch data. Try again later."});
    }
});

app.post("/", async (req, res) => {
    const {title, contents} = req.body;

    const newNote = new Note({
        title: title,
        contents: contents,
    });

    try {
        await User.updateOne({_id: req.user?._id}, {$push: { notes : newNote }});
        return res.status(201).json("Successfully created a new note");
    } catch (error) {
        console.error(error);
        return res.status(404).json({errorMsg: "No data created."});
    }
});

app.delete("/delete/:noteId", async (req, res) => {
    const noteId = req.params.noteId;

    try {
        await User.updateOne({_id: req.user?._id}, {$pull: { notes : { _id: noteId } }});
        return res.status(200).json("Successfully deleted the note.");
    } catch (error) {
        console.error(error);
        return res.status(400).json({errorMsg: "Could not delete data. Try again later."});
    }
});

app.put("/update/:noteId", async (req, res) => {
    const noteId = req.params.noteId;

    try {
        await User.findOneAndUpdate(
            { _id: req.user?._id, 'notes._id': noteId }, 
            { 
                $set: { 
                    'notes.$.title': req.body.title,
                    'notes.$.contents': req.body.contents,
                    'notes.$.currentUser': req.user?._id,
                } 
            }
        );
        return res.status(200).json("Successfully updated the note.");
    } catch (error) {
        console.error(error);
        return res.status(400).json({errorMsg: "Could not update data. Try again later."});
    }
});

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

        passport.authenticate("local")(req, res, function() {
            res.redirect('/');
        });
    })
});

app.post('/login/',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    res.redirect('/');
});

app.get('/isAuthenticated', async (req, res) => {
    return res.json(req.isAuthenticated());
});

app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { 
            return next(err); 
        }
        res.redirect('/');
      });
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