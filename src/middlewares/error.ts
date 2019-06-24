import { NextFunction, Request, Response } from 'express'
import HttpException from '../exceptions/HttpException'

function errorMiddleware (error: HttpException, req: Request, res: Response, next: NextFunction) {
  const status = error.status || 500
  const message = error.message || 'server error'
  res
        .status(status)
        .send({
          message,
          status
        })
}

export default errorMiddleware
