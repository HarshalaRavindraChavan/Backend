const User = require("../models/user");
const { handleError } = require("../errorHandler");
const bcrypt = require("bcrypt");
const { config } = require("nodemon");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const fast2sms = require("fast-two-sms");
const dotenv = require("dotenv"); // Ensure fast2sms is imported
var moment = require('moment');

dotenv.config();

const otpStorage = {}; 


const registerUser = async (req, res) => {
  const {
    user_Name,
    user_Email,
    user_Password,
    user_phoneno,
    // user_latitude,
    // user_longitude,
    // user_pincode,
    // user_status,
    // user_OTP,
    // OTP_Expiration,
    // is_OTP_Verified,
    // role,
  } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(user_Password, 10);

    // Create a new user
    const newUser = await User.create({
      user_Name,
      user_Email,
      user_Password: hashedPassword,
      user_phoneno,
      // user_latitude,
      // user_longitude,
      // user_pincode,
      // user_status,
      // user_OTP,
      // OTP_Expiration,
      // is_OTP_Verified,
      role: "Customer",
    });

    console.log(newUser);

    return res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ errors: error.errors.map((err) => err.message) });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({where: { isDeleted: false }});
    if (!users) {
      return res
        .status(401)
        .send({ message: "User does not exit", status: "FAILED" });
    }

    return res.send(users);
  } catch (error) {
    handleError(error, res);
  }
};

const getUserbyID = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        user_ID: req.params.id,
        isDeleted: false, 
      },
    });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User does not exit", status: "FAILED" });
    }
    res.send(user);
  } catch (error) {
    handleError(error, res);
  }
};

const updateUser = async (req, res) => {
  const ID = req.params.id;
  const data = req.body;
  try {
    const user = await User.findOne({
      where: {
        user_ID: ID,
        isDeleted: false, 
      },
    });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User does not exit", status: "FAILED" });
    }
    if (data.user_Password) {
      data.user_Password = await bcrypt.hash(data.user_Password, 10);
      await User.update(data, {
        where: { user_id: ID },
      });
    }
    await User.update(data, {
      where: { user_id: ID },
    }),
      res
        .status(200)
        .json({ updateUser, message: "Details has been updated successfully" });
  } catch (error) {
    handleError(error, res);
  }
};

const deleteUser = async (req, res) => {
  const ID = req.params.id;
  try {
    const user = await User.findOne({
      where: {
        user_ID: ID,
        isDeleted: false, 
      },
    });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User does not exit", status: "FAILED" });
    }
    const deletedUser = await User.destroy({ where: { user_id: ID } });
    res.status(200).json({ deleteUser, message: "User has been deleted." });
  } catch (error) {
    handleError(error, res);
  }
};

