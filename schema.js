 import mongoose from 'mongoose';
  const { Schema } = mongoose;

  const blogSchema = new Schema({
	  address:  {building: String, street: String },
	  cuisine: String,
	  grades:[{date:q}]
    author: String,
    body:   String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
      votes: Number,
      favs:  Number
    }
  });
