import { sql } from "../config/db.js"

export async function getTransactionsByUserId(req, res) {
    try {
        const { userId } = req.params
        console.log(userId)
        const transactions = await sql`
               SELECT * FROM transactions where user_id = ${userId} ORDER BY created_at DESC
               `

        if (transactions) {
            return res.status(200).json({
                data: transactions,
                message: "Transaction fetched successfully!"
            })
        }
    } catch (error) {
        console.log("Error getting the transaction", error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export async function createTransaction(req, res) {
    // title, amount, category, user_id
    try {
        const { title, amount, category, user_id } = req.body
        if (!title || !amount || !category || amount === undefined) {
            return res.status(400).json({
                message: "All fields are required!"
            })
        }

        const transaction = await sql`
            INSERT INTO transactions(user_id, title, amount, category)
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
            `
        console.log(transaction)
        return res.status(201).json({
            data: transaction[0],
            message: "Created successfully!"
        })
    } catch (error) {
        console.log("Error creating the transcation", error)
        return res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export async function deleteTransaction(req, res) {
    try {
        const { id } = req.params;
        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid transaction ID" })
        }
        const result = await sql`
        DELETE FROM transactions WHERE id= ${id} RETURNING *
        `
        if (result.length === 0) {
            return res.status(404).json({ message: "Transaction not found" })
        }

        res.status(200).json({ message: "Transaction deleted successfully!" })

    } catch (error) {

        console.log("Error deleting the transaction", error)
        return res.status(500).json({ message: "Internal Server error" })
    }

}

export async function getSummary(req, res) {
    try {
        const { userId } = req.params;

        const balanceResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
        `

        // income+ expense- amount>0 -> income and <0 expense
        const incomeResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
        `
        const expensesResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
        `

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expensesResult[0].expenses
        })


    } catch (error) {
        console.log("Error getting the summary", error)
        return res.status(500).json({ message: "Internal Server error" })
    }

}
