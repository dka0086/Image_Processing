import express from "express"
import cors from "cors"
import {routes} from "./routes"

const PORT = 3333
const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)
app.use(session({
  secret: 'senhasecreta123',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

function session(arg0: {
    secret: string; resave: boolean; saveUninitialized: boolean; cookie: { secure: boolean; maxAge: number } // 24 hours
}): any {
    throw new Error("Function not implemented.")
}
