const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3100;
const proxy = require('fire-proxy');

/**
 * 
 * Forward /api traffic into backend server to avoid cors problem
 * 
 */
app.use('/api', proxy({
    target: `${process.env.BACKEND|| 'http://localhost:3100' }/api`
}));

 
app.use(express.static(path.resolve( __dirname, 'www')));  

/**
 * 
 * serve all the get request into index.html for rendering react application
 * 
 */
app.get('*', (req, res) => {
    res.sendFile(path.resolve( __dirname, 'www', 'index.html'));
});

app.listen( port, ()=>{
    console.log(`Server is listened at port ${port}`);
});