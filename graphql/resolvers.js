const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = {
  createUser: async function({ userInput }, req) {
      let errors = [];
      if(!validator.isEmail(userInput.email))
        {
        errors.push({message : "email is not valid"});
        }

        if(errors.length > 0)
            {
                const error= new Error("invalid input please try again!!!!!!");
                error.data = errors;
                error.code = 422;
                throw error;

            }
    //   const email = args.userInput.email;
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error('User exists already!');
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw
    });
    const createdUser = await user.save();
    console.log(createdUser._doc);
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },

  login : async ({email,password})=>{
      const user = await User.findOne({email:email});
      if(!user)
        {
            const error = new Error('user not exit');
            error.code = 401;
            throw error;
        }

        const isEqual = bcrypt.compare(password,user.password);
        if(!isEqual){
           const error = new Error('password does not match');
            error.code = 401;
            throw error; 
        }

        const token = jwt.sign({
            userId : user._id,
            email : user.email
        },"itssupersercreetashwini",{expiresIn:"1hr"});

        return {
            token :token,
            userId : user._id
        }


  }
};
