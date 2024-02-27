import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);


// Connect to to the database
const db = mongoose.connection;
// The open event is called when the database connection successfully opens
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

/**
 * Define the schema
 */
const foodSchema = mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    calories: { type: Number, required: true },
    mood: {type: String, required: true },
    date: {type: String, required: true,  
        validate: {
        validator: function(value) {
            const dateFormat = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{2}$/;
            return dateFormat.test(value);
        },
        message: "Invalid date format. Please use MM-DD-YY format, e.g., 07-30-21."
    }}
},{ collection: 'myFoodCollection' });

/**
 * Compile the model from the schema. This must be done after defining the schema.
 */
const Food = mongoose.model("Food", foodSchema);

const createFoods = async (name, quantity, calories, mood, date) => {
   
    if (calories <= 0) {
        throw new Error("Calories must be greater than 0.");
    }

    if (quantity <= 0) {
        throw new Error("Quantity must be greater than 0.");
    }

    // if(mood != "lethargic" || mood != "energized" || mood != "hangry"){
    //     throw new Error("Mood must be either lethargic, energized, or hangry");
    // }

    const dateFormat = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{2}$/; 
    if (!date.match(dateFormat)) {
        throw new Error("Invalid date format. Please use MM-DD-YY format, e.g., 07-30-21.");
    }
    const food = new Food({ name: name, quantity: quantity, calories: calories, mood: mood, date: date });
    return food.save();
}

const findFoods = async(filter, projection, limit) => { 
    const query = Food.find(filter)
        .select(projection)
        .limit(limit); 
    return query.exec(); 
}

const findFoodsByID = async (_id) => {
    const query = Food.findById(_id); // Use findById instead of find
    return query.exec();
}

const replaceFood = async(_id, name, quantity, calories, mood, date) => {
    if (quantity <= 0) {
        throw new Error("Weight must be greater than 0.");
    }
    
    if (calories <= 0) {
        throw new Error("Calories must be greater than 0.");
    }

    if (typeof name !== 'string' || typeof quantity !== 'number' || typeof calories !== 'number' || typeof mood !== 'string' || typeof date !== 'string') {
        throw new Error("Invalid parameter types.");
    }

    const dateFormat = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{2}$/; 
    if (!date.match(dateFormat)) {
        throw new Error("Invalid date format. Please use MM-DD-YY format, e.g., 07-30-21.");
    }

    const result = await Food.replaceOne({ _id: _id }, { name: name, quantity: quantity, calories: calories, mood: mood, date: date }); 
    console.log(result);
    return result.modifiedCount; 
}


const deleteFoodById = async (_id) => {
    try {
        const result = await Food.deleteOne({ _id });
        return result.deletedCount;
    } catch (error) {
        throw error;
    }
};

export { createFoods, findFoodsByID, findFoods, replaceFood, deleteFoodById};