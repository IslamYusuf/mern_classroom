import mongoose from 'mongoose'

import config from './../config/config'
import app from './express'

app.listen(config.port, (err) => {
    if (err) { console.log(err) }
    console.info('Server started on port %s.', config.port)
})

mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, { useNewUrlParser: true,
    //useCreateIndex: true,
    autoIndex:true,
    useUnifiedTopology: true 
})

mongoose.connection.on('error', (err) => {
    throw new Error(`unable to connect to database: ${config.mongoUri}. Error:${err.message}`)
})