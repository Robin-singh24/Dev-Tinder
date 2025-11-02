import express from 'express';

const app = express();

const PORT = 3000;

app.use(express.json());


app.get('/user', (req, res) => {
    res.send({ firstName: "Robin", lastName: "Singh" });
})

app.post('/user', (req, res) => {
    const user = req.body;
    res.send(`User ${user.firstName} ${user.lastName} added successfully!`);
})

app.delete('/user', (req,res) => {
    res.send('User deleted successfully!!!');
})

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
})