import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const port = 3001
const categories = ['Ruoka', 'Bensa', 'Huvittelu', 'Laskut', 'Muut']
const currentFile = fileURLToPath(import.meta.url)
const dataDirectory = path.join(path.dirname(currentFile), '..', 'data')
const dataFile = path.join(dataDirectory, 'expenses.json')

app.use(cors())
app.use(express.json())

const readExpenses = () => {
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'))
  } catch (error) {
    throw new Error(`Menojen lukeminen epäonnistui: ${error.message}`, { cause: error })
  }
}

const saveExpenses = (expenses) => {
  try {
    fs.mkdirSync(dataDirectory, { recursive: true })
    fs.writeFileSync(dataFile, JSON.stringify(expenses, null, 2))
  } catch (error) {
    throw new Error(`Menojen tallentaminen epäonnistui: ${error.message}`, { cause: error })
  }
}

const generateId = (expenses) => {
  const maxId = expenses.reduce((max, expense) => Math.max(max, Number(expense.id)), 0)
  return String(maxId + 1)
}

app.get('/api/expenses', (request, response) => {
  try {
    response.json(readExpenses())
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

app.post('/api/expenses', (request, response) => {
  const { amount, category, date } = request.body
  const numericAmount = Number(amount)

  if (!Number.isFinite(numericAmount) || numericAmount <= 0 || !categories.includes(category) || typeof date !== 'string' || !date.trim()) {
    return response.status(400).json({ error: 'Täytä kaikki kentät oikein.' })
  }

  try {
    const expenses = readExpenses()
    const expense = {
      id: generateId(expenses),
      amount: Math.round(numericAmount * 100) / 100,
      category,
      date: date.trim(),
    }
    saveExpenses([expense, ...expenses])
    response.status(201).json(expense)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

app.delete('/api/expenses/:id', (request, response) => {
  try {
    const expenses = readExpenses()
    const filteredExpenses = expenses.filter((expense) => expense.id !== request.params.id)

    if (filteredExpenses.length === expenses.length) {
      return response.status(404).json({ error: 'Menoa ei löytynyt.' })
    }

    saveExpenses(filteredExpenses)
    response.json({ message: 'Meno poistettu.' })
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
