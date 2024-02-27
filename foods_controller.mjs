import 'dotenv/config.js';
import * as foods from './foods_model.mjs';
import express from 'express';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.post('/foods', (req, res) => {
    foods.createFoods(req.body.name, req.body.quantity, req.body.calories, req.body.mood, req.body.date)
    .then(food => { 
        res.status(201).json(food);
    })
    .catch(error => {
        console.error(error);
        res.status(400).send({ Error: "Request Failed" });
    })
});


app.get('/foods/:_id', (req, res) => {
    const foodID = req.params._id;
    foods.findFoodsByID(foodID)
        .then(food => {
            if (food !== null) {
                res.status(200); 
                res.json(food);
            } else {
                res.status(404).json({ Error: 'Resource Not Found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Resource Not Found' });
        });
});

/**
 * Retrieve food items. 
 */
//change this
app.get('/foods', (req, res) => {
    let filter = {}; 
    if (req.query.name !== undefined){
        filter = { name: req.query.name };
    }
    foods.findFoods(filter)
        .then(foundFoods => { 
            res.status(200); 
            res.json(foundFoods); 
        })
        .catch(error => { 
            console.error(error);
            res.status(500).json({ Error: "Internal Server Error" });
        });
});


app.put('/foods/:_id', (req, res) => {
    foods.replaceFood(req.params._id, req.body.name, req.body.quantity, req.body.calories, req.body.mood, req.body.date)
        .then(numUpdated => {
            if (numUpdated === 1) {
                res.status(200);
                res.json({ _id: req.params._id, name: req.body.name, quanitity: req.body.quanitity, calories: req.body.calories, mood: req.body.mood, date: req.body.date })
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed' });
        });
});


/**
 * Delete the food item whose id is provided in the query parameters
 */
app.delete('/foods/:_id', (req, res) => {
    foods.deleteFoodById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});