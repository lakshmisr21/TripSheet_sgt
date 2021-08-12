if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
 
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('express')
const passport = require('passport')
const methodOverride = require('method-override')

const indexRouter=require('./routes/index')
const userRouter = require('./routes/user')
const usersRouter = require('./routes/users')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')
const missingRouter = require('./routes/missing')
const pendingRouter = require('./routes/pending')
const damagedRouter = require('./routes/damaged')
const penaltyRouter = require('./routes/penalty')  


app.set('html', __dirname + '/public')
  //app.set('view engine', 'html')
  app.set('view engine', 'ejs')
  app.set('views', __dirname + '/views')
  app.set('layout', 'layouts/layout')
  app.use(expressLayouts)
  app.use(methodOverride('_method'))
  app.use(express.static('public'))
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
  
  const mongoose = require('mongoose')
  mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true,useFindAndModify: false })
  const db = mongoose.connection
  db.on('error', error => console.error(error))
  db.once('open', () => console.log('Connected to Mongoose'))
  
  app.use('/', userRouter)
  app.use('/users',usersRouter)
  app.use('/index',indexRouter)
  app.use('/authors', authorRouter)
  app.use('/books', bookRouter)
  app.use('/missing',missingRouter)
  app.use('/pending',pendingRouter)
  app.use('/damaged',damagedRouter)
  app.use('/penalty',penaltyRouter)
  
app.listen(process.env.PORT || 3000)