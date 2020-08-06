import express from 'express';
import routesGrade from './Middlewares/Routes/grades.js';

const app = express();
app.use(express.json());

app.use('/grades', routesGrade);

app.get('/', (req, res) => {
    res.send('caiu no / geral.');
});


app.listen(3001, () => {
    console.log('API Stated.')
});