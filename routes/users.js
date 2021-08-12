const express = require('express')
const router = express.Router()
User = require('../models/user')


// All Users Route


router.get('/users', async (req, res) => {
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
    res.redirect('/users')
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
    res.redirect('/users')
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
    res.redirect(`/users/${user.id}`)
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
    res.redirect('/');
  }).catch((err) => {
    console.log(err.message);
  })
})

async function renderNewPage(res, user, hasError = false) {
  renderFormPage(res, user, 'new', hasError)
}

async function renderEditPage(res, user, hasError = false) {
  renderFormPage(res, user, 'edit', hasError)
}

async function renderFormPage(res, user, form, hasError = false) {
  try {
    const user = await User.find({})
    const params = {
      user: user
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