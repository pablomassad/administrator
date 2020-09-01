const express = require('express');
// const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
// const server = app.router();
const io = require('socket.io');

const PORT = process.env.PORT_SERVER || 9000;
const NODE_ENV = process.env.NODE_ENV || 'development';
app.set('port', PORT);
app.set('env', NODE_ENV);

app.use(cors());
// app.use(express.json());
app.use(bodyParser.json());
const urlRoutes = path.join(__dirname, 'routes/intentions');
console.log('urlRoutes: ', urlRoutes);
app.use('/', require(urlRoutes));
app.use((req, res, next) => {
  const err = new Error(`${req.method} ${req.url} Not Found`);
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});
app.listen(PORT, () => console.info(`Server is running at: ${PORT}`));
