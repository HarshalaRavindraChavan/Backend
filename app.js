const express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var moment = require('moment'); 
const app = express();
const cors = require('cors');
// const sequelize = require('./db/config');

var corOptions={
    origin:'http://localhost:8081'
}

// app.use(cors(corOptions));
// dotenv.config();

app.use(cors());
// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Testing API....");
});

const routes = require("./routes");
app.use('/api', routes);

const userRouter = require("./user/route");
app.use("/userAPI",userRouter);


// Shop and Product routes
const shopRoutes = require('./routes/shop.routes');
const productRoutes = require('./routes/product.routes');

app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);


const PORT =process.env.PORT || 5001

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

