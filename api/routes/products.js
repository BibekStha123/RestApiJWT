const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './uploads/');
    },
    filename: function(req, file, callback){
        callback(null, file.originalname);
    }
});

const filter= (req, file , callback) =>{
    if(file.mimetype == 'image/png' || file.mimetype =='image/jpeg'){
        callback(null, true);
    }else{
        callback(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: filter
});


router.get('/', function(req, res){
    Product.find({}, 'name price productImage',function(err, data){
        if(err){
           // console.log(err);
           error: err
        }else{
            //console.log(data);
            const result = {
                count: data.length,
                products: data
            }
            res.json({
                result
            });
        }
    });
});

router.post('/', upload.single('productImage'),function(req, res){
    console.log(req.file);
    const product = new Product({
        name: req.body.bookname,
        price: req.body.price,
        productImage: req.file.path 
    });
    product.save(function(err, data){
       if(err){
           res.json({
               error: err
           });
       }else{
           res.json({
               message: 'product added',
               addedProduct: product,
               request:{
                   type: 'GET',
                   url: 'http://localhost:3000/products/'
               }
           });
       }
    });
});

router.get('/:productId', function(req, res){
    const id=req.params.productId;
    Product.find({_id: id},'name price productImage -_id' ,function(err, data){
        if(data){
            /* if(!data){
                return res.json({
                    message: 'product doesnot exists'
                });
            } */
            res.json({
                product: data
            });
        }else{
            res.json({message: 'id '+id+' doesnot exist'});
        }
    });
});

router.patch('/:productId', function(req, res){
    const id = req.params.productId;
    const updates = {};
    for(const ups of req.body){
        updates[ups.property]= ups.value;
    }
    Product.update({_id: id},
         {$set: updates}, function(err, data){
            if(err){
                res.json({message: err});
            }else{
                res.json({
                    message: 'Updated successfully',
                    request:{
                        type: 'GET',
                        URL:'http://localhost:3000/products/'+ id
                    }
                });
            }
         })
});

router.delete('/:productId', function(req, res){
    Product.remove({_id: req.params.productId}, function(err, data){
        if(err){
            res.json({message: 'failed'});
        }else{
            res.json({
                message: 'deleted successfully',
                request:{
                    type:'GET',
                    URL:'http://localhost:3000/products/'
                }
            });
        }
    });
});


module.exports = router;