const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt'); 
var jwt = require('jsonwebtoken'); 
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = 'Kishanisagoodb$oy';//creating jwt secret

// Route 1 : Creating User using: POST "api/auth/createuser". No login required 
router.post('/createuser',[
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({min:3}),
] , async (req, res)=>{
    //sending response json obj
    // res.json(obj)
    let success = false;
    //if there an error : return Bad request and the errors 
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
           success:success, errors:errors.array()
        });
    }
    // console.log(req.body)
    // const user = User(req.body);
    // user.save()
    // res.send(req.body)

    //check weather the user with this email exits already
    try{
    let user = await User.findOne({email: req.body.email});
    if(user){//check this
        return res.status(400).json({success:success, error: "Sorry a user with this email id is already exists"})
    }

    //using bycrpt to generate salt for passward hashing
    const salt = await bcrypt.genSalt(10);
    //create a hash by sending secure password
    const securePass = await bcrypt.hash(req.body.password,salt);

    //Create a new User
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass,
    })
    // .then(user =>res.json(user))
    // .catch(err=> {console.log('err')
    // res.json({error:'Please enter a unique email id', message:err.message})})

    // send a token having a user-id instead of a User as a response.
    const data = {
        user:{
            id: user.id
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET)
    // res.json(user)
    success = true;
    res.json({success,authtoken})

    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server error");
    }
    
})

//Route 2 : Login User using: POST "api/auth/login". No login required 
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
], async (req, res)=>{
     //if there an error : return Bad request and the errors 
     let success = false;
     const errors = validationResult(req);
     if(!errors.isEmpty()){
         return res.status(400).json({
             errors:errors.array()
         });
     }

     //destructering of email  and password
     const {email, password} = req.body;
     try {
        //find user in our database
        let user = await User.findOne({email});
        if(!user){
           return res.status(400).json({success:success,error:"Please try to login with valid email Id"})
        }

        // compare password in our db enter by the user 
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){

            return res.status(400).json({success:success, error:"Please try to login with valid email Id"})
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true;
        res.json({success, authtoken})
     } catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server error");
     }
})

//Route 3 : Get Logged in User detaila Using : POST "api/auth/getuser".  login required 
router.post('/getuser', fetchuser,  async (req, res) => {

    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })



module.exports = router