const express = require('express')
const router = express.Router()
User = require('../models/user')


// All Users Route


router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.mobile != null && req.query.mobile !== '') {
    searchOptions.mobile = req.query.mobile
  }
  try {
    const users = await User.find(searchOptions)
    res.render('users/index', {
      users: users,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})


// Show Users Route
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    res.render('users/show', {
      user: user,
    })
  } catch {
    res.redirect('/')
  }
})

// Edit Users Route
router.get('/:id/edit', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    res.render('users/edit', { user: user })
  } catch {
    res.redirect('/users')
  }
})

// Update Users Route
router.put('/:id', async (req, res) => {
  let user

  try {
    user = await User.findById(req.params.id)
    user.name = req.body.name
    user.mobile = req.body.mobile
    await user.save()
    res.redirect(`users/${user.id}`)
  } catch {
    if (user != null) {
      renderEditPage(res, user, true)
    } else {
      redirect('/')
    }
  }
})


router.delete('/:id', function (req, res) {
  console.log("DELETING USER!")
  User.findByIdAndRemove(req.params.id).then((User) => {
    res.redirect('/users');
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
      users: users
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
    res.redirect('/users')
  }
}

module.exports = router