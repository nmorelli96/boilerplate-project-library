/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const mongoose = require("mongoose");

module.exports = function (app) {
  let bookSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      commentcount: Number,
      comments: Array,
    },
    { versionKey: false }
  );

  const Book = mongoose.model("Book", bookSchema);

  app
    .route("/api/books")
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await Book.find({});
        res.send(books);
        //console.log(books);
      } catch (err) {
        console.log(err);
      }
    })

    .post(async (req, res) => {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        res.send("missing required field title");
        return;
      }
      try {
        const newBook = await Book.create({
          title: title,
          commentcount: 0,
          comments: [],
        });
        res.json(newBook);
        //console.log(newBook);
      } catch (err) {
        console.log(err);
      }
    })

    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      try {
        const deleteBooks = await Book.deleteMany({});
        res.send("complete delete successful");
        //console.log(deleteBooks);
      } catch (err) {
        console.log(err);
      }
    });

  app
    .route("/api/books/:id")
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const book = await Book.findOne({ _id: bookid });
        if (!book) {
          res.send("no book exists");
        } else {
          res.json(book);
          //console.log(book);
        }
      } catch (err) {
        console.log(err);
      }
    })

    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment || !bookid) {
        res.send("missing required field comment");
      }
      try {
        const book = await Book.findOne({ _id: bookid });
        if (!book) {
          res.send("no book exists");
        } else {
          book.comments.push(comment);
          book.commentcount += 1;
          book.save();
          res.send(book);
          //console.log(book);
        }
      } catch (err) {
        console.log(err);
      }
    })

    .delete(async (req, res) => {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        const book = await Book.findOne({ _id: bookid });
        if (!book) {
          res.send("no book exists");
        } else {
          const deleteBook = await Book.deleteOne({ _id: bookid });
          res.send("delete successful");
          //console.log(deleteBook);
        }
      } catch (err) {
        console.log(err);
      }
    });
};
