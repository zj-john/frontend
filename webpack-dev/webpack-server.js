const express = require('express');
const app = express();
const webpack = require('webpack');
const middle = require('webpack-dev-middleware');

const config = require('./webpack.config.js');
const compiler = webpack(config);
app.use(middle(compiler));

app.get('/api/user', (req,res)=>{
    res.json({
        name: 'zj_john_3'
    })
})

app.listen(3000)