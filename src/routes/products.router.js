import { Router } from 'express';
import ProductManager from '../dao/dbManager/managers/products.managers.js';
import { productsModel } from '../dao/dbManager/models/product.model.js';

const router = Router();

const productManager = new ProductManager();

router.get('/', async (req,res) => {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    const options = {
        page: page,
        limit: limit,
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    };
    const filter = query ? { category: query, status: true } : { status: true };
    try {
        const result = await productsModel.paginate(filter, options);
        res.send({
            status: 'success',
            payload: {
                docs: result.docs,
                totalPages: result.totalPages,
                prevPage: result.hasPrevPage ? result.prevPage : null,
                nextPage: result.hasNextPage ? result.nextPage : null,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
                nextLink: result.hasNextPage ? `/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null
            }
        }); 
    } catch (error) {
        res.status(404).send({ error: 'product not found' });
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const idProduct = Number(req.params.pid);
        const product = await productManager.getProductByiD(idProduct);
        res.status(200).send(product);
    } catch (error) {
        res.status(404).send({error: 'product not found'})
    }
})

router.post('/', async (req, res) => {
    try {
        const product = req.body;
        await productManager.addProduct(product);
        res.status(200).send({status: 'succes', payload: product});
    } catch (error) {
        res.status(404).send({error: error.message});
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const productId = Number(req.params.pid);
        const productBody = req.body;
    
        const tof = await productManager.updateProduct(productId, productBody);
        const productUpdated = await productManager.getProductByiD(productId);
    
        if (tof) {
            res.status(200).send({satus: 'succes', payload: productUpdated})
        }else {
            res.status(404).send({error: error.message, message: 'Product not found or Product code alredy exist' })
        }
    } catch (error) {
        res.status(404).send({error: error.message});
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const productId = Number(req.params.pid);
        await productManager.deleteProduct(productId);

        res.status(200).send({status: 'succes', payload: `Product N° ${productId} deleted`})
    } catch (error) {
        res.status(404).send({error: error.message}); 
    }
})

export default router;