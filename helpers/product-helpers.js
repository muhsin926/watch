let db = require('../config/connection');
let collection = require('../config/collections');
const async = require('hbs/lib/async');
const { ObjectId } = require('mongodb');
const { response } = require('express');

module.exports = {  
    addProduct: (product, callback) => {
        db.get().collection('product').insertOne(product).then((data) => {
            callback(data.insertedId)
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    getProductDetails:(prodId)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(prodId)}).then((product) =>{
                resolve(product)
            })
        })
    },
    editProduct:(productId,product) =>{
        return new Promise ((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectId(productId)},{
                $set:{
                    name:product.name,
                    description:product.description,
                    price:product.price
                }
            }).then((response) =>{
                resolve(response)
            })
        })
    },
    deleteProduct:(productId) =>{
        return new Promise ( (resolve,reject)=> {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:ObjectId(productId)}).then((response)=>{
                resolve(response)
            })
        })
    }
}