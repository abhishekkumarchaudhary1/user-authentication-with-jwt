import express from 'express';
import {
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    fetchUserProfile,
    deleteUserAccount,
    userTestApi,
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

//userTestApi
router.get('/user-test-api', userTestApi)

// Change current password (requires authentication)
router.patch('/change-password', verifyJWT, changeCurrentPassword);

// Update account details (requires authentication)
router.patch('/update-details', verifyJWT, updateAccountDetails);

// Update user avatar (requires authentication)
router.patch("/update-avatar", verifyJWT, upload.single("avatar"), updateUserAvatar);

// Fetch user profile (requires authentication)
router.get('/profile', verifyJWT, fetchUserProfile);

// Delete user account (requires authentication)
router.delete('/delete-account', verifyJWT, deleteUserAccount);

export default router;
