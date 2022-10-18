let express = require('express');
const async = require('hbs/lib/async');
let router = express.Router();
let productHelper = require('../helpers/product-helpers');
let userHelpers = require('../helpers/user-helpers');


/* GET users listing. */
router.get('/', function (req, res, next) {
 
  if (req.session.adminLoggedIn) {
    res.redirect('/admin/view-products');
  } else {
    res.render('admin/admin-login', { adminLoggErr: req.session.adminLoggErr });
    req.session.adminLoggErr = false;
  }
});

router.get('/view-products', function (req, res, next) {

  productHelper.getAllProducts().then((products) => {
    if (req.session.adminLoggedIn) {
      res.render('admin/view-products', { products, admin: true });
    } else {
      res.redirect('/admin')
    }
  })
});

const admindb = {
  email: "admin@gmail.com",
  password:123
}

router.post('/adminLogin', function (req, res) {
 
  if (req.body.email == admindb.email && req.body.password == admindb.password) {
    req.session.adminLoggedIn = true;
    res.redirect('/admin/view-products');
  } else {
    req.session.adminLoggErr = true;
    res.redirect('/admin');
  }
});

router.get('/add-product', function (req, res, next) {

  if (req.session.adminLoggedIn) {
    res.render('admin/add-product', { admin: true });
  } else {
    res.redirect('/admin');
  }
});

router.post('/add-product', (req, res) => {
  // console.log(req);
  productHelper.addProduct(req.body, (id) => {
    let image = req.files.Image;
    image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.render('admin/add-product')
      } else {
        console.log(err);
      }
    })
  });
});

router.get('/view-users', function (req, res, next) {
  // res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
  userHelpers.getAllUsers().then((userdetails) => {
    if (req.session.adminLoggedIn) {
      res.render('admin/view-users', { userdetails, admin: true });
    } else {
      res.redirect('/admin')
    }
  }
  )
});

router.get('/add-user', function (req, res, next) {
  // res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
  if (req.session.adminLoggedIn) {
    res.render('admin/add-user', { admin: true });
  } else {
    res.redirect('/admin');
  }
});

router.post('/add-users', (req, res) => {
  userHelpers.addUser(req.body).then((response) => {
    res.redirect('/admin/view-users')
  });
});

router.get('/delete-user/:id', (req, res) => {
  let usrId = req.params.id;
  userHelpers.deleteUser(usrId).then((response) => {
    res.redirect('/admin/view-users')
  })
})

router.get('/edit-user/:id', async (req, res) => {
  // res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
  if (req.session.adminLoggedIn) {
    let user = await userHelpers.getUserDetails(req.params.id)
    res.render('admin/edit-user', { user,admin:true })
  } else {
    res.redirect('/admin');
  }
})

router.post('/edit-user/:id', (req, res) => {
  userHelpers.updateUser(req.params.id, req.body).then(() => {
    res.redirect('/admin/view-users')
  })
})

router.get('/edit-productGet/:id' ,async (req,res) => {

  let product=await productHelper.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product})

})
router.post('/edit-productPost/:id',async(req,res) =>{
  productHelper.editProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin/view-products')
    // console.log(req.files.Image);
    if (req.files){
      let image=req.files.Image
      image.mv('./public/product-images/' +req.params.id+ '.jpg')

    }
    
  })
})

router.get('/delete-product/:id', (req,res) =>{
  productHelper.deleteProduct(req.params.id).then((response)=>{
    res.redirect('/admin/view-products')
  })
})


router.get('/adminLoggout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/admin');
});

module.exports = router;


