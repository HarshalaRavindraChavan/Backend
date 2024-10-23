const router = require('express').Router();
const userController = require("./controllers/user");
// const userController = require("./controllers/user");
const shopController =require("./controllers/ShopController")

/* User Routes */
const userRouter = router;
userRouter.post("/register",userController.registerUser);
userRouter.get("/getusers",userController.getUsers);
userRouter.get("/getuser/:id",userController.getUserbyID);
userRouter.put("/updateUser/:id",userController.updateUser);
userRouter.delete("/deleteUser/:id",userController.deleteUser);
// router.post("/send-otp",userController.sendOTP);
// router.post("/verify-otp",userController.verifyOTP);
userRouter.post('/login',userController.userLogin);
userRouter.post('/send-otp',userController.generateLoginOTP);
userRouter.post('/verify-otp',userController.verifyLoginOTP);
router.use('/user', userRouter);
/* End of User Routes */


 /* SHOP-ROUTES */

router.post('/shops', shopController.createShop);
router.get('/shops', shopController.getAllShops);    
router.get('/shops/:id', shopController.getShopById);  
router.put('/shops/:id', shopController.updateShop);   
router.delete('/shops/:id', shopController.deleteShop);  


module.exports=router;