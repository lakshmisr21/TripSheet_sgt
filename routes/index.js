const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
/*
router.get('/', async (req, res) => {
  let book
  try {
    book = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    book = []
  }
  res.render('index', { book: book })
})*/

//router.get('/:id', async (req, res) => {
  router.get('/', async (req, res) => {
  try {
    const book = await Book.find(req.params.id)
                           .populate('author')
                           .exec()
    //res.render('books/show', { book: book })
    res.render('index', { book: book })
  } catch {
    res.redirect('/')
  }
})

module.exports = router