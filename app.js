const express = require('express');
const app = express();
const cors = require('cors');
// const sequelize = require('./db/config');

var corOptions={
    origin:'http://localhost:8081'
}

// app.use(cors(corOptions));

app.use(cors());

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Testing API....");
});

const userRouter = require("./user/route");
app.use("/userAPI",userRouter);


// Shop and Product routes
const shopRoutes = require('./routes/shop.routes');
const productRoutes = require('./routes/product.routes');

app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);


const PORT =process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

