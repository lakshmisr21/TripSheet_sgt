const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/JPG','image/png', 'images/gif','image/jpg']

//Pending Trip Sheets

router.get('/pending', (req, res) => {
  //res.send('Pending Report View')
  res.render('pending/index')
})

router.post('/pending', (req, res) => {
//res.render('pending/pending')
})


module.exports = router