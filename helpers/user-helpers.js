let db = require('../config/connection');
let collection = require('../config/collections');
const bcrypt = require('bcrypt');
const async = require('hbs/lib/async');
let objectid = require('mongodb').ObjectId

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.insertedId)
            })
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    } else {
                        resolve({ status: false })
                    }
                })
            } else {
                resolve({ status: false })
            }
        })
    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let userdetails=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(userdetails)
        })
    },
    addUser: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.insertedId)
            })
        })
    },
    deleteUser:(usrId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectid(usrId)}).then((response)=>{
                resolve(response) 
            })
        })
    },
    getUserDetails:(usrID)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({_id:objectid(usrID)}).then((user)=>{
                resolve(user)
            })
        })
    },
    updateUser:(usrID,userDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectid(usrID)},{
                $set:{
                    Name:userDetails.Name,
                    Email:userDetails.Email
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
    
}
        