const express = require('express')
const router = express.Router()
User = require('../models/login')


// All Users Route


router.get('/user', async (req, res) => {
  let searchOptions = {}
  if (req.query.mobile != null && req.query.mobile !== '') {
    searchOptions.mobile = req.query.mobile
  }
  try {
    const users = await User.find(searchOptions)
    res.render('user/index', {
      users: users,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})


/*
router.get('/:id',(req,res)=>{
    res.send('show Author' + req.params.id)
})

router.get('/:id/edit',(req,res)=>{
    res.send('show Edit Author' + req.params.id)

router.put('/:id',(req,res)=>{
    res.send('show Update Author' + req.params.id)

router.delete('/:id',(req,res)=>{
    res.send('Delete Author' + req.params.id)
*/



router.get('/:id', async (req, res) => {
    try {
      const login = await User.findById(req.params.id)
      //const books = await Book.find({ author: author.id }).limit(6).exec()
      res.render('user/show', {
        User: User        
      })
    } catch {
      res.redirect('/')
    }
  })

router.get('/:id/edit', async (req, res) => {
  try {
    const users = await User.findById(req.params.id)
    renderEditPage(res, users)
  } catch {
    res.redirect('/user')
  }
})
//Update Users

router.put('/:id', async (req, res) => {
  let users
  try {
    users = await User.findById(req.params.id)
    users.name = req.body.name
    users.mobile = req.body.mobile
     await users.save()
    res.redirect(`/user/${users.id}`)
  } catch {
    if (users != null) {
      renderEditPage(res, users, true)
    } else {
      redirect('/user')
    }
  }
})

router.delete('/user/:id', function (req, res) {
  console.log("DELETING USER!")
  User.findByIdAndRemove(req.params.id).then((User) => {
    res.redirect('/user');
  }).catch((err) => {
    console.log(err.message);
  })
})

async function renderNewPage(res, User, hasError = false) {
  renderFormPage(res, User, 'new', hasError)
}

async function renderEditPage(res, User, hasError = false) {
  renderFormPage(res, User, 'edit', hasError)
}

async function renderFormPage(res, User, form, hasError = false) {
  try {
    const users = await User.find({})
    const params = {
      //authors: authors,
      User: User
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating User'
      } else {
        params.errorMessage = 'Error Creating User'
      }
    }
    res.render(`users/${form}`, params)
  } catch {
    res.redirect('/user')
  }
}

module.exports = router