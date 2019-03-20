const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

//Conexión a la base de datos
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/u3", {useNewUrlParser:true});

//Construyendo el esquema
const productSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const Product = mongoose.model("Product", productSchema, "products");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name :{
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required:true
        }
    }
});

const User = mongoose.model("User", userSchema, "users");


//Definir endpoints
const productRouter = express.Router();

productRouter.post("/", (req, res) => {
    const product = req.body;
    Product.create(product)
    .then(data => {
        console.log(data);
        res.status(200);
        res.json({
            code:200, 
            msg: "Saved!!",
            detail:data
        });
    })
    .catch(error => {
        console.log(error);
        res.status(400);
        res.json({
            code: 400,
            msg: "No se pudo insertar",
            detail: error
        });
    });
});

productRouter.get("/", (get,res) => {
    Product.find({})
    .then(products => {
        console.log(products);
        res.status(200);
        res.json({
            code: 200,
            msg: "Consulta existosa",
            detail: products
        });
    })
    .catch(error => {
        console.log(error);
        res.status(400);
        res.json({
            code: 400,
            msg: "Error!!!",
            detail: error
        });
    });
});

productRouter.get("/:id", (req,res)=>{
    const id = req.params.id;
    Product.findOne({_id:id})
    .then(data => {
        console.log(data);
        res.status(200);
        res.json({
            code: 200,
            msg: "Finded!!",
            detail: data
        });
    })
    .catch(error => {
        console.log(error);
        res.status(400);
        res.json({
            code: 400,
            msg: "No se pudo encontrar",
            detail: error
        })
    });
});

productRouter.put("/:code", (req, res) => {
    const product = req.body;
    Product.findOneAndUpdate({code:req.params.code}, product)
    .then(data => {
        console.log(data);
        res.status(200);
        res.json({
            code: 200,
            msg: "Updated!!",
            detail: data
        });
    }).catch(error => {
        console.log(error);
        res.status(400);
        res.json({
            code: 400,
            msg: "No se pudo actualizar",
            detail: error
        })
    });
});

productRouter.delete("/:id", (req, res) => {
    const {id} = req.params; //igual a id = req.params.id;
    Product.remove({_id:id})
    .then(data => {
        console.log(data);
        res.status(200);
        res.json({
            code: 200,
            msg: "Deleted!!",
            detail: data
        });
    }).catch(error => {
        console.log(error);
        res.status(400);
        res.json({
            code: 400,
            msg: "No se pudo eliminar",
            detail: error
        })
    });
});

const userRouter = express.Router();

userRouter.post("/", (req,res) => {
    const user = req.body;
    var salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
    User.create(user)
    .then(data=>{
        console.log(data);
        res.status(200);
        res.json({
            code:200, 
            msg: "Saved!!",
            detail:data
        });
    })
    .catch(error=>{
        console.log(error);
        res.status(400);
        res.json({
            code:400, 
            msg: "Error!!",
            detail:error
        });
    });
});

userRouter.get("/", (req,res) => {
    User.find({})
    .then(data=>{
        console.log(data);
        res.status(200);
        res.json({
            code: 200,
            msg: "Consulta existosa",
            detail: data
        });
    })
    .catch(error=>{
        console.log(error);
        res.status(400);
        res.json({
            code: 400,
            msg: "Error",
            detail: error
        });
    });
});

userRouter.get("/:id", (req,res) => {
    const id = req.params.id;
    User.find({_id:id})
    .then(data=>{
        console.log(data);
        res.status(200);
        res.json({
            code: 200,
            msg: "Consulta existosa",
            detail: data
        });
    })
    .catch(error=>{
        console.log(error);
        res.status(400);
        res.json({
            code: 400,
            msg: "Error",
            detail: error
        });
    });
});

userRouter.put("/:id", (req, res) => {
    const id = req.params.id;
    const user = req.body;
    User.findByIdAndUpdate(id, user)
    .then(data => {
        console.log(data);
        res.status(200);
        res.json({
            code: 200,
            msg: "Actualización existosa",
            detail: data
        });
    })
    .catch(error => {
        console.log(error);
        res.status(400);
        res.json({
            code: 400,
            msg: "Error",
            detail: error
        });
    });
});

userRouter.delete("/:id", (req, res) => {
    const {id} = req.params; //igual a id = req.params.id;
    User.findByIdAndRemove(id)
    .then(data => {
        console.log(data);
        res.status(200);
        res.json({
            code: 200,
            msg: "Deleted!!",
            detail: data
        });
    }).catch(error => {
        console.log(error);
        res.status(400);
        res.json({
            code: 400,
            msg: "No se pudo eliminar",
            detail: error
        })
    });
});

userRouter.get("/log/in", (req, res) => {
    let iguales = false;
    const user = req.body;
    User.findOne({email: user.email})
    .then(data => {
        if(bcrypt.compareSync(user.password, data.password)) {
            iguales = true;
        } 
        console.log(data);
        res.status(200);
        if (data == null || !iguales){
            res.json({
                code: 200,
                msg: "email o password incorrectos",
            });
        } else {
            res.json({
                code: 200,
                msg: "Incio exitoso!!",
                detail: data
            });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(400);
        res.json({
            code: 400,
            msg: "No se pudo encontrar",
            detail: error
        });
    })
});

//Configurando servidor express
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use("/products", productRouter);
app.use("/users", userRouter);

//Configurando el servidor HTTP

const server = require('http').Server(app);
const port = 3002;

//Ejecutando el servidor

server.listen(port);
console.log('Running on port ' + port)