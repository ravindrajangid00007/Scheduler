const express = require('express');
const app = express();
const port = 80;
app.use(express.json());
app.use(express.urlencoded()) ;
const { sequelize } = require('./models');
async function main() {
    await sequelize.authenticate();
    console.log("databases connected");
}

main()
const sassMiddleware = require('node-sass-middleware') ;
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended' ,
    prefix: '/css'
}));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname + '/assets'));



app.use('/', require('./routes/index'));
// const db = require('./config/mongoose');
// const User = require('./models/user');



app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running server: ${err}`);
        return;
    }

    console.log(`Server is running on ${port}`);
});