import { Router } from 'express';
import {
  getProducts, getProductById, getCategories,
  getFeaturedProducts, getRelatedProducts,
} from '../controllers/product.controller';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);

export default router;
