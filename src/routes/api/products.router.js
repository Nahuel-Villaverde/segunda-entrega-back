import { Router } from 'express'
import productModel from '../../dao/models/product.model.js';

const router = Router();

router.get('/', async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let categoria = req.query.categoria;
    let sort = req.query.sort;

    console.log(`Limite establecido: ${limit}`);
    console.log(`Parámetro de ordenamiento recibido: ${sort}`);
    
    try {
        let filtro = {};
        if (categoria) {
            filtro.categoria = categoria;
        }

        let ordenamiento = {};
        if (sort === 'asc') {
            ordenamiento.precio = 1;
        } else if (sort === 'desc') {
            ordenamiento.precio = -1;
        }

        console.log('Objeto de ordenamiento:', ordenamiento);

        const result = await productModel.paginate(filtro, { page, limit, lean: true, sort: ordenamiento });

        console.log(result);
        const prevLink = result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&categoria=${categoria || ''}&sort=${sort || ''}` : null;
        const nextLink = result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&categoria=${categoria || ''}&sort=${sort || ''}` : null;

        res.render('products', { products: result.docs, page, limit, prevLink, nextLink, categoria, sort });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).render('error', { error: 'Error al obtener los productos' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        let product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).send({ result: "error", message: "Producto no encontrado" });
        }

        res.send({ result: "success", payload: product });
    } catch (error) {
        console.error(error);
        res.status(500).send({ result: "error", message: "Error al obtener el producto" });
    }
});

router.post('/', async (req, res) => {
    let { titulo, descripcion, precio, thumbnail, categoria, code, stock, disponible } = req.body

    if ( !titulo || !descripcion || !precio || !thumbnail || !categoria || !code || !stock || !disponible) {
        return res.send({ status: "error", error: "Faltan parametros" })
    }

    try {
        let result = await productModel.create({ titulo, descripcion, precio, thumbnail, categoria, code, stock, disponible });
        res.status(201).send({ result: "success", payload: result });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).send({ status: "error", error: "Error al crear el producto" });
    }
})

router.put('/:pid', async (req, res) => {
    let { pid } = req.params
    let productToReplace = req.body

    if (!productToReplace.titulo || !productToReplace.descripcion || !productToReplace.precio || !productToReplace.thumbnail || !productToReplace.code || !productToReplace.stock || !productToReplace.disponible) {
        res.send({ status: "error", error: "Parametros no definidos" })
    }
    let result = await productModel.updateOne({ _id: pid }, productToReplace)

    res.send({ result: "success", payload: result })
})

router.delete('/:pid', async (req, res) => {
    let { pid } = req.params
    let result = await productModel.deleteOne({ _id: pid })
    res.send({ result: "success", payload: result })
})

export default router