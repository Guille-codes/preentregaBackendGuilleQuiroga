const {Router} = require('express')
const uuid = require('uuid');

const productsRouter = Router();
const { getProductFromDB, getAllProductsFromDB, addProductToDB, updateProductInDB, deleteProductFromDB  } = require('./functionProducts');

productsRouter.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await getAllProductsFromDB(limit);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await getProductFromDB(pid);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

productsRouter.post('/', async (req, res) => {
    try {
        const body = req.body;

        const id = uuid.v4();

        const newProduct = {
            id,
            status: true,
            stock: body.stock,
            category: body.category,
            thumbnails: body.thumbnails,
            title: body.title,
            description: body.description,
            code: body.code,
            price: body.price
        };
        if (!newProduct.stock || !newProduct.category || !newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price) {
            throw new Error('Campo obligatorio.');
        }
        await addProductToDB(newProduct);

        res.status(200).json({ message: 'Producto agregado exitosamente.', product: newProduct });
    } catch (error) {
        if(error.error){
            res.status(400).json({error: error.error})
        }else{
            res.status(500).json({error: 'Error al agregar el producto.'});
        }
        
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const body = req.body;
        const product = await getProductFromDB(pid);
        for (let field in body) {
            if (field !== 'id') {
                product[field] = body[field];
            }
        }
        await updateProductInDB(pid, product);
        res.json({ message: 'Producto actualizado exitosamente.', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        await deleteProductFromDB(pid);
        res.status(200).json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = productsRouter