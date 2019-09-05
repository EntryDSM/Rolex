import * as express from 'express';
import request from 'request';
import Controller from '../interfaces/controller.interface';

class StudentController implements Controller {
  public path = '/students';
  public router = express.Router();
  private uri = 'https://api.entrydsm.hs.kr/api/v1/applicant/'

  constructor () {
    this.initializeRoutes();
  }

  private initializeRoutes () {
    this.router.get(`${this.path}/:email/document`, this.getOneStudent);
  }

  private getOneStudent = async (req: express.Request, res: express.Response) => {
    let data: object;
    await request.get(`${this.uri}${req.params.email}/document`, (error, response, body) => {
      if (error) console.log(error);
      data = JSON.parse(response.body);
      res.json(data);
    })
  }
}

export default StudentController;
