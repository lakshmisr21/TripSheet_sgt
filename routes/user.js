const express=require('express')
const path=require('path')
const bodyParser = require('express')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
User = require("../models/user")   

const app=express()

app.use('/',express.static(path.join(__dirname,'public')))
app.use(express.json())
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))



//ROUTES TO LOGIN AUTHENTICATION PAGE
app.get('/', async (req, res) => {res.render('/index.html')})
app.get('/login', async (req, res) => {res.render('/login.html')})
app.get('/register', async (req, res) => {res.redirect('/register.html')})

//ROUTES TO MAIN PAGE POST SUCCESSFULY LOGIN AUTHENTICATION


app.get('/admin',async (req, res) => {
	res.render('partials/header.ejs')
	})

app.get('/client.html', (req, res) => {
	res.render('/client.html')
})





//ROUTES TO CHANGE PASSWORD POST LOGIN
app.get('/changepwd'),async(req,res)=>{res.render('/change-password.html')}


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
		//const user = jwt.verify(token, JWT_SECRET)
		const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
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

//USER AUTHENTICATION ROUTES

app.post('/api/login', async (req, res) => {
	const { mobile, password } = req.body
	const user = await User.findOne({ mobile }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		//If the username, password combination is successful
		//Create and assign Token
				
		const token = jwt.sign(
			{
				id: user._id,
				mobile: user.mobile
			},
			process.env.ACCESS_TOKEN_SECRET
			)
		return res.json({ status: 'ok', data: token})
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