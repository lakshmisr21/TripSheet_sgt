const ROLE={
    ADMIN:'admin',
    BASIC:'basic'
}

module.exports={
    ROLE:ROLE,
    users:[
        {id: 1, name:'ash', role: ROLE.ADMIN},
        {id: 2, name:'admin1', role: ROLE.BASIC}
    ]/*,
    projects:[
        {id: 1,name:"Kyle's Project",userId:1},
        {id: 2,name:"Sally's Project",userId:1}
    ]*/
}