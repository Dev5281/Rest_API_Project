const express = require('express');
const users = require("./MOCK_DATA.json");
const fs = require("fs");

const app = express();
const PORT = 8000;

// Middleware
app.use(express.urlencoded({extended:false}));

//ROUTES

app.get("/users",(req,res)=>{
    const html = `
    <ul>
     ${users.map((user)=>`<li>${user.first_name}.</li>`).join("")}
    </ul>
    `
    res.send(html);
    
});
// REST API
app.get("/api/users",(req,res)=>{
    return res.json(users);
});

  app.route("/api/users/:id").get((req,res)=>{
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    return res.json(user);
   })
   .put((req,res)=>{
    const id = Number(req.params.id);
    const body = req.body;
    const user = users.find((user)=> user.id ===id);
    const updatedUser = {...user,...body};
    updatedUser.id = id;
    users[id-1]=updatedUser;
    fs.writeFile('MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
     return res.json({status : "success",updatedUser})
    });


    
    
   })
   .delete((req,res)=>{
    const id = Number(req.params.id);
    const userIdx = users.findIndex((user)=>user.id ===id);
    const delUser = users.splice(userIdx,1)[0];
    fs.writeFile('./MOCK_DATA.JSON',JSON.stringify(users),(err,data)=>{
        return res.json({status:'success',delUser});
    });
    
   })

   app.post("/api/users",(req,res)=>{
     const body = req.body;
     users.push({...body,id: users.length+1});
     fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err, data)=>{
        return res.json({status:"success",id: users.length})
     });

    
   });
    





app.listen(PORT,()=> console.log(`Server Started at PORT:${PORT}`));
