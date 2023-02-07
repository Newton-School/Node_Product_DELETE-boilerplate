const fs = require('fs')
const express = require('express');
const app = express();


// Importing products from products.json file
const products = JSON.parse(
    fs.readFileSync(`${__dirname}/data/product.json`)
);

// Router Middlewares
app.use(express.json());

// Write DELETE endpoint for deleting a product here
// Endpoint /api/v1/products/:id


// GET Endpoint for accessing all products
app.get('/api/v1/products', (req,res) => {
    res.status(200).json({
    status:'Success',
    message:'Details of products fetched successfully',
    data:{
        products
    }
});
});

// GET Endpoint for accessing one product
app.get('/api/v1/products/:name/:price',(req,res)=>{
    let {price, name} = req.params;
    price *=1;

    const product = products.find(product => product.price===price && product.name === name );
    if(!product){
        return res.status(404).send({status:"failed", message: "Product not found!"});
    }
 
    res.status(200).send({
        status : 'success',
        message : "Product fetched successfully",
        data: {
            product
        }
    });
});

// POST Endpoint for adding a product
app.post('/api/v1/products', (req,res) => {
    const newId = products[products.length-1].id+1;
    const {name, price, quantity} = req.body;
    const newProduct = { id: newId, name, price, quantity };
    products.push(newProduct);
    fs.writeFile(`${__dirname}/data/product.json`,JSON.stringify(products), err => {
            res.status(201).json({
            status: 'Success',
            message:'Product added successfully',
            data:{
                newProduct
            }
        });

    });
});


// POST Endpoint for adding multiple products
app.post('/api/v1/products', (req,res) => {
    const {products} = req.body;
    //loop
    for(let i=0; i<products.length ; i++){
    const newId = existingProducts[existingProducts.length-1].id+1;
    const {name,price,quantity} = products[i];
    const newProduct = { id: newId, name , price, quantity };
    existingProducts.push(newProduct);
    }
    fs.writeFile(`${__dirname}/data/product.json`,JSON.stringify(existingProducts), err => {
            res.status(201).json({
            status: 'Success',
            message:'Products added successfully',
            
        });

    });
});

//PATCH Endpoint for buying a product
app.patch('/api/v1/products/:id',(req,res)=>{
    const id = req.params.id * 1;
    const product = products.find(product => product.id===id);
    if (!product){
        return res.status(404).send({
            status: "failed",
            message: "Product not found!"
        })
    }

    product.quantity -= 1;

    if(product.quantity>=0){
        return res.status(200).json({
                status : "success",
                message :`Thank you for purchasing ${product.name}`,
                product 
        });
    }

    
    return res.status(404).json({
        status : "success",
        message :`${product.name}, Out of stock!`,
    });

    
});







module.exports = app;
