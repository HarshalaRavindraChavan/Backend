const { DataTypes } = require('sequelize');
const db = require('../db/index'); // Ensure this is the correct path to your sequelize instance

const User = db.sequelize.define('User', {
    user_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_Name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_Email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_Password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_phoneno: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // user_latitude: {
    //     type: DataTypes.DECIMAL(9, 6),
    //     allowNull: true,
    // },
    // user_longitude: {
    //     type: DataTypes.DECIMAL(9, 6),
    //     allowNull: true,
    // },
    // user_location: {
    //     type: DataTypes.STRING,
    //     allowNull: true
    // },
    user_pincode: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    user_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    user_OTP: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // validate: {
        //     len: [6, 6], // Ensure OTP is 6 digits
        // },
    },
    OTP_Expiration: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    is_OTP_Verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false, // Default OTP verification is false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    access_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    timestamps: true,
    defaultScope: {
        where: {
            isDeleted: false,
        },
    },
});

module.exports = User;
