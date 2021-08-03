const express=require('express')
const path=require('path')
const bodyParser = require('express')
const passport=require('passport-local-mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
//const { session } = require('passport')
//const { clearCache } = require('ejs')
User = require("../models/login")   
User = require("../models/author") 
User = require("../models/book") 

const JWT_SECRET='1m6y3f8i5r0s2t5w7e4b*@#7a9p0p)3l2i6c7a9t4i1o0n8o6n4t2r6i7p4S5h6e3e1t8*&%$'

const app=express()
//app.set('view engine', 'html');
//app.use(express.static('public'))
app.use('/',express.static(path.join(__dirname,'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))


//link url not working
//app.get('/public', (req,res)=>{ res.sendFile(__dirname + '/login-user.html')})


//ROUTES TO MAIN PAGE POST SUCCESSFULY LOGIN AUTHENTICATION
app.get('/', async (req, res) => {res.render('/index.html')})
app.get('/login', async (req, res) => {res.render('/login.html')})
app.get('/register', async (req, res) => {res.redirect('/register.html')})

//ROUTES TO MAIN PAGE POST SUCCESSFULY LOGIN AUTHENTICATION
app.get('/home', async (req, res) => {res.render('home.html')})


//ROUTES TO CHANGE PASSWORD POST LOGIN
app.get('/changepwd'),async(req,res)=>{res.render('/change-password.html')}

//USER AUTHENTICATION ROUTES


app.post('/api/change-password', async (req, res) => {
	const { token, newpassword: plainTextPassword } = req.body

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok'})
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
	throw error
})

app.post('/api/login', async (req, res) => {
	const { mobile, password } = req.body
	const user = await User.findOne({ mobile }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				mobile: user.mobile
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})

app.post('/api/register',async (req,res)=>{
    //console.log(req.body) //to view what user typed in the registration form
    const {name,mobile,password:plainTextPassword}=req.body
    //Authenticaion Process
    if(!name || typeof name!=='string'){
        return res.json({status:'error',error:'Invalid Username'})
    }
    if(!plainTextPassword || typeof plainTextPassword!=='string'){
        return res.json({status:'error',error:'Invalid Password'})
    }
    if(plainTextPassword.length<5){
        return res.json({status:'error',error:'Password is too small. Should be atleast 5 characters'})
    }
    if(mobile.length<10){
        return res.json({status:'error',error:'Mobile number should be 10 numbers'})
    }
 
  //Hashing password
  const password=await bcrypt.hash(plainTextPassword,10)

  try{
    const newuser=await User.create({
        name,mobile,password
    })
    
  }catch (error){
      //console.log(error)
      //return res.json({status:'error'})
      if (error.code === 11000) {
        // duplicate key
        return res.json({ status: 'error', error: 'Mobile already in use' })
    }
    throw error
  }
     res.json({status:'ok'})
})  

//LOG OUT ROUTE

app.delete('/logout', (req, res) => {
	req.logOut()
	res.redirect('/login.html')
  })

module.exports = app