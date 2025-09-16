"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");
require("dotenv/config");
var database_1 = require("./src/config/database");
var voteRoutes_1 = require("./src/routes/voteRoutes");
var userRoutes_1 = require("./src/routes/userRoutes");
var stateRoutes_1 = require("./src/routes/stateRoutes");
// Initialize database and tables
(0, database_1.initializeDatabase)();
require("dotenv").config({ path: "./.env.local", override: true });
var app = express();
var port = process.env.PORT || 8000;
app.use(express.json());
app.use(cookieParser());
// CORS setup
var allowedOrigins = [
    'http://localhost:5173',
    "http://localhost:8000",
    "http://localhost:4173",
    'https://lolacine-3d94c.web.app/',
    'https://lolacine.ghostix.com.ar',
    'https://lolacine-3d94c.web.app',
    'https://lolacine-3d94c.web.app/admin',
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
// Register routes
app.use('/', stateRoutes_1.default);
app.use('/', userRoutes_1.default);
app.use('/', voteRoutes_1.default);
// Start server
app.listen(port, function () {
    console.log("Server running at http://localhost:".concat(port));
});
