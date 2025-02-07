import express from 'express'
import cors from 'cors'
import {recordMeeting, stopRecording} from './record'

const app = express()

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3000

app.get('/',(req,res)=>{
    res.json({msg:"hi server is running on shit"})
})
app.get('/stop',(req,res)=>{
    stopRecording()
    res.json({msg:"stopped the recording"})
})

app.post('/link',(req,res)=>{
    const {googleMeetUrl} = req.body
    recordMeeting(googleMeetUrl)
    res.status(200).json({url:googleMeetUrl})
})

app.listen(port,()=>{
    console.log('server is running on port 3000')
})