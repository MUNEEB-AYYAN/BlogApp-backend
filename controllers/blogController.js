import mongoose from "mongoose";
import blogModel from "../models/blogModel.js ";
import userModel from "../models/userModel.js";

// create blog controller
export const createBlogController = async (req, res) => {
    try {
        const { title,description,image,user } = req.body;

        //validation
        if(!title || !description || !image || !user){
            return res.status(400).json({
                success: false,
                message: 'Please provide all the fields'
            });
        }

        const existingUser = await userModel.findById(user);
        if(!existingUser){
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        const newBlog = new blogModel({title,description,image,user});
        const session = await mongoose.startSession();
        session.startTransaction();
        await newBlog.save({session});
        existingUser.blogs.push(newBlog);
        await existingUser.save({session});
        await session.commitTransaction();
        await newBlog.save();

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            newBlog
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: 'Error in creating blog',
            error
        });
        
    }
}


// get all blogs controller
export const getAllBlogsController = async (req, res) => {
    try {
        const blogs = await blogModel.find({});

        if(!blogs){
            return res.status(200).json({
                success: true,
                message: 'No blogs found'
            });
        }

        res.status(200).json({
            blogCount: blogs.length,
            success: true,
            message: 'Blogs fetched successfully',
            blogs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error in fetching blogs',
            error
        });
        
    }
}


// update blog controller
export const updateBlogController = async (req, res) => {
    try {
        const {id} = req.params;
        const {title,description,image} = req.body;
        const blog = await blogModel.findByIdAndUpdate(id,{title,description,image},{new:true});

        if(!blog){
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            blog
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error in updating blog',
            error
        });
}}


// ?+++++++++++++++++++++++++++++++=
// delete blog controller

export const deleteBlogController = async (req,res) =>{
    try {
        const blog = await blogModel.findOneAndDelete(req.params.id).populate('user')
        await blog.user.blogs.pull(blog);
        await blog.user.save();
        return res.status(200).send({
            success:true,
            message:'Blog Deleted',
        })
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success:false,
            message:"Error whille deleting blog",
            error
        })
    }
}



// get blog by id controller
export const userBlogController = async (req, res) => {
    try {
        const userBlog = await userModel.findById(req.params.id).populate('blogs');

        if(!userBlog){
            return res.status(404).json({
                success: false,
                message: 'Blog not found with this id'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Blog fetched successfully',
            userBlog
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error in fetching blog',
            error
        });
    }

}
