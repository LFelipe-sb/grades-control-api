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
    res.send('Successfully inserted.');
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
    res.send('Successfully changed.')
});

router.delete('/:id', async(req, res) => {
    const dataFile = JSON.parse( await fs.readFile('grades.json'));
    dataFile.grades = dataFile.grades.filter((register) => register.id !== parseInt(req.params.id));
    await fs.writeFile('grades.json', JSON.stringify(dataFile, null, 2));
    res.send('Item successfully deleted.');
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

router.post('/studentMedia', async(req, res) => {
    const dataFile = JSON.parse(await fs.readFile('grades.json'));
    const {student, subject} = req.body;
    let sumValue = 0;
    dataFile.grades.forEach((eachStudent) => {
        if(eachStudent.student === student && eachStudent.subject === subject){
            sumValue += eachStudent.value;
        }
    });
    res.send(`Total sum of notes: ${sumValue}`);
});

router.post('/subjectMedia', async(req, res) => {
    const dataFile = JSON.parse( await fs.readFile('grades.json'));
    const {subject, type} = req.body;
    let sumValue = 0;
    let i = 0;
    dataFile.grades.forEach((eachStudent) => {
        if(eachStudent.subject === subject && eachStudent.type === type){
            sumValue += eachStudent.value;
            i++;
        }
    });
    res.send(`The average for this item is: ${sumValue/i}`);
});

router.post('/bestGrades', async(req, res) => {
    const dataFile = JSON.parse( await fs.readFile('grades.json'));
    const {subject, type} = req.body;
    const grades = [];
    dataFile.grades.forEach((eachStudent) => {
        if(eachStudent.subject === subject && eachStudent.type === type){
            grades.push(eachStudent.value);
        }
    });
    grades.sort((a, b) => b - a);
    res.send(`The best grades for this itens is: [${grades.slice(0,3)}]`);
});

export default router;