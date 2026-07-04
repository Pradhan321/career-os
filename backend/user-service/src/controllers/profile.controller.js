import Profile from "../models/Profile.js";

export const createProfile = async (req, res, next) => {
  try {
    const profile = await Profile.create(req.body);

    res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      userId: req.params.userId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
export const searchProfiles = async (req, res, next) => {
  try {
    const { skill } = req.query;

    const profiles = await Profile.find({
      "skills.name": {
        $regex: skill,
        $options: "i",
      },
    });

    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    next(error);
  }
};
export const updateProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      {
        userId: req.params.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOneAndDelete({
      userId: req.params.userId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const getProfiles = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const profiles = await Profile.find().skip(skip).limit(limit);

    const totalProfiles = await Profile.countDocuments();

    res.status(200).json({
      success: true,

      page,

      limit,

      totalProfiles,

      totalPages: Math.ceil(totalProfiles / limit),

      data: profiles,
    });
  } catch (error) {
    next(error);
  }
};
