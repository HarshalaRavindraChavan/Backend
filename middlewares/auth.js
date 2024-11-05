const User = require("../models/user");
const { handleError } = require("../errorHandler");
const jwt = require("jsonwebtoken");

const isAuthenticated  = function(req, res, next) {

    try {
        const token = req.header("x-auth-token");
        if (!token) return res.status(403).send("Access denied.");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.authUser = decoded;

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

            console.log(authRoles);
            console.log('User Role: ' + userDetails.role);

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