import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { MongoClient } from 'mongodb'

const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017'
const client = new MongoClient(mongoUrl)
let messages

async function boot() {
  await client.connect()
  const db = client.db('livechat')
  messages = db.collection('messages')
  console.log('Mongo connected')

  app.get('/api/messages', async (req, res) => {
    const docs = await messages.find({}).sort({ _id: -1 }).limit(100).toArray()
    res.json(docs)
  })

  io.on('connection', socket => {
    socket.on('message', async payload => {
      const doc = { text: payload.text, user: payload.user || 'anon', ts: new Date(), sentiment: score(payload.text) }
      await messages.insertOne(doc)
      io.emit('message', doc)
    })
  })

  const port = process.env.PORT || 4000
  server.listen(port, () => console.log('Server on ' + port))
}
boot().catch(err => { console.error(err); process.exit(1) })

function score(text='') {
  const pos = ['good','great','awesome','love','happy','nice','cool']
  const neg = ['bad','sad','angry','hate','terrible','worst']
  let s = 0
  const t = text.toLowerCase()
  pos.forEach(w => { if (t.includes(w)) s += 1 })
  neg.forEach(w => { if (t.includes(w)) s -= 1 })
  return s
}
