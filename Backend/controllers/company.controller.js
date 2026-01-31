import Company from "../models/company.model.js";
import companyUserModel from "../models/companyUser.model.js";

export const editCompanyDetails = async (req, res) => {
  try {
    const { id, role } = req;
    console.log(id, ", Id and Role ,", role);

    if (role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const { name, email, website, phone, address, industry, description } =
      req.body;

    const updateFields = {};

    if (name) updateFields["basicInformation.name"] = name;
    if (email) updateFields["basicInformation.email"] = email;
    if (website) updateFields["basicInformation.website"] = website;
    if (phone) updateFields["basicInformation.phone"] = phone;
    if (address) updateFields["basicInformation.address"] = address;
    if (industry)
      updateFields["basicInformation.industry"] = industry.toLowerCase();
    if (description) updateFields["basicInformation.description"] = description;

    updateFields["isRegistered"] = true;

    const updatedCompany = await Company.findOneAndUpdate(
      { userId: id },
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company details updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Edit company details error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const checkRegister = async (req, res) => {
  try {
    const { id, role } = req;
    console.log(id, ", Id and Role ,", role);

    if (role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    const data = await Company.findOne({ userId: id });

    res.status(200).json({ isRegister: data.isRegistered });
  } catch (error) {
    console.log(error);
  }
};

export const addSingleUser = async (req, res) => {
  try {
    const { id, role } = req;
    const { payload } = req.body;

    if (role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!payload?.email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const existingUser = await companyUserModel.findOne({
      companyId: id,
      email: payload.email,
      externalUserId: payload.id
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await companyUserModel.create({
      companyId: id,
      email: payload.email,
      externalUserId: payload.id,
      role: payload.role,
      name: payload.name,
    });

    return res.status(201).json({
      success: true,
      message: "User added successfully",
      user,
    });
  } catch (error) {
    console.error("addSingleUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const fetchUsers = async (req, res) => {
  try {
    const { id, role } = req;

    if (role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const users = await companyUserModel.find({ companyId: id });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("fetchUsers error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

