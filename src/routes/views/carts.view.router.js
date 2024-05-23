import { Router } from 'express'
import cartModel from '../../dao/models/cart.model.js';

const viewRouter = Router();

viewRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        
        let cart = await cartModel.findById(cartId).populate('products.id').lean();

        if (!cart) {
            return res.status(404).render('error', { message: "Carrito no encontrado" });
        }

        console.log("ESTE ES EL CARRITO", cart)

        res.render('cart', { cart });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: "Error al obtener el Carrito" });
    }
});

export default viewRouter;