import express from 'express';

const app = express();

const PORT = 3000;

app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hello and Welcome to DevTinder...");
})

app.get('/test', (req,res)=>{
    res.send("This is a testing route, Thank you!");
})

app.listen(PORT, ()=>{
    console.log(`Server is running on Port ${PORT}`);
})