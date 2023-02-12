// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const db = {
  'ph': [7.0, 7.4, 7.8, 8.2, 8.6, 9.0, 9.2, 9.6, 10.0],
  'ammonia': [0.7, 1.7, 4.2, 11.0, 21.8, 41.2, 63.8, 81.6, 87.5]
}

type Data = {
  error?: string
  data?: {
    ammonia: number
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // let ph = parseInt(req.query.ph)
  if (typeof req.query.ph === 'undefined') {
    res.status(400).json({ error: 'pass a valid ph value' })
  }
  if (typeof req.query.ph !== 'string') {
    res.status(400).json({ error: 'pass a valid ph value' })
  } else {
    if (isNaN(parseFloat(req.query.ph))) {
      res.status(400).json({ error: 'pass a valid ph value' })
    }
    let ph = parseFloat(req.query.ph)
    if (ph < 7 || ph > 10) {
      res.status(400).json({ error: 'The value must be between 7 to 10' })
    }

    if (ph == 7) {
      res.status(200).json({ data: { ammonia: db['ammonia'][0] } })
    } else if (ph == 10) {
      res.status(200).json({ data: { ammonia: db['ammonia'][db['ammonia'].length - 1] } })
    } else {

      let before = 0
      let after = 0
      for (let i = 0; i < db['ph'].length; i++) {
        if (db['ph'][i] < ph) {
          before = i
        } else {
          after = i
          break
        }
      }
      let slope = (db['ammonia'][after] - db['ammonia'][before]) / (db['ph'][after] - db['ph'][before])
      let ammonia = slope * (ph - db['ph'][before]) + db['ammonia'][before]
      res.status(200).json({ data: { ammonia: ammonia } })
    }
  }
}
