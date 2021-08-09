const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/JPG','image/png', 'images/gif','image/jpg']

// Reports Home Routes

router.get('/reports', (req, res) => {
    res.render('missing/index')
  })
  
  
  

//Missing Trip Sheets GC

router.get('/missing', (req, res) => {
  //res.render('missing/missing')
  res.send('Missing Report View')
})

router.post('/missing', (req, res) => {
//res.render('missing/missing')
})

module.exports = router