const router = require('express').Router();
const userController = require("./controllers/user");
const shopController = require("./controllers/shop");

/* User Routes */
const userRouter = router;
userRouter.post("/register",userController.registerUser);
userRouter.get("/getuser",userController.getallUser);
userRouter.get("/getuser/:id",userController.getUserbyID);
userRouter.put("/updateUser/:id",userController.updateUser);
userRouter.delete("/deleteUser/:id",userController.deleteUser);
// router.post("/send-otp",userController.sendOTP);
// router.post("/verify-otp",userController.verifyOTP);
userRouter.post('/login',userController.userLogin);
userRouter.post('/send-otp',userController.sendOTPSMS);
userRouter.post('/verify-otp',userController.verifyOTP);
router.use('/user', userRouter);
/* End of User Routes */


const shopRouter = router;
router.get('/', shopController.getAllShops);
// Get shop by ID
router.get('/:id', shopController.getShopById);
// Create a new shop
router.post('/', shopController.createShop);
router.use('/shop', shopRouter);


module.exports=router;