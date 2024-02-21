import express  from "express"
import handlebars from "express-handlebars"
import mongoose from "mongoose"
import { __dirname } from "./util.js"
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended : true }))

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

try {
    await mongoose.connect('mongodb+srv://nicolasgustavomunoz:5Dy8lacZIEoLyUE7@backend55660.ynxdryf.mongodb.net/?retryWrites=true&w=majority');
    console.log("Data Base connected");

} catch (error) {
    console.log(error.message);
};


app.listen(8080, () => console.log("Server Running On Port 8080"))