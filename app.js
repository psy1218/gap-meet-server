const express = require('express');
const app = express();

app.get('/', function(req, res){
    res.send('hello NodeJs');
})
app.listen(3000, () => console.log('3000번 포트 대기'));