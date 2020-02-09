import express, { Application, Request, Response, NextFunction} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import Task from './models/Task';

class App {
    public express: Application;

    private tasks: Array<Task>;
    private requestTimes: number;

    public constructor () {
        this.express = express();
        this.middlewares();
        this.routes();

        this.tasks = [];
        this.requestTimes = 0;

    }

    private middlewares (): void {
        this.express.use(cors());
        this.express.use(bodyParser.json());
        this.express.use(this.onRequestCount.bind(this));
    }

    private onRequestCount (req: Request, res: Response, next: Function): void {
        this.requestTimes++;
        console.log(this.requestTimes);
        next();
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

        this.express.route('/projects/:id').put((req: Request, res: Response) => {
            const id = Number.parseInt(req.params.id);
            const title = req.body.title;

            if(title == undefined) res.status(400).send({"message": "you must send field title"}).json();

            let task = this.tasks.find( item => item.id == id);
            task.title = title;

            res.send(task).json();
        });

        this.express.route('/projects/:id').delete((req: Request, res: Response) => {
            const id = Number.parseInt(req.params.id);

            const index = this.tasks.findIndex( item => item.id == id);
            const task = this.tasks.splice(index, 1);

            res.send(task).json();
        });
    }
}

export default new App().express