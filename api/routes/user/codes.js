import express from 'express';
import { query } from 'express-validator';

import logger from '#utils/logger.js';
import validator from '#middlewares/validator.js';
import model from '#models/user/product.model.js';

const router = express.Router();

// 코드 등록
router.post('/', async function(req, res, next) {  
  try{
    
  }catch(err){
    next(err);
  }
});

export default router;