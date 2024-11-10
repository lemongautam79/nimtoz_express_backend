// const express = require('express');
// const morgan = require('morgan');
// const moment = require('moment');

import express from "express";
import moment from 'moment'
import morgan from "morgan";

const app = express();

// Define ANSI color codes for different status ranges
const statusColors = {
    1: '\x1b[35m', // Informational responses (1xx)
    2: '\x1b[32m', // Successful responses (2xx)
    3: '\x1b[36m', // Redirects (3xx)
    4: '\x1b[31m', // Client errors (4xx)
    5: '\x1b[33m', // Server errors (5xx)
};
const resetColor = '\x1b[0m';

// Custom logger middleware
export const customLogger = (req, res, next) => {
    // Define a custom log format function
    const customLogFormat = (tokens, req, res) => {
        const status = parseInt(tokens.status(req, res));

        // Determine the color based on the status code's first digit
        const statusCodeRange = Math.floor(status / 100);
        const statusColor = statusColors[statusCodeRange] || resetColor;

        // Get the original URL with query parameters
        const fullUrl = `${req.protocol}://${req.headers.host}${req.url}`;

        const statusMessage = res.statusMessage || '';
        // console.log(statusMessage)

        // Format the timestamp using moment
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss Z   ');

        // Format the log entry
        const logEntry = `${statusColor} ${timestamp}${ tokens.method(req, res)} ${fullUrl} - ${tokens.status(req, res)} : ${statusMessage} ${tokens['response-time'](req, res)}ms${resetColor}`;

        return logEntry;
    };

    // Use Morgan middleware with the custom log format
    morgan(customLogFormat)(req, res, next);
};



