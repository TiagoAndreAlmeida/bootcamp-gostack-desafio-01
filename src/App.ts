import express, { Application, Request, Response} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import Task from './models/Task';

class App {
    public express: Application;

    private tasks: Array<Task>;

    public constructor () {
        this.express = express();
        this.middlewares();
        this.routes();

        this.tasks = [];
    }

    private middlewares (): void {
        this.express.use(cors());
        this.express.use(bodyParser.json());
    }

    private routes (): void {
        //list all projects
        this.express.get('/', (req: Request, res: Response) => {
            res.send(this.tasks).json();
        });
        //create a new projects
        this.express.route('/projects').post((req: Request, res: Response) => {
            const id: number = req.body.id;
            const title: string = req.body.title;
            let tasks: Array<string> = req.body.tasks;
            
            //check if id or title are undefined
            if(id && title) {
                //check if field tasks are undefined
                tasks = tasks == undefined ? [] : tasks;

                let newTask = new Task(id, title, tasks);
                this.tasks.push(newTask);
                res.send(newTask).json();
            } else {
                res.status(400).send({"message": "you must send both fields id and title"}).json();
            }
        });
    }
}

export default new App().express