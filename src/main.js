import './style.css'

import './style.css'

const form = document.getElementById('form')
const dayInput = document.getElementById('day')
const monthInput = document.getElementById('month')
const yearInput = document.getElementById('year')
const inputs = [dayInput, monthInput, yearInput]

// Show or clear an error on one field
function setError(input, message) {
  const group = input.closest('.group')
  group.dataset.error = message ? 'true' : 'false'
  group.querySelector('.error').textContent = message
}

// Returns true only if everything is valid
function validate() {
  let valid = true
  inputs.forEach((i) => setError(i, ''))

  // 1. Empty fields
  inputs.forEach((i) => {
    if (i.value.trim() === '') {
      setError(i, 'This field is required')
      valid = false
    }
  })
  if (!valid) return false

  const d = Number(dayInput.value)
  const m = Number(monthInput.value)
  const y = Number(yearInput.value)
  const today = new Date()

  // 2. Range checks
  if (!(d >= 1 && d <= 31)) { setError(dayInput, 'Must be a valid day'); valid = false }
  if (!(m >= 1 && m <= 12)) { setError(monthInput, 'Must be a valid month'); valid = false }
  if (!(y >= 1 && y <= today.getFullYear())) { setError(yearInput, 'Must be in the past'); valid = false }
  if (!valid) return false

  // 3. Does the date really exist? (e.g. 31/04 doesn't)
  const date = new Date(y, m - 1, d)
  if (date.getDate() !== d || date.getMonth() !== m - 1) {
    setError(dayInput, 'Must be a valid date')
    setError(monthInput, ' ')
    setError(yearInput, ' ')
    return false
  }

  // 4. Future date this year?
  if (date > today) {
    setError(dayInput, 'Must be in the past')
    setError(monthInput, ' ')
    setError(yearInput, ' ')
    return false
  }

  return true
}

// Calculate years, months, days
function calculateAge(d, m, y) {
  const today = new Date()
  let years = today.getFullYear() - y
  let months = today.getMonth() + 1 - m
  let days = today.getDate() - d

  if (days < 0) {
    months--
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }
  return { years, months, days }
}

// Count-up animation
function animate(el, target) {
  const duration = 800
  const start = performance.now()
  function step(now) {
    const progress = Math.min((now - start) / duration, 1)
    el.textContent = Math.floor(progress * target)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  if (!validate()) {
    ;['years', 'months', 'days'].forEach((id) => {
      document.getElementById(id).textContent = '--'
    })
    return
  }

  const { years, months, days } = calculateAge(
    Number(dayInput.value),
    Number(monthInput.value),
    Number(yearInput.value)
  )

  animate(document.getElementById('years'), years)
  animate(document.getElementById('months'), months)
  animate(document.getElementById('days'), days)
})