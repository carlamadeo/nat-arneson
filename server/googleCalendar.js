
import { google } from 'googleapis'
import dotenv from 'dotenv'
dotenv.config()

function getAuth() {
  return new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/calendar']
  )
}

const calendar = google.calendar('v3')

export async function createEvent({ summary, start, end, attendees = [] }) {
  const auth = getAuth()
  const res = await calendar.events.insert({
    auth,
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    requestBody: {
      summary,
      start: { dateTime: start, timeZone: process.env.TIMEZONE || 'UTC' },
      end:   { dateTime: end,   timeZone: process.env.TIMEZONE || 'UTC' },
      attendees
    }
  })
  return res.data
}

export async function getFreeBusy({ timeMin, timeMax }) {
  const auth = getAuth()
  const res = await calendar.freebusy.query({
    auth,
    requestBody: {
      timeMin,
      timeMax,
      items: [{ id: process.env.GOOGLE_CALENDAR_ID }],
    }
  })
  // Shape into { busy: [...] }
  const calendars = res.data.calendars || {}
  const firstKey = Object.keys(calendars)[0]
  const busy = firstKey ? (calendars[firstKey].busy || []) : []
  return { busy }
}
