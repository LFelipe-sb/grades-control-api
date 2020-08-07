import express from 'express';
import { promises as fs } from 'fs';

const router = express.Router();

router.post('/', async(req, res, next) => {
    try{
        const dataFile = JSON.parse( await fs.readFile('grades.json'));
        const {student, subject, type, value} = req.body;

        if((!student) || (!subject) || (!type) || (!value)){
            throw new Error('"student", "subject", "type" AND "value" is required.')
        }

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
    } catch(err) {
        next(err);
    }
});

router.put('/', async(req, res, next) => {
    try{
        const dataFile = JSON.parse( await fs.readFile('grades.json'));
        const {student, subject, type, value} = req.body;
        const index = dataFile.grades.findIndex((item) => item.id === parseInt(req.body.id));

        if (index === -1) {
            throw new Error('Register not found');
        } else if((!student) || (!subject) || (!type) || (!value)){
            throw new Error('"student", "subject", "type" AND "value" is required.')
        }

        dataFile.grades[index].student = student;
        dataFile.grades[index].subject = subject;
        dataFile.grades[index].type = type;
        dataFile.grades[index].value = value;
        dataFile.grades[index].timestamp = new Date();

        await fs.writeFile('grades.json', JSON.stringify(dataFile, null, 2));
        res.send('Successfully changed.');
    } catch(err) {
        next(err);
    }
});

router.delete('/:id', async(req, res, next) => {
    try{
        const dataFile = JSON.parse( await fs.readFile('grades.json'));
        dataFile.grades = dataFile.grades.filter((register) => register.id !== parseInt(req.params.id));
        
        const index = dataFile.grades.findIndex((item) => item.id === parseInt(req.body.id));

        if (index === -1) {
            throw new Error('Register not found');
        }
        
        await fs.writeFile('grades.json', JSON.stringify(dataFile, null, 2));
        res.send('Item successfully deleted.');
    } catch(err) {
        next(err);
    }
});

router.get('/:id', async(req, res, next) => {
    try{
        const dataFile = JSON.parse( await fs.readFile('grades.json'));
        const index = dataFile.grades.find((register) => register.id === parseInt(req.params.id) );

        if (index === -1 || typeof index === "undefined") {
            throw new Error('Register not found');
        }

        res.send(index);
    } catch(err) {
        next(err);
    }
});

router.get('/', async(_req, res, next) => {
    try{
        const dataFile = JSON.parse( await fs.readFile('grades.json'));
        delete dataFile.nextId;
        res.send(dataFile);
    } catch(err) {
        next(err);
    }
});

router.post('/studentMedia', async(req, res, next) => {
    try {
        const dataFile = JSON.parse(await fs.readFile('grades.json'));
        const {student, subject} = req.body;

        if((!student) || (!subject)){
            throw new Error('"student" AND "subject" is required.')
        }

        let sumValue = 0;
        dataFile.grades.forEach((eachStudent) => {
            if(eachStudent.student === student && eachStudent.subject === subject){
                sumValue += eachStudent.value;
            }
        });
        res.send(`Total sum of notes: ${sumValue}`);
    } catch(err) {
        next(err);
    }
});

router.post('/subjectMedia', async(req, res, next) => {
    try{
        const dataFile = JSON.parse( await fs.readFile('grades.json'));
        const {subject, type} = req.body;
    
        if((!subject) || (!type)){
            throw new Error('"subject" AND "type" is required.')
        }
        
        let sumValue = 0;
        let i = 0;
        dataFile.grades.forEach((eachStudent) => {
            if(eachStudent.subject === subject && eachStudent.type === type){
                sumValue += eachStudent.value;
                i++;
            }
        });
        res.send(`The average for this item is: ${sumValue/i}`);
    } catch(err) {
        next(err);
    }
});

router.post('/bestGrades', async(req, res, next) => {
    try{
        const dataFile = JSON.parse( await fs.readFile('grades.json'));
        const {subject, type} = req.body;

        if((!subject) || (!type)){
            throw new Error('"subject" AND "type" is required.')
        }

        const grades = [];
        dataFile.grades.forEach((eachStudent) => {
            if(eachStudent.subject === subject && eachStudent.type === type){
                grades.push(eachStudent.value);
            }
        });
        grades.sort((a, b) => b - a);
        res.send(`The best grades for this itens is: [${grades.slice(0,3)}]`);
    } catch(err) {
        next(err);
    }
});

router.use((err, req, res, _next) => {
    res.status(500).send('An error has occurred. ' + err);
});

export default router;