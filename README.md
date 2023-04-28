# express-react-redux-boilerplate

A boilerplate repo for getting started quickly

This repository contains both the backend and the frontend.

The backend uses express, with logging via morgan and winston

The frontend uses React with material-ui styles. Redux and React Router are also included in the packages.
The build is compiled into a .br file using brotli-webpack-plugin with fallback to gzip (.gz) or even the bundle itself if the browser does not support more modern features.

Both frontend and backend have Babel, ESLint, Prettier and EditorConfig set-up.
