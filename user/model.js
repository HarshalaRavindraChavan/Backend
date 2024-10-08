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
        allowNull: true, // Make user_name mandator
    },
    user_Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: "Email address already in use",
        },
        validate: {
            notEmpty: {
                msg: "Email cannot be empty",
            },
            isEmail: {
                msg: "Email format is invalid",
            },
        },
    },
    user_Password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Password cannot be empty",
            },
            len: {
                args: [6, 100],
                msg: "Password must be between 6 and 100 characters",
            },
        },
    },
    user_phoneno: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: "Phone number must be unique",
        },
        validate: {
            notEmpty: {
                msg: "Phone number cannot be empty",
            },
            isNumeric: {
                msg: "Phone number must be numeric",
            },
            len: {
                args: [10, 15],
                msg: "Phone number must be between 10 to 15 digits",
            },
        },
    },
    user_latitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
    },
    user_longitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
    },
    user_pincode: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    user_OTP: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    OTP_Expiration: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isDate: {
                msg: "Invalid date format for OTP expiration",
            },
        },
    },
    is_OTP_Verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [['Admin', 'Sub-Admin', 'Shop-Owner', 'Delivery-Boy', 'Customer']],
                msg: "Role must be one of Admin, Sub-Admin, Shop-Owner, Delivery-Boy, or Customer",
            },
        },
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
