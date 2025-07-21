import express, { Response, ErrorRequestHandler } from "express";
import helmet from 'helmet';
import cors from 'cors';
import router from './routes';
import { env } from './env';
import { ZodError } from 'zod';

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());
app.use('/', router);

const errorHandler: ErrorRequestHandler = (err, _, res: Response ) => {
  if (err instanceof ZodError) {
    res.status(400).json({ message: "Validation error", issue: err.format() })
  }

  if(env.NODE_ENV !== "production") {
    console.log(err);
  }

  res.status(500).json({ message: "Internal server error" })
  return;
}

app.use(errorHandler);

app.listen(env.PORT, () => {
    console.log(`Server is running on ${env.BASE_URL}`)
})