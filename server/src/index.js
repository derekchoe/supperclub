
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config';
import routesFunction from './routes/index'

const busboy = require("connect-busboy");
const busboyBodyParser = require("busboy-body-parser");

const routes = routesFunction()

if (!process.env.JWT_SECRET) {
    const err = new Error('No JWT_SECRET in env variable, check instructions: https://github.com/amazingandyyy/mern#prepare-your-secret');
    console.error(err);
}

const app = express();

mongoose.connect(config.mongoose.uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
.catch(err=>console.error(err));

mongoose.Promise = global.Promise;

// App Setup
app.use(cors({
    origin: ['https://www.amazingandyyy.com', 'http://localhost:3000']
}));
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(busboy());
app.use(busboyBodyParser());

app.get('/', (req, res) => res.json({'source': 'https://github.com/amazingandyyy/mern'}))
// app.post('/signup', Authentication.signup)
// app.post('/signin', Authentication.signin)
// app.get('/auth-ping', Middlewares.loginRequired, (req, res) => res.send('connected'))
// app.use('/user', Middlewares.loginRequired, UserRouter)


app.use((err, req, res, next) => {
    console.log('Error:', err.message);
    res.status(422).json(err.message);
});


Object.keys(routes).map((key) => {
    app.use(key, require(`${routes[key]}`));
});

// Server Setup
const port = process.env.PORT || 8000
http.createServer(app).listen(port, ()=>{
    console.log(`\x1b[32m`, `Server listening on: ${port}`, `\x1b[0m`)
});