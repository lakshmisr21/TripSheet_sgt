const express = require('express')
const router = express.Router()
//const Book = require('../models/book')
//const Author = require('../models/author')
const Penalty = require('../models/penalty')
const imageMimeTypes = ['image/jpeg','image/JPEG', 'image/JPG','image/png', 'images/gif','image/jpg']

// SEARCH from All Books Route
router.get('/penalty', async (req, res) => {
    let query = Penalty.find()
    if (req.query.gcnum != null && req.query.gcnum != '') {
      query = query.regex('gcnum', new RegExp(req.query.gcnum, 'i'))
    }
    if (req.query.status != null && req.query.status != '') {
        query = query.regex('status', new RegExp(req.query.status, 'i'))
      }
    try {
      const penalties = await query.exec()
      res.render('penalty/index', {
        penalties: penalties,
        searchOptions: req.query
      })
    } catch {
      res.redirect('penalty/penalty')
    }
  })
  
  // New Book Route
  router.get('/new', async (req, res) => {
    renderNewPage(res, new Penalty())
  })
  
  // Create Book Route
  router.post('/penalty', async (req, res) => {
    const penalty = new Penalty({
      penaltydate: new Date(req.body.penaltydate),
      vehnum: req.body.vehnum,
      penaltyplace: req.body.penaltyplace,
      gcnum: req.body.gcnum,
      partyname: req.body.partyname,
      penaltyamount: req.body.penaltyamount,
      receivedamount: req.body.receivedamount,
      modifiedDate:req.body.modifiedDate,
      status: req.body.status
    })
    saveCover(penalty, req.body.cover) 
    //saveReceipt(penalty, req.body.receipt)
    try {
      const newPenalty = await penalty.save()
      res.redirect(`/penalty/${newPenalty.id}`)
      } catch {
      renderNewPage(res, penalty, true)
    }
  })
  
  
  // Show Book Route
  router.get('/:id', async (req, res) => {
    try {
      const penalty = await Penalty.findById(req.params.id)
      res.render('penalty/show', { penalty: penalty })
    } catch {
      res.redirect('/penalty')
    }
  })

  //router.get('/',async(req,res)=>{})
  
  // Edit Penalty Route
  router.get('/:id/edit', async (req, res) => {
    try {
      const penalty = await Penalty.findById(req.params.id)
      renderEditPage(res, penalty)
    } catch {
      res.redirect('/penalty')
   }
  })
  
 

  
  // Update Complete Penalty Route
  
  router.put('/:id', async (req, res) => {
    let penalty
    try {
      penalty = await Penalty.findById(req.params.id)
      penalty.receivedamount = req.body.receivedamount
      //penalty.modifiedDate=req.body.modifiedDate
      penalty.status=req.body.status
      penalty.receipt=req.body.receipt
      if (req.body.receipt != null && req.body.receipt !== '') {
      saveReceipt(penalty, req.body.receipt)
     }
      await penalty.save()
      res.redirect(`/penalty/${penalty.id}`)
    } catch {
      if (penalty != null) {
        renderEditPage(res, penalty, true)
      } else {
        res.redirect('/')
      }
    }
  })
  
  
  // Delete Penalty Entry

  /*
  router.delete('/:id', async (req, res) => {
    let penalty
    try {
      penalty = await Penalty.findById(req.params.id)
      await penalty.remove()
      res.redirect('/penalty/penalty')
    } catch {
      if (penalty == null) {
        res.redirect('/penalty')
      } else {
        res.redirect(`/penalty/${penalty.id}`)
      }
    }
  })
  */
  
  router.delete('/:id', function (req, res) {
    //console.log("DELETING USER!")
    Penalty.findByIdAndRemove(req.params.id).then((Penalty) => {
      res.redirect('/penalty/penalty');
    }).catch((err) => {
      console.log(err.message);
    })
  })
  
  
  async function renderNewPage(res, penalty, hasError = false) {
    renderFormPage(res, penalty, 'new', hasError)
  }
  
  async function renderEditPage(res, penalty, hasError = false) {
    renderFormPage(res, penalty, 'edit', hasError)
  }
  
  async function renderFormPage(res, penalty, form, hasError = false) {
    try {
      
      const params = {
        penalty: penalty        
      }
      if (hasError) {
        if (form === 'edit') {
          params.errorMessage = 'Error Updating Penalty'
        } else {
          params.errorMessage = 'Error Creating Penalty'
        }
      }
      res.render(`penalty/${form}`, params)
    } catch {
      res.redirect('/penalty')
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

  function saveReceipt(penalty, receiptEncoded) {
    if (receiptEncoded == null) return
    const receipt = JSON.parse(receiptEncoded)
    if (receipt != null && imageMimeTypes.includes(receipt.type)) {
      penalty.receiptImage = new Buffer.from(receipt.data, 'base64')
      penalty.receiptImageType = receipt.type
    }
  }
  
  
  module.exports = router