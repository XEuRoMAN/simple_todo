module.exports = function (mongoose) {
    var validations = {
        deleted: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },
        title: {
            type: String,
            trim: true,
            maxlength: [
                64,
                'Maximum allowed length of ToDo title is ({MAXLENGTH}) symbols!'
            ],
            required: 'ToDo title is required!'
        }
    };
    var options = {
        versionKey: false // mongoose adds "__v" property into every item if this is undefined or true.
    };
    var schema = new mongoose.Schema(validations, options);

    mongoose.model('todo', schema);
};