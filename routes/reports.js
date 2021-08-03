const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const Penalty = require('../models/penalty')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif','image/jpg']

// Reports

router.get('/', (req, res) => {
  res.render('reports/index')
})

router.post('/', (req, res) => {
res.render('reports/index')
})


//Pending Trip Sheets

router.get('/pending', (req, res) => {
  res.render('reports/pending')
})

router.post('/pending', (req, res) => {
res.render('reports/pending')
})


//Missing Trip Sheets GC

router.get('/missing', (req, res) => {
  res.render('reports/missing')
})

router.post('/missing', (req, res) => {
res.render('reports/missing')
})


//Damaged Trip Sheets

router.get('/damaged', (req, res) => {
  res.render('reports/damaged')
})

router.post('/damaged', (req, res) => {
res.render('reports/damaged')
})

//Penalty Home Page

router.get('/penalty', (req, res) => {
  res.render('reports/penalty')
})

router.post('/penalty', (req, res) => {
  res.render('reports/penalty')
})

//Penalty New

router.post('/penaltynew', (req, res) => {})

router.get('/penaltynew', async (req, res) => {
  res.send('hello')
})


//Create New Penalty Form
router.get('/penaltycreate', (req, res) => {res.send('hello')})

router.post('/penaltycreate', async (req, res) => {
 const penalty=new penalty({
  penaltydate: new Date(req.body.penaltydate),
  vehnum:req.body.vehnum,
  penaltyplace:req.body.author,
  lrnum:req.body.lrnum,
  partyname:req.body.partyname,
  penaltyamount:req.body.penaltyamount,
  receivedamount:req.body.receivedamount,
  status:req.body.status,
  }) 
  saveCover(penalty, req.body.cover)
   try{
    const newPenalty=await penalty.save()
    res.redirect(`penaltycreate${newPenalty.id}`)
   }catch{
    renderNewPage(res,penalty,true)
   }
})

//Penalty old Form view

router.post('/penaltyview', (req, res) => {})

router.get('/penaltyview', async (req, res) => {
  res.send('hello')
})


async function renderNewPage(res, penalty, hasError = false) {
    renderFormPage(res, penalty, 'new', hasError)
  }
  
  async function renderEditPage(res, penalty, hasError = false) {
    renderFormPage(res, penalty, 'edit', hasError)
  }
  
  async function renderFormPage(res, penalty, form, hasError = false) {
    try {
      const authors = await Author.find({})
      const params = {
        authors: authors,
        penalty: penalty
      }
      if (hasError) {
        if (form === 'edit') {
          params.errorMessage = 'Error Updating Book'
        } else {
          params.errorMessage = 'Error Creating Book'
        }
      }
      res.render(`penaltycreate/${form}`, params)
    } catch {
      res.redirect('/reports')
    }
  }
  
  function saveCover(penalty, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
      penalty.coverImage = new Buffer.from(cover.data, 'base64')
      penalty.coverImageType = cover.type
    }
  }
  

module.exports = router