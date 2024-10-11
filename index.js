const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const port = 3000;

app.use(express.json());

let entries = [];

/**
 * @swagger
 * /drawn:
 *   get:
 *     summary: Drawn from entries
 *     responses:
 *       200:
 *         description: A random number from all entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 randomIndex:
 *                   type: integer
 *                 randomValue:
 *                   type: integer
 *                 entries:
 *                   type: array
 *                   items:
 *                     type: integer
 */
app.get('/drawn', (req, res) => {
    const randomIndex = Math.floor(Math.random() * entries.length);
    const randomValue = entries[randomIndex];
    res.json({ randomIndex: randomIndex + 1, randomValue : randomValue, entries: entries });
});

/**
 * @swagger
 * /drawn:
 *   put:
 *     summary: Drawn from given entries
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entries:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: A random number from given entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 randomValue:
 *                   type: integer
 *       400:
 *         description: Invalid array parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
app.put('/drawn', (req, res) => {
    const givenEntries = req.body.entries;
    if (!Array.isArray(givenEntries) || givenEntries.some(isNaN)) {
        return res.status(400).json({ error: 'Invalid array parameter' });
    }
    const randomIndex = Math.floor(Math.random() * givenEntries.length);
    const randomValue = givenEntries[randomIndex];
    res.json({ randomIndex: randomIndex + 1, randomValue : randomValue, entries: givenEntries });
});

/**
 * @swagger
 * /entry:
 *   post:
 *     summary: Add a new entry randomly
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               max:
 *                 type: integer
 *     responses:
 *       200:
 *         description: A unique random number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 randomNumber:
 *                   type: integer
 *       400:
 *         description: Invalid max parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
app.post('/entry', (req, res) => {
    const max = parseInt(req.body.max, 10);
    if (isNaN(max) || max < 1) {
        return res.status(400).json({ error: 'Invalid max parameter' });
    }

    if (entries.length >= max) {
        return res.status(400).json({ error: 'All numbers have been drawn' });
    }

    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * max) + 1;
    } while (entries.includes(randomNumber));

    entries.push(randomNumber);
    res.status(201).json({ entry: randomNumber });
});

/**
 * @swagger
 * /entries:
 *   get:
 *     summary: List all entries
 *     responses:
 *       200:
 *         description: All entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entries:
 *                   type: array
 *                   items:
 *                     type: integer
 */
app.get('/entries', (req, res) => {
    res.json({ entries });
});

/**
 * @swagger
 * /entries:
 *   delete:
 *     summary: Delete all entries
 *     responses:
 *       200:
 *         description: All entries have been deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entries:
 *                   type: array
 *                   items:
 *                     type: integer
 */
app.delete('/entries', (req, res) => {
    entries = [];
    res.json({ entries });
});

/**
 * @swagger
 * /uniqueRandom:
 *   get:
 *     summary: Get a unique random number between 1 and max
 *     parameters:
 *       - in: query
 *         name: max
 *         schema:
 *           type: integer
 *         required: true
 *         description: The maximum number for the random draw
 *     responses:
 *       200:
 *         description: A unique random number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 randomNumber:
 *                   type: integer
 *       400:
 *         description: Invalid max parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
app.get('/uniqueRandom', (req, res) => {
    const max = parseInt(req.query.max, 10);
    if (isNaN(max) || max < 1) {
        return res.status(400).json({ error: 'Invalid max parameter' });
    }

    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * max) + 1;
    } while (entries.includes(randomNumber));

    entries.push(randomNumber);
    res.json({ randomNumber });
});

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Random Number API',
            version: '1.0.0',
            description: 'API for generating random numbers',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
    },
    apis: ['./index.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

module.exports = app;