import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

//userTestApi
const userTestApi = asyncHandler(async(req, res)=> {
    return res.status(201).json(new ApiResponse(201, "User is working correctly"));
})

// Change current password
const changeCurrentPassword = asyncHandler( async(req, res) => {
    const { oldPassword, newPassword } = req.body
    console.log(`old password: ${oldPassword}, new password: ${newPassword}`);
    

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")

    }

    user.password = newPassword
    await user.save({validationBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))


})

// Update account details (fullName, email)
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
        throw new ApiError(400, "Full name and email are required");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.fullName = fullName;
    user.email = email;
    await user.save();

    const updatedUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(200, updatedUser, "Account details updated successfully"));
});

// Update user avatar
const updateUserAvatar = asyncHandler(async(req, res) => {
    try {
        const avatarLocalPath = await req.file?.path
    
        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is missing")
        }
    
        const avatar = await uploadOnCloudinary(avatarLocalPath)
    
        if (!avatar.url) {
            throw new ApiError(400, "Error while uploading on cloudinary")
        }
    
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    avatar: avatar.url    
                }
            },
            {new: true}
        ).select("-password")
    
        return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Avatar Image updated successfully")
        )
    } catch (error) {
        console.log("Error while updating avatar:: ", error)
    }
})

// Fetch user profile
const fetchUserProfile = asyncHandler( async(req, res) => {
    
    if (!req.user) {
        throw new ApiError(404, "User not found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfuly"))
})
    // const user = await User.findById(req.user._id).select("-password -refreshToken");


// Delete user account
const deleteUserAccount = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "User account deleted successfully"));
});

export {
    userTestApi,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    fetchUserProfile,
    deleteUserAccount,
};
