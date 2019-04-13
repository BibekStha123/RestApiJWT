const express = require('express');
const router = express.Router();
const Order = require('../models/order')

router.get('/', function(req, res){
    Order.find({})
         .select('_id product quantities')
         .populate('product', 'name price -_id')//populating product.First argument takes reference schema                                        
         .exec()                                //and second takes property we want to display from product           
         .then(result=>{
             const response={
                 count: result.length,
                 orders: result
             }
             res.json({
                 message: response
             });
         })
         .catch(err=>{
             error: err
         })
                
});

router.post('/', function(req, res){
    const order= new Order({
        product: req.body.productId,
        quantities: req.body.quantity
    });
    order.save()
          .then(result=>{
              res.json({
                  message: result,
                  request:{//get request for all orders
                      type:'GET',
                      url:'http://localhost:3000/orders/'
                  }
              });
          })
          .catch(function(err){
              res.json({
                  error: err
              });
          });
});

//if findById is used, no need for {_id:req.params.orderId}
router.get('/:orderId', function(req, res){
    Order.findById(req.params.orderId,'product quantities -_id')
         .exec()
         .then(result=>{
             //if order is deleted
             if(!result){
                 return res.json({
                    message: 'order not found'
                 });
             }
             //else order exists
             res.json({
                 message: result,
                 request:{
                    type:'GET',
                    url:'http://localhost:3000/orders/'
                }
             });
         })
         .catch(err=>{
             res.json({
                error: err
             });
         });
});

router.patch('/:orderId', function(req, res){
    res.status(200).json({
        message: 'product patch'
    })
});

router.delete('/:orderId', function(req, res){
    Order.remove({_id : req.params.orderId})
        .then(result=>{
             res.json({
                 message: "deleted successfully",
                 request:{
                    type:'GET',
                    url:'http://localhost:3000/orders/'
                }
             });
         })
        .catch(err=>{
            res.json({
                error: err
        });
    });
});


module.exports = router;