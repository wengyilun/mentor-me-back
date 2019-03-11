// env access
require('dotenv').config();

// package imports
const express = require('express');
const bcrypt = require('bcryptjs');

// router extension
const router = express.Router();

// data imports
const posts = require('./post-model');
const users = require('../user/user-model');

// middleware
const { auth } = require('../auth/auth');
// const { checkRole } = require('../auth/checkRole'); // could use for admin panel if implemented

// incoming /api

// create post
router.post('/posts', auth, async (req, res) => {
  const { post, category, type, user_fk } = req.body;
  const newPost = req.body;

  if ((!post, !category, !type, !user_fk)) {
    res
      .status(400)
      .json({ message: 'Missing required field, please try again.' });
  }

  try {
    const post = await posts.add(newPost);
    if (post) {
      res.status(200).json({
        message: 'Post creation successful',
        post_id: post.id
        // FE may want more post content returned?
      });
    } else {
      res.status(500).json({ message: 'Post creation failure' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// get all posts
router.get('/posts', auth, (req, res) => {
  posts
    .get()
    .then(posts => {
      res.json({ posts });
    })
    .catch(err =>
      res
        .status(500)
        .json({ message: 'Internal server error or invalid token' })
    );
});

// get all questions
router.get('/questions', (req, res) => {
  posts
    .getQuestionsWithUsers()
    .then(questions => res.status(200).json(questions))

    //   })
    .catch(err =>
      res
        .status(500)
        .json({ message: 'Internal server error or invalid token' })
    );
});

// apply admin to this endpoint and move to restricted
router.delete('/posts/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const count = await posts.remove(id);
    if (count === 1) {
      res.status(202).json({ message: `Post successfully deleted` });
    } else {
      res
        .status(404)
        .json({ message: `No post with matching id, please try again.` });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// logout handles on client side, must destroy token
module.exports = router;
