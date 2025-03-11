const express = require('express')
require('dotenv').config()
const app = express()
const connectDb = require('./DB/connect')
const authrouter = require('./routes/user')
const taskRouter = require('./routes/task')
const notFound = require('./errors/notFound')
const {createCustomError} = require('./errors/customError')
const errorHandlerMiddleWare = require('./middleWare/errorHandler')
const userAuthentication = require('./middleWare/authentication')
const helmet = require('helmet')
const xss = require('xss')
const cors = require('cors')
const rateLimiter = require('express-rate-limit')


// security 
app.set('trust proxy', 1);
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
}))
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

// router
app.use('/api/v1/auth', authrouter)
app.use('/api/v1/task', userAuthentication, taskRouter)

app.get('/', (req, res) => {
    res.status(200).send('homepage')
})
// middleWare
app.use(notFound)
app.use(errorHandlerMiddleWare)

 const PORT = process.env.PORT || 3000

 const start = async()=> {
    try {
        await connectDb(process.env.MONGO_URI)
        app.listen(PORT,(req, res)=> {
            console.log(`app is listening in port: ${PORT}.....`)
        })  
    } catch (error) {
        console.log(error); 
    }
 }
start()