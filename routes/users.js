const { response } = require('express');
let express = require('express');
let router = express.Router();
let productHelper = require('../helpers/product-helpers');
let userHelpers = require('../helpers/user-helpers');

/* GET users listing. */
router.get('/', function(req, res, next) {
  let user=req.session.user
  productHelper.getAllProducts().then((products)=>{
    if(user)
    res.render('user/view-products', { products,user, users: true });
    else
    res.render('user/user-login')
  })

});

router.get('/login', function(req, res, next) {
 
  if(req.session.loggedIn){
     res.redirect('/')
  }else{
    res.render('user/user-login',{loginerr:req.session.loginerr,users:true});
    req.session.loginerr=false
  }

});
router.get('/register', function(req, res, next) {
 
  if(req.session.loggedIn){
    res.redirect('/')
  }
  else{
  res.render('user/user-register',{users:true});
  }
});

router.post('/sign', function(req,res){
    userHelpers.doSignup(req.body).then((response)=>{
      res.redirect('/login')
    });
});

router.post('/userLogin', function(req,res){
 
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true;
      req.session.user=response.user;
      res.redirect('/');
    }else{
      req.session.loginerr=true
      res.redirect('/login');
    }
  })
});

router.get('/userLoggout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/')
});
module.exports = router;
