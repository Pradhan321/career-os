import Profile from "../models/Profile.js";

export const createProfile = async (req, res, next) => {
  try {
    const profile = await Profile.create({
      ...req.body,
      userId: req.user.id,
    });

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
export const textSearchProfiles = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    const profiles = await Profile.find(
      {
        $text: {
          $search: q,
        },
      },
      {
        score: {
          $meta: "textScore",
        },
      },
    ).sort({
      score: {
        $meta: "textScore",
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
export const filterProfiles = async (req, res, next) => {
  try {
    const {
      skill,
      location,
      proficiency,
      sort = "latest",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Filter by location
    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Filter by skill
    if (skill) {
      query["skills.name"] = {
        $regex: skill,
        $options: "i",
      };
    }

    // Filter by proficiency
    if (proficiency) {
      query["skills.proficiency"] = proficiency;
    }

    // Sorting
    let sortOption = {};

    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "headline":
        sortOption = { headline: 1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const profiles = await Profile.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const totalProfiles = await Profile.countDocuments(query);

    res.status(200).json({
      success: true,
      totalProfiles,
      totalPages: Math.ceil(totalProfiles / Number(limit)),
      currentPage: Number(page),
      data: profiles,
    });
  } catch (error) {
    next(error);
  }
};
