/* 3rd party middleware */
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

/* Logger setup */
const morgan = require("morgan");
const winston = require("./server/config/logger");

/* Serve gzip for smaller bundle size */
const expressStaticGzip = require("express-static-gzip");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("combined", { stream: winston.stream }));

app.use(
  "/",
  expressStaticGzip("client/build", {
    enableBrotli: true,
    orderPreference: ["br", "gz"],
    setHeaders: function (res, path) {
      res.setHeader("Cache-Control", "public, max-age=31536000");
    },
  })
);

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  winston.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  res.status(err.status || 500);
  res.render("error");
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Listening on port ${port}`));
