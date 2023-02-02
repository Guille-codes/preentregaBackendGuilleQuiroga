const {Router} = require('express')
const uuid = require('uuid');
const cartsRouter = Router();
const { getCartFromDB, addCartToDB, updateCartInDB } = require('./functionCarts.js');

cartsRouter.post('/', async (req, res) => {
    try {
        const body = req.body;
        const id = uuid.v4();
        const newCart = {
            id,
            products: [body]
        };
        await addCartToDB(newCart);
        res.status(200).json({ message: 'Carrito creado exitosamente', cart: newCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await getCartFromDB(cid);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        let cart = await getCartFromDB(cid);
        let existingProduct = cart.products.find(p => p.product === pid)
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }
        await updateCartInDB(cid, cart);
        res.status(200).json({ message: 'Producto agregado exitosamente.', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = cartsRouter;