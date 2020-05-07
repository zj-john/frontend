const express = require('express');

const app = express();

// app.get('/api/user', (req,res)=>{
//     res.json({
//         name: 'zj_john'
//     })
// })

app.get('/user', (req,res)=>{
    res.json({
        name: 'zj_john'
    })
})

app.listen(3000)