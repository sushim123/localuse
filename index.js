const express = require ('express')
const app = express()

app.get( '/ss',function (req) {
    res.send('hello world');
})
app.listen (3000)

