import express from 'express';
import { getAllUsers,registerController,loginController } from '../controllers/userController.js';

//router object
const router = express.Router();

//get all user || get
router.get('/all-users',getAllUsers)

//create user || post
router.post('/register',registerController)

//login user || post
router.post('/login',loginController)

export default router;