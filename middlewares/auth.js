const User = require("../models/user");
const { handleError } = require("../errorHandler");
const jwt = require("jsonwebtoken");

const isAuthenticated  = async function(req, res, next) {

    try {
        const token = req.header("x-auth-token");
        if (!token) return res.status(403).send("Access denied.");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.authUser = decoded;

        // check if the saved token and send token are same
        const userDetails = await User.findOne({ 
            attributes: ['access_token'],
            where: {
            user_ID: req.authUser.user_ID,
            isDeleted: false
            }
        });
        // check if token was deleted due to logout
        if(userDetails.access_token === null || userDetails.access_token !== token) {
            return res.status(400).send("User has logged out");
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(400).send("Invalid token");
    }
}

const isAuthorized = function(authRoles = []) {
    return async function(req, res, next) {
        try {
            const userDetails = await User.findOne({ 
                attributes: ['role'],
                where: {
                user_ID: req.authUser.user_ID,
                isDeleted: false
                }
            });

            // console.log(authRoles);
            // console.log('User Role: ' + userDetails.role);

            if(!authRoles.includes(userDetails.role)) return res.status(403).send("Unauthorized.");
        
            next();
        } catch (error) {
            console.log(error);
            res.status(400).send("Invalid token");
        }
    }
}

module.exports = {
    isAuthenticated,
    isAuthorized
};