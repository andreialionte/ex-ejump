import { useState } from 'react'
import './App.css'

// poz init
const initialCirclePositions = {
  red: { left: 50, top: 200 },
  blue: { left: 220, top: 200 }
}

function App() {
  const [boardEl, setBoardEl] = useState(null)
  const [redEl, setRedEl] = useState(null)
  const [blueEl, setBlueEl] = useState(null)
  const [squareRedEl, setSquareRedEl] = useState(null)
  const [squareBlueEl, setSquareBlueEl] = useState(null)

  // starea cercurilor: pozitie + flag locked daca sunt plasate corect
  const [circles, setCircles] = useState({
    red: { ...initialCirclePositions.red, locked: false },
    blue: { ...initialCirclePositions.blue, locked: false }
  })

  
  const [drag, setDrag] = useState(null)

  function onPointerDown(e, id) {
    // ignora interactiunea daca cercul este blocat (d&d)
    if (circles[id].locked) return
    const el = id === 'red' ? redEl : blueEl
    if (!el) return
    e.currentTarget.setPointerCapture(e.pointerId)

    setDrag({
      id,
      startX: e.clientX,
      startY: e.clientY,
      origLeft: circles[id].left,
      origTop: circles[id].top,
      pointerId: e.pointerId
    })
  }

  function onPointerMove(e, id) {
    // actualizeaza pozitia in timpul tragere
    if (!drag || drag.id !== id) return
    const d = drag
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    setCircles(prev => ({ ...prev, [d.id]: { ...prev[d.id], left: d.origLeft + dx, top: d.origTop + dy } }))
  }

  function onPointerUp(e, id) {
    // la eliberare, verifica daca cercul e peste patratul potrivit
    if (!drag || drag.id !== id) return
    const circleEl = id === 'red' ? redEl : blueEl
    const squareEl = id === 'red' ? squareRedEl : squareBlueEl
    if (!circleEl || !squareEl || !boardEl) {
      setDrag(null)
      return
    }

    const cRect = circleEl.getBoundingClientRect()
    const sRect = squareEl.getBoundingClientRect()
    const bRect = boardEl.getBoundingClientRect()
    const cCenterX = cRect.left + cRect.width / 2
    const cCenterY = cRect.top + cRect.height / 2

  // daca centrul cercului este complet in interiorul patratului
  const inside = cCenterX >= sRect.left && cCenterX <= sRect.right && cCenterY >= sRect.top && cCenterY <= sRect.bottom

    if (inside) {
      // daca este corect plasat, il centram si blocheaza
      const centerLeft = (sRect.left - bRect.left) + (sRect.width - cRect.width) / 2
      const centerTop = (sRect.top - bRect.top) + (sRect.height - cRect.height) / 2
      setCircles(prev => ({ ...prev, [id]: { left: Math.round(centerLeft), top: Math.round(centerTop), locked: true } }))
    } else {
      // daca nu, reset la pozitia initiala
      setCircles(prev => ({ ...prev, [id]: { left: initialCirclePositions[id].left, top: initialCirclePositions[id].top, locked: false } }))
    }

    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch {}
    // resetam drag-ul ca nu mai e activ
    setDrag(null)
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Exercise 1 — Drag & Drop Circles</h2>
      <div id="board" ref={el => setBoardEl(el)} style={{ position: 'relative', width: 500, height: 320, border: '1px solid #ddd' }}>
        <div ref={el => setSquareRedEl(el)} className="square red" style={{ position: 'absolute', left: 50, top: 40, width: 140, height: 140, background: '#f44336' }} />
        <div ref={el => setSquareBlueEl(el)} className="square blue" style={{ position: 'absolute', left: 220, top: 40, width: 140, height: 140, background: '#2196f3' }} />

        <div
          ref={el => setRedEl(el)}
          className="circle red"
          onPointerDown={(e) => onPointerDown(e, 'red')}
          onPointerMove={(e) => onPointerMove(e, 'red')}
          onPointerUp={(e) => onPointerUp(e, 'red')}
          style={{ position: 'absolute', left: circles.red.left, top: circles.red.top, width: 70, height: 70, borderRadius: '50%', background: '#ff7961', touchAction: 'none', cursor: circles.red.locked ? 'default' : 'grab' }}
        />

        <div
          ref={el => setBlueEl(el)}
          className="circle blue"
          onPointerDown={(e) => onPointerDown(e, 'blue')}
          onPointerMove={(e) => onPointerMove(e, 'blue')}
          onPointerUp={(e) => onPointerUp(e, 'blue')}
          style={{ position: 'absolute', left: circles.blue.left, top: circles.blue.top, width: 70, height: 70, borderRadius: '50%', background: '#90caf9', touchAction: 'none', cursor: circles.blue.locked ? 'default' : 'grab' }}
        />
      </div>
      <p style={{ marginTop: 12 }}>Drag the circles. Drop them over the matching square to lock them centered; otherwise they return.</p>
    </div>
  )
}

export default App
