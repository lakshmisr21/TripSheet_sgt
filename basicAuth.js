const { restart } = require("nodemon");

function authUser(req,res,next)
{
    if(req.user==null){
        res.status(403)
        return res.send('Access Denied, You need to Sign In')
    }
next()
}

function authRole(role){
    return(req,res,next)=>{
        if(req.user.role !=role){
            res.status(401)
            return res.send('Not allowed to access this page')
        }
        next()
    }
}

module.exports={
    authUser,authRole
}

