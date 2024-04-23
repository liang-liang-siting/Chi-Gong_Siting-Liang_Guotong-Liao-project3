const express = require('express');
const cors = require('cors');
const usersRouter = require('./backend/user.api.cjs')
const passwordsRouter = require('./backend/password.api.cjs')
const messageRouter = require('./backend/message.api.cjs')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const path = require('path');

const app = express();

const mongoDBEndpoint = 'mongodb+srv://gongchineu:3dk8eU1vYmltvgjz@cs5610project3.aanyprg.mongodb.net/password_db?retryWrites=true&w=majority&appName=cs5610project3'
mongoose.connect(mongoDBEndpoint, {
    useNewUrlParser: true,
})

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once('open', function() {
    console.log("Connected to MongoDB")
})

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/users', usersRouter);
app.use('/api/passwords', passwordsRouter);
app.use('/api/message', messageRouter);

let frontend_dir = path.join(__dirname, '.', 'dist');
app.use(express.static(frontend_dir));
app.get('*', (req, res) => {
    res.sendFile(path.join(frontend_dir, 'index.html'));
});

app.listen(process.env.PORT || 8001, function() {
    console.log("Starting app now...")
})
