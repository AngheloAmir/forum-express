/*
    https://galavtg.herokuapp.com/
*/
import '../env/startInitEnv';
import app from './Server';
import Logger from 'jet-logger';
const logger = new Logger();


const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
