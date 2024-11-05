import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoute from './routes/auth.route.js';
import postRoute from './routes/post.route.js';
import testRoute from './routes/test.route.js';
const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/test", testRoute);
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
