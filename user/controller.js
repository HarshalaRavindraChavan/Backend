const User = require("./model");
const { handleError } = require("../errorHandler");
const bcrypt = require("bcrypt");
const { config } = require("nodemon");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const JWT_SECRET = config.JWT_SECRET || "your_jwt_secret_key";
const fast2sms = require("fast-two-sms");
const dotenv = require("dotenv"); // Ensure fast2sms is imported

dotenv.config();

const otpStorage = {}; 


const registerUser = async (req, res) => {
  const {
    user_Name,
    user_Email,
    user_Password,
    user_phoneno,
    user_latitude,
    user_longitude,
    user_pincode,
    user_status,
    user_OTP,
    OTP_Expiration,
    is_OTP_Verified,
    role,
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
      user_latitude,
      user_longitude,
      user_pincode,
      user_status,
      user_OTP,
      OTP_Expiration,
      is_OTP_Verified,
      role,
    });

    return res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ errors: error.errors.map((err) => err.message) });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getallUser = async (req, res) => {
  try {
    const user = await User.findAll({});
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

const getUserbyID = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
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

const updateUser = async (req, res) => {
  const ID = req.params.id;
  const data = req.body;
  try {
    const user = await User.findByPk(ID);
    if (!user) {
      return res
        .status(401)
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
    const user = await User.findByPk(ID);
    if (!user) {
      res.send("User not Found");
    }
    const deletedUser = await User.destroy({ where: { user_id: ID } });
    res.status(200).json({ deleteUser, message: "User has been deleted." });
  } catch (error) {
    handleError(error, res);
  }
};

// const sendOTP = async (req, res) => {
//   const { user_Email } = req.body;
//   try {
//     const user = await User.findOne({ where: { user_Email } });
//     if (!user) {
//       return res
//         .status(401)
//         .send({ message: "User does not exit", status: "FAILED" });
//     }

//     // Generate OTP and set expiration time
//     const otp = crypto.randomInt(100000, 999999).toString();
//     const otpExpiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

//     user.user_OTP = otp;
//     user.OTP_Expiration = otpExpiration;
//     await user.save();

//     const transporter = nodemailer.createTransport({
//       host: "smtp.ethereal.email",
//       port: 587,
//       secure: false, // true for port 465, false for other ports
//       auth: {
//         user: "maddison53@ethereal.email",
//         pass: "jn7jnAPss4f63QBp6D",
//       },
//     });

//     const message = {
//       from: '"Amar Chiken " <amarchiken@ethereal.email>', // sender address
//       to: "bar@example.com, baz@example.com", // list of receivers
//       subject: "OTP to reset the password", // Subject line
//       text: `OTP to reset the password is  ${otp}`, // plain text body
//     };

//     transporter.sendMail(message).then((info) => {
//       return res.status(201).json({
//         message: "You should recieve a mail to reset the password",
//         info: info.messageId,
//         preview: nodemailer.getTestMessageUrl(info),
//       });
//     });
//   } catch (error) {
//     handleError(error, res);
//   }
// };

// Verify OTP
// const verifyOTP = async (req, res) => {
//   const { user_Email, user_OTP } = req.body;
//   try {
//     const user = await User.findOne({ where: { user_Email } });
//     console.log(user);
//     if (!user) {
//       return res
//         .status(400)
//         .send({ message: "User not found", status: "FAILED" });
//     }

//     if (user.user_OTP !== user_OTP) {
//       return res.status(400).send({ message: "OTP expired", status: "FAILED" });
//     }

//     if (user.OTP_Expiration < new Date()) {
//       return res
//         .status(400)
//         .send({ message: "OTP has expired", status: "FAILED" });
//     }

//     res.send({ message: "OTP verified successfully", status: "SUCCESS" });
//   } catch (error) {
//     res.json({ message: "Error verifiying the OTP" });
//     handleError(error, res);
//   }
// };

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
const sendOTPSMS = async (req, res) => {
  try {
    const { number } = req.body; // Extract phone number from request body

    // Validate phone number
    if (!number) {
      console.error("Phone number is required");
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Generate a random OTP (for example, a 4-digit OTP)
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log(`Generated OTP: ${otp}`);

    // Fast2SMS options for sending OTP
    const options = {
      authorization: process.env.OTP_Authorization, // Authorization key from your .env
      message: `Hi user,\nWelcome to Amir Chicken!\nYour OTP is ${otp}.\nValid for 2 minutes only.`,
      numbers: [number], // Phone number must be an array, even for a single number
    };

    // Log the authorization key for debugging (remove in production)
    console.log("Using authorization key:", process.env.OTP_Authorization);

    // Send OTP using Fast2SMS
    const response = await fast2sms.sendMessage(options);
    console.log("Message sent successfully", response);

    // Respond with success
    res.status(200).json({
      message: "OTP sent successfully!",
      otp: otp, // Remove in production for security
      response: response,
    });
  } catch (error) {
    console.error("Error sending OTP:", error); // Log detailed error
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};


// Function to verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { number, otp } = req.body;

    // Validate phone number and OTP input
    if (!number || !otp) {
      return res.status(400).json({ message: "Phone number and OTP are required" });
    }

    // Retrieve the stored OTP for the given number
    const storedOTP = otpStorage[number];
    
    if (!storedOTP) {
      // If OTP not found, it might have expired or wasn't sent
      return res.status(400).json({ message: "OTP not found. Please request a new one." });
    }

    // Check if the OTP has expired
    if (Date.now() > storedOTP.expiresAt) {
      delete otpStorage[number]; // Clean up expired OTP
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Check if the OTP matches
    if (parseInt(otp) === storedOTP.otp) {
      // OTP is valid, delete the OTP from storage
      delete otpStorage[number];

      // Success message and additional logic can go here
      return res.status(200).json({ message: "OTP verified successfully!" });
    } else {
      // OTP mismatch
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

  } catch (error) {
    // Catch any unexpected errors and respond appropriately
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Failed to verify OTP", error: error.message });
  }
};


module.exports = {
  registerUser,
  getallUser,
  getUserbyID,
  updateUser,
  deleteUser,
  // sendOTP,
  // verifyOTP,
  userLogin,
  sendOTPSMS,
  verifyOTP
};