const userLogin = async (req, res) => {
  const { user_Email, user_Password } = req.body;

  try {
    // Check if email and password are provided
    if (!user_Email || !user_Password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if the user exists in the database
    const user = await User.findOne({
      where: { user_Email, isDeleted: false },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(user_Password, user.user_Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

     // Hardcode the JWT_SECRET here
     const JWT_SECRET = "your_jwt_secret_key"; // Replace with your actual secret key

     // Generate JWT token with user ID and email
     const token = jwt.sign(
       { user_ID: user.user_ID, user_Email: user.user_Email },
       JWT_SECRET,
       { expiresIn: "1h" } // Set expiration time for the token
     );

    // Respond with success message, JWT token, and user details
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        user_ID: user.user_ID,
        user_Email: user.user_Email,
        user_name: user.user_name, // Assuming user_name is a valid field in your model
        user_pincode: user.user_pincode,
        user_phoneno: user.user_phoneno,
        user_status: user.user_status,
        user_OTP: user.user_OTP,
        OTP_Expiration: user.OTP_Expiration,
        role: user.role,
        is_OTP_Verified: user.is_OTP_Verified,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// POST route to generate OTP and send SMS
const generateLoginOTP = async (req, res) => {
  try {
    const { user_phoneno } = req.body; // Extract phone number from request body
    console.log(req.body);
    // Validate phone number
    if (!user_phoneno) {
      console.error("Phone number is required");
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Generate a random OTP (for example, a 4-digit OTP)
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log(`Generated OTP: ${otp}`);
    // OTP Expiration Logic? Should come here and updated in the query below
    const otp_expiration = moment().add(process.env.OTP_Expiration, "minute");

    // Fast2SMS options for sending OTP
    const options = {
      authorization: process.env.OTP_Authorization, // Authorization key from your .env
      message: `Hi user,\nWelcome to Amir Chicken!\nYour OTP is ${otp}.\nValid for 2 minutes only.`,
      numbers: [user_phoneno], // Phone number must be an array, even for a single number
    };

    // Log the authorization key for debugging (remove in production)
    console.log("Using authorization key:", process.env.OTP_Authorization);

    // Save the OTP in database. Required for verfiying validity
    try {
      const user = await User.findOne({ where: { user_phoneno: user_phoneno, isDeleted: false } });

      if (!user) {
        return res
          .status(400)
          .send({ message: "User does not exit", status: "FAILED", code: "NO_USER" });
      }
      if (user) {
        await User.update(
                    {
                      user_OTP: otp,
                      OTP_Expiration: otp_expiration
                    }, 
                    {
                      where: { user_ID: user.user_ID },
                    }
                  );
      }
    } catch (error) {
      console.error("Error sending OTP:", error); // Log detailed error
    }

    // Send OTP using Fast2SMS
    const response = await fast2sms.sendMessage(options);
    console.log("Message sent successfully", response);

    // Respond with success
    res.status(200).json({
      message: "OTP sent successfully!",
      otp_status: true,
      // otp: otp, // Remove in production for security
      response: response,
    });
  } catch (error) {
    console.error("Error sending OTP:", error); // Log detailed error
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

// Function to verify OTP
const verifyLoginOTP = async (req, res) => {
  try {
    const { user_phoneno, otp } = req.body;

    // Validate phone number and OTP input
    if (!user_phoneno || !otp) {
      return res.status(400).json({ message: "Phone number and OTP are required" });
    }

    // Get stored OTP from database
    try {
      const user = await User.findOne({ where: { user_phoneno: user_phoneno, isDeleted: false } });

      if (!user) {
        return res
          .status(401)
          .send({ message: "User does not exit", status: "FAILED" });
      }
      if (user) {
        console.log("Current: ", moment());
        console.log("DB: ", moment(user.OTP_Expiration));
        let duration = moment.duration(moment().diff(user.OTP_Expiration));
        console.log("Diff: ", duration.as("minutes"));
        // Check OTP is valid and not expired
        if(parseInt(otp) !== user.user_OTP) {
          return res
          .status(401)
          .send({ message: "Invalid OTP", status: "FAILED" });
        } else if(moment().isAfter(user.OTP_Expiration)) {
          return res
          .status(401)
          .send({ message: "OTP has expired. Request for a new OTP", status: "FAILED" });
        } else {
          
          // Generate JWT token with user ID and email
          const token = jwt.sign(
            { user_ID: user.user_ID, user_Email: user.user_Email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // Set expiration time for the token
          );

          await User.update(
            {
              is_OTP_Verified: 1
            }, 
            {
              where: { user_ID: user.user_ID },
            }
          );

          // Success message and additional logic can go here
          return res.status(200).json({ 
            message: "OTP verified successfully!",
            token
          });
        }        
      }
    } catch (error) {
      console.error("Error validating OTP:", error); // Log detailed error
    }
  } catch (error) {
    // Catch any unexpected errors and respond appropriately
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Failed to verify OTP", error: error.message });
  }
};

const getUsersByRole = async (req, res) => {
  const role = req.params.role;
  try {
    const user = await User.findAll({
      attributes: ['user_ID','user_Name','user_Email','user_phoneno','user_pincode'],
      where: { role: role, isDeleted: false }
    });
    if (!user) {
      return res
        .status(401)
        .send({ message: "User does not exit", status: "FAILED" });
    }
    res.send(user);
  } catch (error) {
    handleError(error, res);
  }
};

module.exports = {
  registerUser,
  getUsers,
  getUserbyID,
  updateUser,
  deleteUser,
  userLogin,
  generateLoginOTP,
  verifyLoginOTP,
  getUsersByRole
};
