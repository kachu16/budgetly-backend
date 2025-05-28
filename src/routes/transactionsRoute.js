import express from 'express'
import { createTransaction, deleteTransaction, getSummary, getTransactionsByUserId } from "../controllers/transactionsController.js";

const router = express.Router();

router.get('/:userId', getTransactionsByUserId)

router.post('/', createTransaction)

router.delete('/:id', deleteTransaction)

router.get('/summary/:userId', getSummary)

export default router