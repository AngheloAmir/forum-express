import cookieParser from 'cookie-parser';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
const app = express();
import mainroutes from './routes';

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/
import cors from 'cors';
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//import helmet from 'helmet';
//if (process.env.NODE_ENV === 'production') {
//    app.use(helmet()); 
//}

app.use('/', mainroutes);

import StatusCodes from 'http-status-codes';
const { BAD_REQUEST } = StatusCodes;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(BAD_REQUEST);
    return res.json({
        error: err.message,
    });
});

//connect to database
import Mongoose from 'mongoose';
import Logger from 'jet-logger';
const logger = new Logger();
Mongoose.connect( '' + process.env.DB_CONNECTION,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => logger.info('Connection to database successfull')
);
const db = Mongoose.connection;
db.on('error', (err) => logger.err(`Error connecting to database: ` + err));

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/
const viewsDir = path.join(__dirname, 'views');
const staticDir = path.join(__dirname, 'public');
app.set('views', viewsDir);
app.use(express.static(staticDir));

//do note that the address is made to make a little harder for anyone to find out the
//site address of the admin panel. The link should not be given.
app.get('/admin/panel/owo', (req: Request, res: Response) => {
    res.sendFile('/OwOAdmin/adminindex.html', {root: viewsDir});
});

app.get('*', (req: Request, res: Response) => {
    res.sendFile('index.html', {root: viewsDir});
});

export default app;
