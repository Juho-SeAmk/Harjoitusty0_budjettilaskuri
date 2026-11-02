import { useEffect, useState } from 'react'
import './App.css'

// Sovelluksessa käytettävät menokategoriat
const categories = ['Ruoka', 'Bensa', 'Huvittelu', 'Laskut', 'Muut']

// Uuden menon oletusarvot ja lomakkeen alkutila
const newExpense = {
  amount: '',
  category: 'Ruoka',
  date: '',
}
const App = () => {
  // Sovelluksen tilat: menot, lomakkeen tiedot, suodatus ja ilmoitukset
  const [expenses, setExpenses] = useState([])
  const [expense, setExpense] = useState(newExpense)
  const [category, setCategory] = useState('Kaikki')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Haetaan kaikki menot palvelimelta komponentin latautuessa
  useEffect(() => {
    fetch('http://localhost:3001/api/expenses')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Menojen hakeminen epäonnistui.')
        }
        return response.json()
      })
      .then(setExpenses)
      .catch((error) => setError(error.message))
  }, [])

  // Päivitetään lomakkeen tila muutetun kentän perusteella
  const handleChange = (event) => {
    setExpense({
      ...expense,
      [event.target.name]: event.target.value,
    })
  }

  // Lähetetään uusi meno palvelimelle
  const addExpense = (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    fetch('http://localhost:3001/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Menon tallentaminen epäonnistui.')
        }
        return response.json()
      })
      .then((savedExpense) => {
        setExpenses((oldExpenses) => [savedExpense, ...oldExpenses])
        setExpense(newExpense)
        setSuccess('Lisäys onnistui!')
      })
      .catch((error) => {
        setSuccess('')
        setError(error.message)
      })
  }

  // Poistetaan valittu meno palvelimelta ja käyttöliittymästä
  const deleteExpense = (id) => {
    fetch(`http://localhost:3001/api/expenses/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Menon poistaminen epäonnistui.')
        }
        setExpenses((oldExpenses) => oldExpenses.filter((item) => item.id !== id))
      })
      .catch((error) => setError(error.message))
  }

  // Näytetään kaikki menot tai vain valitun kategorian menot
  const visibleExpenses = category === 'Kaikki'
    ? expenses
    : expenses.filter((item) => item.category === category)

  // Lasketaan kaikkien menojen yhteissumma
  const total = expenses.reduce((sum, item) => sum + item.amount, 0)

  return (
    <main>
      <h1>Budjetointi-sovellus</h1>
      <p>Menot yhteensä: {total.toFixed(2)} €</p>

      {/* Lomake uuden menon lisäämistä varten */}
      <h2>Lisää meno</h2>
      <form onSubmit={addExpense}>
        <div className="form-row">
          Summa:
          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={expense.amount}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-row">
          Kategoria:
          <select name="category" value={expense.category} onChange={handleChange}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        
        <div className="form-row">
          Päivämäärä:
          <input
            name="date"
            type="text"
            placeholder="YYYY-MM-DD"
            value={expense.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit">Tallenna</button>
      </form>

      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Menojen suodatus ja lista */}
      <h2>Menot</h2>
      <div>
        
        <p>Valitse kategoria:</p>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option>Kaikki</option>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      

      <ul>
        {visibleExpenses.map((item) => (
          <li key={item.id}>
            {item.date} - {item.category}: {item.amount.toFixed(2)} €
            
            <button type="button" onClick={() => deleteExpense(item.id)}>
              Poista
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
