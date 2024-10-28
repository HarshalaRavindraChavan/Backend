const router = require('express').Router();
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + "-" + file.originalname)
  }
})
const upload = multer({ storage })
const userController = require("./controllers/user");
const shopController =require("./controllers/shop");
const productController = require("./controllers/product");

/* User Routes */
router.post("/user/register",userController.registerUser);
router.get("/users",userController.getUsers);
router.get("/user/:id",userController.getUserbyID);
router.put("/user/update/:id",userController.updateUser);
router.delete("/user/delete/:id",userController.deleteUser);
router.post('/user/login',userController.userLogin);
router.post('/user/send-otp',userController.generateLoginOTP);
router.post('/user/verify-otp',userController.verifyLoginOTP);
/* End of User Routes */


 /* SHOP-ROUTES */
const shopRouter = router;
router.post('/shop/create', upload.single('file'), shopController.createShop);
router.get('/shops', shopController.getAllShops);    
router.get('/shop/:id', shopController.getShopById);  
router.put('/shop/update/:id', upload.single('file'), shopController.updateShop);   
router.delete('/shop/delete/:id', shopController.deleteShop);   
/* End of Shop Routes */


 /* PRODUCT-ROUTES */
//  const productRouter = router;
//  router.post('/create', productController.createShop);
//  router.get('/', productController.getAllShops);    
//  router.get('/:id', productController.getShopById);  
//  router.put('/update/:id', productController.updateShop);   
//  router.delete('/delete/:id', productController.deleteShop);  
//  router.use('/product', productRouter);
/* End of Product Routes */

module.exports=router;