import express from 'express';
import {
    authTestApi,
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
} from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

//authTestApi
router.get('/auth-test-api', authTestApi)

// User registration
router.post("/register", upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
]), registerUser);


// User login
router.post('/login', loginUser);

// User logout (requires authentication)
router.post('/logout', verifyJWT, logoutUser);

// Refresh access token
router.post('/refresh-token', refreshAccessToken);

export default router;
