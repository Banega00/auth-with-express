import * as express from 'express';

const app = express();

app.use(express.static('public'))

app.listen(4000)
console.log(`Server started on port ${4000}`)
