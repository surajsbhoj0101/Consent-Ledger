import Consumer from "../models/consumer.model.js";

export const editConsumerDetails = async (req, res) => {
  try {
    const { id, role } = req;
    console.log(id, ", Id and Role ,", role);

    if (role !== "consumer") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const { firstName, lastName, email, phone, address, bio } = req.body;

    const updateFields = {};

    if (firstName) updateFields["basicInformation.firstName"] = firstName;
    if (lastName) updateFields["basicInformation.lastName"] = lastName;
    if (email) updateFields["basicInformation.email"] = email;
    if (phone) updateFields["basicInformation.phone"] = phone;
    if (address) updateFields["basicInformation.address"] = address;
    if (bio) updateFields["basicInformation.bio"] = bio;

    updateFields["isRegistered"] = true;

    const updatedConsumer = await Consumer.findOneAndUpdate(
      { userId: id },
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedConsumer) {
      return res.status(404).json({
        success: false,
        message: "Consumer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Consumer details updated successfully",
      consumer: updatedConsumer,
    });
  } catch (error) {
    console.error("Edit consumer details error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getConsumerProfile = async (req, res) => {
  try {
    const { id, role } = req;

    if (role !== "consumer") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const consumer = await Consumer.findOne({ userId: id });

    if (!consumer) {
      return res.status(404).json({
        success: false,
        message: "Consumer not found",
      });
    }

    return res.status(200).json({
      success: true,
      consumer,
    });
  } catch (error) {
    console.error("Get consumer profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const uploadConsumerProfileImage = async (req, res) => {
  try {
    const { id, role } = req;

    if (role !== "consumer") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    const profileUrl = `/uploads/${req.file.filename}`;

    const updatedConsumer = await Consumer.findOneAndUpdate(
      { userId: id },
      { $set: { profileUrl } },
      { new: true },
    );

    if (!updatedConsumer) {
      return res.status(404).json({
        success: false,
        message: "Consumer not found",
      });
    }

    return res.status(200).json({
      success: true,
      profileUrl,
      consumer: updatedConsumer,
    });
  } catch (error) {
    console.error("Upload consumer profile image error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
