import { useEffect, useState } from 'react'
import ky from 'ky'
import './App.css'

function parseData(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  return lines.map((ln, i) => {
    const parts = ln.split(',').map(p => p.trim())
    return { id: i + 1, A: parts[0], B: parts[1], C: parts[2] }
  })
}

function unique(values, key) {
  return Array.from(new Set(values.map(v => v[key]))).sort()
}

function App() {
  const [dataRecords, setDataRecords] = useState([])
  const [selectedA, setSelectedA] = useState('')
  const [selectedB, setSelectedB] = useState('')
  const [selectedC, setSelectedC] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const fileContent = await ky.get('/testData.txt').text()
        setDataRecords(parseData(fileContent))
      } catch (err) {
        console.error('Failed to load testData.txt', err)
      }
    }
    loadData()
  }, [])

  const filteredRecords = dataRecords.filter(r => {
    if (selectedA && r.A !== selectedA) return false
    if (selectedB && r.B !== selectedB) return false
    if (selectedC && r.C !== selectedC) return false
    return true
  })
  
  // for each select, compute available options based on the other two selects.
  // ensures selecting B updates A's options and vice-versa.
  const optionsA = unique(dataRecords.filter(r => {
    if (selectedB && r.B !== selectedB) return false
    if (selectedC && r.C !== selectedC) return false
    return true
  }), 'A')

  const optionsB = unique(dataRecords.filter(r => {
    if (selectedA && r.A !== selectedA) return false
    if (selectedC && r.C !== selectedC) return false
    return true
  }), 'B')

  const optionsC = unique(dataRecords.filter(r => {
    if (selectedA && r.A !== selectedA) return false
    if (selectedB && r.B !== selectedB) return false
    return true
  }), 'C')

  // if the currently selected value is no longer available, clear it
  // if there is exactly one available option, auto-select it.
  useEffect(() => {
    if (optionsA.length === 0) {
      if (selectedA) setSelectedA('')
    } else if (optionsA.length === 1) {
      if (selectedA !== optionsA[0]) setSelectedA(optionsA[0])
    } else {
      if (selectedA && !optionsA.includes(selectedA)) setSelectedA('')
    }

    if (optionsB.length === 0) {
      if (selectedB) setSelectedB('')
    } else if (optionsB.length === 1) {
      if (selectedB !== optionsB[0]) setSelectedB(optionsB[0])
    } else {
      if (selectedB && !optionsB.includes(selectedB)) setSelectedB('')
    }

    if (optionsC.length === 0) {
      if (selectedC) setSelectedC('')
    } else if (optionsC.length === 1) {
      if (selectedC !== optionsC[0]) setSelectedC(optionsC[0])
    } else {
      if (selectedC && !optionsC.includes(selectedC)) setSelectedC('')
    }
  }, [optionsA.join(','), optionsB.join(','), optionsC.join(',')])

  return (
    <div style={{ padding: 20 }}>
      <h2>Exercise 2 filterable selects + table</h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <label>A:
          <select value={selectedA} onChange={e => setSelectedA(e.target.value)}>
            {optionsA.length > 1 ? <option value="">Toate</option> : null}
            {optionsA.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>
        <label>B:
          <select value={selectedB} onChange={e => setSelectedB(e.target.value)}>
            {optionsB.length > 1 ? <option value="">Toate</option> : null}
            {optionsB.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </label>
        <label>C:
          <select value={selectedC} onChange={e => setSelectedC(e.target.value)}>
            {optionsC.length > 1 ? <option value="">Toate</option> : null}
            {optionsC.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </div>

      <table style={{ borderCollapse: 'collapse', width: '80%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 6 }}>#</th>
            <th style={{ border: '1px solid #ccc', padding: 6 }}>A</th>
            <th style={{ border: '1px solid #ccc', padding: 6 }}>B</th>
            <th style={{ border: '1px solid #ccc', padding: 6 }}>C</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map(r => (
            <tr key={r.id}>
              <td style={{ border: '1px solid #ccc', padding: 6 }}>{r.id}</td>
              <td style={{ border: '1px solid #ccc', padding: 6 }}>{r.A}</td>
              <td style={{ border: '1px solid #ccc', padding: 6 }}>{r.B}</td>
              <td style={{ border: '1px solid #ccc', padding: 6 }}>{r.C}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
