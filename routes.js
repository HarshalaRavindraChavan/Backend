const router = require('express').Router();
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadOptions = req.originalUrl.split('/');
    if(uploadOptions[2]) {
      cb(null, 'uploads/' + uploadOptions[2])
    } else {
      cb(null, 'uploads')
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + "-" + file.originalname)
  }
})
const upload = multer({ storage })
const { isAuthenticated, isAuthorized } = require('./middlewares/auth');
const userController = require("./controllers/user");
const shopController =require("./controllers/shop");
const productController = require("./controllers/product");
const shopInventoryController = require("./controllers/shop_inventory");

/* User Routes */
router.post("/user/register",userController.registerUser);
router.get("/users", isAuthenticated, isAuthorized(['IT','Admin']), userController.getUsers);
router.get("/user/:id",userController.getUserbyID);
router.put("/user/update/:id",userController.updateUser);
router.delete("/user/delete/:id",userController.deleteUser);
router.post('/user/login',userController.userLogin);
router.post('/user/send-otp',userController.generateLoginOTP);
router.post('/user/verify-otp',userController.verifyLoginOTP);
router.get('/user/logout/current-user', isAuthenticated, userController.userLogout);
// get users by role -- only accessible to admin
router.get("/users/:role", isAuthenticated, isAuthorized(['IT','Admin']), userController.getUsersByRole);
/* End of User Routes */


 /* SHOP-ROUTES */
router.post('/shop/create', isAuthenticated, isAuthorized(['Admin','IT']), upload.single('file'), shopController.createShop);
router.get('/shops', shopController.getAllShops);    
router.get('/shop/:id', shopController.getShopById);  
router.put('/shop/update/:id', upload.single('file'), shopController.updateShop);   
router.delete('/shop/delete/:id', shopController.deleteShop);   
// router.post('/shop/:id/product/create', shopController.createProductForShop);
/* End of Shop Routes */


/* PRODUCT-ROUTES */
router.post('/product/create', upload.single('file'), productController.createProduct);
router.get('/products', productController.getAllProducts);    
router.get('/product/:id', productController.getProductById);  
router.put('/product/update/:id', upload.single('file'), productController.updateProduct);   
router.delete('/product/delete/:id', productController.deleteProduct);
/* End of Product Routes */

router.get('/shop-inventory/:shopID', shopInventoryController.getShopProducts);

module.exports=router;