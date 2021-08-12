const express = require('express')
const router = express.Router()
const imageMimeTypes = ['image/jpeg', 'image/JPG','image/png', 'images/gif','image/jpg']


//Damaged Trip Sheets

router.get('/damaged', (req, res) => {
  res.render('damaged/index')
  //res.send('Damaged Report View')
})

router.post('/damaged', (req, res) => {
//res.render('damaged/damaged')
})


module.exports = router