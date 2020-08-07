import express from 'express';
import routesGrade from './Middlewares/Routes/grades.js';
import cors from 'cors';
import winston from 'winston';

const {timestamp, label, printf, combine} = winston.format;
const myFormat = printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] -> ${level}: ${message}`;
});

global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({filename: "grades-control-api.log"})
    ],
    format: combine(
        label({label: "my-bank-api"}),
        timestamp(),
        myFormat
    )
});

const app = express();
app.use(express.json());
app.use(cors());
app.use('/grades', routesGrade);

app.get('/', (req, res) => {
    res.send('caiu no / geral.');
});

try{
    app.listen(3001, () => {
        global.logger.info('API Started');
    });
} catch(err) {
    global.logger.error(err);
}