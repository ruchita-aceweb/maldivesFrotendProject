const User=require("../models/model");
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken")

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  
  // ==========Validation ==========
  if(!name){
    return res.status(400).json({ message: 'Provide Name' });
  }
  if(!email){
    return res.status(400).json({ message: 'Provide email' });
  }

  if(!password){
    return res.status(400).json({ message: 'Provide password' });
  }

  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!strongPasswordRegex.test(password)) {
    return res.status(400).json({ message: 'Pls Provide Strong Password' });
  }
  
  
  try {

    // email already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password 
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = new User({ name, email, password: hashedPassword });
    const createdUser=await user.save();

    res.status(201).send({ message: 'Signup successful',createdUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};



//============Login======================= 

const login= async(req,res)=>{
    try{
        const data=req.body;

        const{email,password}=data
        if(!email){
         return res.status(400).json({ message: 'Provide email' });
       }
     
       if(!password){
         return res.status(400).json({ message: 'Provide password' });
       }

       // Find the user by email
       const existUser = await User.findOne({ email });

    if (!existUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, existUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: existUser._id }, 'yourSecretKey', {
      expiresIn: '2d', 
   });
   res.setHeader('Authorization', `${token}`);
   res.status(200).send({message:"Login  successfully", userDetails: {
      _id: existUser._id,
      name: existUser.name,
      email: existUser.email,
      password: existUser.password,
    },});
      
    }
    catch (error) {
        console.log(error); 
        res.status(500).send({message:"Internal server Error",error})
     }
}


module.exports={signup,login}


  