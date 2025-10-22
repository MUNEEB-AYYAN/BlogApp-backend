import express from 'express'

import {
     getAllBlogsController, 
     createBlogController, 
     updateBlogController, 
     deleteBlogController, 
     userBlogController 
    } from '../controllers/blogController.js';

const router = express.Router();

// Get all blogs
router.get('/all-blogs', getAllBlogsController);

// Create a new blog
router.post('/create-blog', createBlogController);

// Update a blog
router.put('/update-blog/:id', updateBlogController);

// Delete a blog
router.delete('/delete-blog/:id', deleteBlogController);

// Get a blog by ID
router.get('/user-blog/:id', userBlogController);


export default router;