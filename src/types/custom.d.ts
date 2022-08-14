declare namespace Express {
    export interface Request {
       user: {
        id: import('mongoose').Types.ObjectId;
       }
    }
 }