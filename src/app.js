import express from 'express'
import mongoose from 'mongoose'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import dotenv from 'dotenv'
import cartApiRouter from './routes/api/carts.router.js'
import productApiRouter from './routes/api/products.router.js'
import viewRouterProduct from './routes/views/products.view.router.js'
import viewRouterCart from './routes/views/carts.view.router.js'

dotenv.config();

const app = express()
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

mongoose.connect(MONGO_URL)
.then(() => { console.log("Conectado a la base de datos") })
.catch(error => console.error("Error en la conexion", error))

app.use('/api/carts', cartApiRouter)
app.use('/api/products', productApiRouter)
app.use('/products', viewRouterProduct)
app.use('/carts', viewRouterCart)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})