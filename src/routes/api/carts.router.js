import { Router } from 'express'
import cartModel from '../../dao/models/cart.model.js';
import productModel from '../../dao/models/product.model.js';

const router = Router();

router.post('/', async (req, res) => {
    const { products } = req.body;

    if (!products) {
        return res.status(400).send({ status: "error", error: "Faltan parámetros: 'products' es requerido" });
    }

    try {
        let result = await cartModel.create({ products });
        res.status(201).send({ result: "success", payload: result });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).send({ status: "error", error: "Error al crear el carrito" });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        let cart = await cartModel.findById(cartId);

        if (!cart) {
            return res.status(404).send({ result: "error", message: "Carrito no encontrado" });
        }

        res.send({ result: "success", payload: cart });
    } catch (error) {
        console.error(error);
        res.status(500).send({ result: "error", message: "Error al obtener el Carrito" });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const productInCart = cart.products.find(product => String(product.id) === productId);
        console.log(productInCart)

        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.products.push({ id: productId, quantity: 1 });
        }

        await cart.save();

        res.json(cart.products);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

router.delete('/:cid', async (req, res) => {
    let { cid } = req.params
    let result = await cartModel.deleteOne({ _id: cid })
    res.send({ result: "success", payload: result })
})

export default router