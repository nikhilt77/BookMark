const express = require('express');
const cors = require('cors')
const routes = require('./routes');
const errorHandler = require('./middleware/errorMiddleware');
require('dotenv').config();
const { sequelize } = require('./config/database');
const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

//Error Handling
app.use(errorHandler)

//Database Connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connection successful.');
        sequelize.sync({alter: false}).then(() => {
            console.log('Database synced successfully');
             app.listen(port, () => {
                console.log(`Server listening on port ${port}`);
            });
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = app;
