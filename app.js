require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
// const md5 = require('md5');
// const encrypt = require('mongoose-encryption');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/userDB', { useUnifiedTopology: true, useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


// const secret = "thisisalittlesecret";
//if you want to add encryption on any other fileds then add those field to array ['passwrod','email'] 
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model('User', userSchema);

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/register', function(req, res) {
    res.render('register');
});


app.post('/register', function(req, res) {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

        const newUser = new User({
            email: req.body.username,
            password: hash
        });

        newUser.save(function(err) {
            if (!err) {
                res.render('secrets');
            } else {
                res.send(err);
            }
        })
    })


});

app.post('/login', function(req, res) {
    User.findOne({ email: req.body.username }, function(err, foundUser) {
        if (foundUser) {
            bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                if (result === true) {
                    res.render('secrets');
                } else {
                    res.send("you entered a wrong password !!! please try again")
                }
            })
        } else {
            res.send("user not found please look at your credentials and try again")
        }
    })
});

app.get('/logout', function(req, res) {
    res.render('home');
});

app.get('/submit', function(req, res) {
    res.render('submit');
});





app.listen(3000, function() {
    console.log("server is started at http://localhost:3000");

})