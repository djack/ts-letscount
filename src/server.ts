import express, { Request, Response } from 'express';
import db from './database/db';
import CountRow from "./database/interfaces"
import CountResponse from "./interfaces/ResponseInterfaces"
import internal from "stream";

const app = express();
const port = 3000;

const notFoundResponse: CountResponse = {err: "Not Found", data: null};
const badStrings: CountResponse = {err: "Namespace and Counter must both be nonempty and less than 64 characters long.", data: null};

app.get('/:namespace/:counter', (req: Request, res: Response<CountResponse>) => {
  const { namespace, counter } = req.params;
  if (namespace.length > 64 || counter.length > 64 || namespace.length < 1 || counter.length < 1) {
    return res.status(400).send(badStrings);
  }
  
  const selectStmt = db.prepare("SELECT namespace, counter, count from counts where namespace = ? and counter = ?");
  const result: CountRow = selectStmt.get(namespace, counter)
  if (result) {
    const response: CountResponse = {
      err: "",
      data: Array(result)
    };
    res.json(response);
  } else {
    res.status(404).send(notFoundResponse);
  }
});

app.get('/:namespace/', (req: Request, res: Response<CountResponse>) => {
  const { namespace, counter } = req.params;
  if (namespace.length > 64 || namespace.length < 1 ) {
    return res.status(400).send(badStrings);
  }

  const selectStmt = db.prepare("SELECT namespace, counter, count from counts where namespace = ?");
  const results: CountRow[] = selectStmt.all(namespace)
  if (results) {
    const response: CountResponse = {
      err: "",
      data: results
    };
    res.json(response);
  } else {
    res.status(404).send(notFoundResponse);
  }
});

app.put('/:namespace/:counter', (req: Request, res: Response<CountResponse>) => {
  const { namespace, counter } = req.params;
  if (namespace.length > 64 || counter.length > 64 || namespace.length < 1 || counter.length < 1) {
    return res.status(400).send(badStrings);
  }
  
  const updateStmt = db.prepare("INSERT INTO counts VALUES (?, ?, 1)\
                               ON CONFLICT DO UPDATE SET count = count + 1\
                               RETURNING namespace, counter, count");
  const result: CountRow = updateStmt.get(namespace, counter)
  if (result) {
    const response: CountResponse = {
      err: "",
      data: Array(result)
    };
    res.json(response);
  } else {
    res.status(404).send(notFoundResponse);
  }
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});