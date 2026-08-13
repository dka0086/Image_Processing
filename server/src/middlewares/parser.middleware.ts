import { Request, Response, NextFunction} from "express"

const setDeepValue = (path: string, obj: any, value: any) => {
  const tokens = path.split('.');
  const last = tokens.pop();
  for (const token of tokens) {
    if (!obj.hasOwnProperty(token)) {
      obj[token] = {};
    }
    obj = obj[token];
  }
  obj[last] = value;
}

const bodyParser = (req: Request, res: Response, next: NextFunction) => {
  let obj = {};
  for (const key in req.body) {
    setDeepValue(key, obj, req.body[key]);
  }
  req.body = obj;
  next();
});