const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Used for crpyting data using hashfunc, salt and paper
const jwt = require('jsonwebtoken'); // Used to generate signature to confirm user 
const router = express.Router();
const { body, validationResult } = require('express-validator'); // Used for validation purpose
const { json } = require('express');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = "HumHainDON-No1"

//ROUT 1: Create a User using: POST:"/api/auth/createUser". It dosen't require authentication,or No login required
router.post('/createUser', [
    body('email', "Enter a valid Email!!!").isEmail(),
    // password must be at least 5 chars long
    body('name', "Enter a valid Name!!!").isLength({ min: 5 }),
    body('password', 'Password must be 5 char').isLength({ min: 5 }),
], async (req, res) => {
    //Error detection
    const errors = validationResult(req);
    let success = false
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        //Check whether the user with the same email exists already
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "User with this email already exists!!!" })
        }
        // Generate secured password
        const salt = await bcrypt.genSalt(10) // Generate salt of len 10
        const secPass = await bcrypt.hash(req.body.password, salt) // Generate hash function and adding salt  

        // Create User
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        success = true
        // Genrate sign
        const authToken = jwt.sign(data, JWT_SECRET); // Return JsaonWebToken for verifying sign
        res.json({ success:success,authToken: authToken })
    }
    //Catch error if any error occured inside syntax
    catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured in structure!!!")
    }
})

// Login Authentication
//ROUT 2: Authenticate a user using:: POST:'/api/auth/login - No login required'
router.post('/login', [
    body('email', "Enter a valid Email!!!").isEmail(),
    body('password', 'Password cannot be empty').exists(),

], async (req, res) => {
    //Error detection
    const errors = validationResult(req);
    let success = false
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Fetching user details from database
    const { email, password } = req.body;
    try {
        //Store details in user if exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Wrong Credentials!!!' })
        }
        // Compare bcrypted jwt with user jwt
        const passwordCompare = await bcrypt.compare(password, user.password)
        // If password does not match
        if (!passwordCompare) {
            false
            return res.status(400).json({ success,error: 'Wrong Credentials!!!' })
        }
        //If all the credentials are correct
        const data = {
            user: {
                id: user.id,
            }
        }

        // Genrate sign
        success = true
        const authToken = jwt.sign(data, JWT_SECRET); // Return JsaonWebToken for verifying sign
        res.json({success, authToken })
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error!!!")
    }
})
//ROUT 3: GET loggedin user details:: POST:'/api/auth/getuser - Login required'
router.post('/getuser',fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password") //Fetch details except password
        res.send(user)

    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error!!!")
    }
})
module.exports = router;