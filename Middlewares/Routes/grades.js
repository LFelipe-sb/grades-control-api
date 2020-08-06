import express from 'express';
import { promises as fs } from 'fs';

const router = express.Router();

router.post('/', async(req, res) => {
    const dataFile = JSON.parse( await fs.readFile('grades.json'));
    const {student, subject, type, value} = req.body;
    const newStudent = {
        id: dataFile.nextId++,
        student: student,
        subject: subject,
        type: type,
        value: value,
        timestamp: new Date()
    }
    dataFile.grades.push(newStudent);
    await fs.writeFile('grades.json', JSON.stringify(dataFile, null, 2));
    res.send('Inserido com sucesso');
});

router.put('/', async(req, res) => {
    const dataFile = JSON.parse( await fs.readFile('grades.json'));
    const {student, subject, type, value} = req.body;
    const index = dataFile.grades.findIndex((item) => item.id === parseInt(req.body.id));

    dataFile.grades[index].student = student;
    dataFile.grades[index].subject = subject;
    dataFile.grades[index].type = type;
    dataFile.grades[index].value = value;
    dataFile.grades[index].timestamp = new Date();

    console.log(dataFile.grades[index])
    await fs.writeFile('grades.json', JSON.stringify(dataFile, null, 2));
    res.send('Alterado com sucesso')
});

router.delete('/:id', async(req, res) => {
    const dataFile = JSON.parse( await fs.readFile('grades.json'));
    dataFile.grades = dataFile.grades.filter((register) => register.id !== parseInt(req.params.id));
    await fs.writeFile('grades.json', JSON.stringify(dataFile, null, 2));
    res.send('Item excluido com sucesso.');
});

router.get('/:id', async(req, res) => {
    const dataFile = JSON.parse( await fs.readFile('grades.json'));
    const index = dataFile.grades.find((register) => register.id === parseInt(req.params.id) );
    res.send(index);
});

router.get('/', async(req, res) => {
    const dataFile = JSON.parse( await fs.readFile('grades.json'));
    delete dataFile.nextId;
    res.send(dataFile);
});

export default router;