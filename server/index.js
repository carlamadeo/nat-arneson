import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createEvent, getFreeBusy } from './googleCalendar.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.post('/api/book', async (req, res) => {
  try {
    const { summary, start, end, attendees } = req.body
    const event = await createEvent({ summary, start, end, attendees })
    res.json(event)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create event' })
  }
})

app.post('/api/freebusy', async (req, res) => {
  try {
    const { start, end } = req.body
    const fb = await getFreeBusy({ timeMin: start, timeMax: end })
    res.json(fb) // { busy: [...] }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get free/busy' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API listening on :${PORT}`))
