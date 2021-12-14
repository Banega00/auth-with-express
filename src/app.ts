import { json } from "body-parser";
import express from "express";
import * as router from "./router/router";
import { validateRequestPayload } from "./utils/validation/validator";
import { sendInvalidMethodResponse } from "./utils/wrappers/response-wrapper";

import * as redis from 'redis';
import connectRedis from 'connect-redis';
import { NextFunction, Request, Response } from "express";
import session from 'express-session';


//extending session type declaration to add our attributes
declare module 'express-session' {
  export interface SessionData {
    clientId: string;
    myNum:number;
  }
}

const app: express.Application = express();

//if you run behind a prox (e.g nginx)
// app.set('trust proxy',1)

const RedisStore = connectRedis(session);

//configure redis store
const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost',
})

app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: 'mySecret',//secret used to encrypt sessionID-s
    saveUninitialized: false,
    resave: false,//if we don't update session it won't be saved
    cookie: {
        secure: false, //if true browser will only send cookie over ssl/tls connection
        httpOnly: true, //prevent client side scripts to read cookie
        maxAge: 1000 * 60 * 30 //browser will delete cookie after this period expires
    }
}))

app.use(json({limit: "50mb", type: "application/json"}));

//Middleware for validating requests payload
app.use(validateRequestPayload);


//Middleware for login
app.post('/login', (request: Request, res: Response) =>{
    const {email, password} = request.body;

    //check if the credentials are correct
    //..

    //if credentials matches
    request.session.clientId = 'abc123'
    request.session.myNum = 5

})

//4. middleware that checks session validity

app.use((request: Request, response: Response, next: NextFunction)=>{
    if(!request.session || !request.session.clientId){

    }
})

//All routes that user can access if is logged in 

//Set routers
// app.use('/', router.ExampleRouter)
// app.use('/operation', routers.OperationsRouter);
// app.use('/internal', routers.InternalRouter);
// app.use('/report', routers.ReportsRouter);

app.use(sendInvalidMethodResponse);

export default app;