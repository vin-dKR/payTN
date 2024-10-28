import express from 'express'

const app = express()
const port = 3002

app.post("/", (req, res) => {
	const paymentInfo = {
		token: req.body.token,
		userId: req.body.userId,
		amount: req.body.amount
	}
})

app.listen(port, () => {
	console.log(`port is crawling on ${port}`)
})
