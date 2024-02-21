import { Router } from "express";
import CartsManager from '../dao/dbManager/managers/carts.managers.js'

const router = Router();

const cartsManager = new CartsManager();

router.post('/', async (req, res) =>{
    const cart = { product: [] };
    const newCart = await cartsManager.addCart(cart);
    res.status(200).send({status: 'succes', message: 'Carrito creado', payload: newCart})
});

router.get('/:cid', async (req, res) =>{
    const { cid } = req.params
    const cart = await cartsManager.getCartByID(cid);

    if(cart){
        res.status(200).send({ status: 'succes', payload: cart.products })
    }else{
        res.status(404).send({ message: 'carrito no encontrado' })
    }
})

router.post('/:cid/product/:pid', async (req,res) =>{
    try {
        const cartID = Number(req.params.cid);
        const productID = Number(req.params.pid);

        const productCart = await cartsManager.getCartByID(cartID);
        
        if(productCart.products.some(product => product.id === productID)){
            const cantidad = productCart.products.find(product => product.id === productID).quatify;
            const result = await cartsManager.updateCart(cartID, { id: productID, quantify: 1 });
            res.status(200).send({ status: 'success', payload: result });
        }else {
            const result = await cartsManager.updateCart(cartID, { id: idProduct, quantity: 1 });
            res.status(200).send({ status: 'success', payload: result });
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
})

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const idCart = req.params.cid;
        const idProd = req.params.pid;

        const result = await cartsManager.deleteCart(idCart, idProd);

        res.status(200).send({ status: 'success', payload: result });
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
});


router.put('/:cid ', async (req, res) => {
    try {
        const cartId = req.params["cid "];
        const productsToUpdate = req.body.products;

        const updatedCart = await cartsManager.updateCartWithProducts(cartId, productsToUpdate);

        res.status(200).send({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(400).send({ status: 'error', payload: error.message });
    }
})

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const idCart = req.params.cid;
        const idProduct = req.params.pid;
        const newQuantity = req.body.quantity;

        const result = await cartsManager.updateCart(idCart, {
            'products.product': idProduct
        }, {
            $set: {
                'products.$.quantity': newQuantity
            }
        });

        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const idCart = req.params.cid;
        const result = await cartsManager.updateCart(idCart, { products: [] });
        res.status(200).send({ status: 'success', payload: result });
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
});
export default router;