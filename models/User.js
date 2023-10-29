import "dotenv/config";
import mongoose from "mongoose";

const MAX_ITEMS = 10;

function validateTrackedItems(trackedItems) {
    return trackedItems.length <= MAX_ITEMS;
}

const UserSchema = new mongoose.Schema({
    _id: String,
    trackedItems: {
        type: [String],
        validate: [validateTrackedItems, `Cannot store more than ${MAX_ITEMS} items.`]
    }
})

UserSchema.methods.addItem = function(itemHash) {
    this.trackedItems.addToSet(itemHash);
    return this.save();
}

UserSchema.methods.removeItem = function(itemHash) {
    this.trackedItems.remove(itemHash);
    return this.save();
}

const User = new mongoose.model("User", UserSchema);

export default User;