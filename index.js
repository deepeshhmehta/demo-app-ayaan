const express = require('express')
var bodyParser = require('body-parser');
const app = express()
var cors = require('cors')

const users = require('./database/users');
// const connection = require('./database/dbCon');

app.use(bodyParser.urlencoded({extended: false}));
app.use(cors())

app.get('/', function (req, res) {
    console.log(users);
    res.send('Hello World')
});

app.post('/login', bodyParser.json(), function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    console.log({email, password});
    
    // call database with email, check if password is same as email's password if true
    const currentUser = checkIfExists(email);
    
    if (!!currentUser) {
        if (currentUser.password == password) {
            res.send({status: true, userID: currentUser.userID});
        } else {
            res.status(401);
            res.send({status: 'wrong password'});
        }
    } else {
        res.status(401);
        res.send({status: false});
    }

});

function checkIfExists(email) {
    // 'SELECT * from USERS where email ===' + email ;
    return users.find(user => user.email === email);
}

app.post('/signup', bodyParser.json(), function(req, res) {
    const check = checkIfExists(req.body.email);
    if (!!check) {
        res.status(401);
        res.send({status: 'user already exists, please log in'});
        return;
    }

    if (!req.body.email || !req.body.password) {
        res.status(401);
        res.send({status: 'email and password are mandatory'});
        return;
    }

    
    // handled by database;
    const biggestId = users[users.length - 1].userID;
    const user = {
        email: req.body.email,
        password: req.body.password,
        userID: biggestId + 1,
        name: req.body.name,
    }
    users.push(user);


    res.status(201);
    res.send({status: true, userID: user.userID});
})

app.get('*', function(req, res) {
    res.status(404);
    res.send('NOT FOUND');
})

app.listen(3000)