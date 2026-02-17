import Company from "../models/company/company.model.js";
import companyUserModel from "../models/company/companyUser.model.js";
import ConsentPurpose from "../models/consent/consentPurpose.model.js";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import redis from "../config/redis.js";
import { sendMail } from "../services/sendmail.js";
import { Queue } from "bullmq";

function getOtpEmailHtml({ otp }) {
  const currentYear = new Date().getFullYear();

  return `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Consent Ledger OTP</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#10243b;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #d8e4f2;border-radius:14px;overflow:hidden;">
              <tr>
                <td style="padding:20px 24px;background:linear-gradient(90deg,#7fa4c4,#5f88ad);color:#ffffff;">
                  <h1 style="margin:0;font-size:20px;line-height:1.3;">Consent Ledger</h1>
                  <p style="margin:6px 0 0;font-size:13px;opacity:.95;">Email Verification</p>
                </td>
              </tr>
              <tr>
                <td style="padding:24px;">
                  <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#29496a;">
                    Use the OTP below to verify your email address.
                  </p>
                  <div style="margin:18px 0 16px;padding:14px 16px;border:1px dashed #7fa4c4;border-radius:12px;background:#f7fbff;text-align:center;">
                    <span style="display:inline-block;font-size:30px;line-height:1;letter-spacing:10px;font-weight:700;color:#13365a;">${otp}</span>
                  </div>
                  <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#456789;">
                    This OTP is valid for <strong>2 minutes</strong>.
                  </p>
                  <p style="margin:0;font-size:12px;line-height:1.6;color:#6a8098;">
                    If you did not request this OTP, please ignore this email.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 24px;border-top:1px solid #e7eef7;background:#fbfdff;font-size:11px;color:#6a8098;">
                  © ${currentYear} Consent Ledger
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

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

export const getCompanyProfile = async (req, res) => {
  try {
    const { id, role } = req;

    if (role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const company = await Company.findOne({ userId: id });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error("Get company profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const uploadCompanyProfileImage = async (req, res) => {
  try {
    const { id, role } = req;

    if (role !== "company") {
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

    const updatedCompany = await Company.findOneAndUpdate(
      { userId: id },
      { $set: { profileUrl } },
      { new: true },
    );

    if (!updatedCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      profileUrl,
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Upload company profile image error:", error);

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
    console.log(data);

    if (!data) {
      return res.status(200).json({
        isRegister: false,
        email: "",
      });
    }
    console.log(data);
    return res.status(200).json({
      isRegister: data.isRegistered,
      email: data.basicInformation?.email || "",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
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
    });
    console.log(existingUser);

    if (existingUser) {
      console.log("here");
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

    console.log("Success");
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
    console.log(users);
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

export const removeUser = async (req, res) => {
  try {
    const { user } = req.body;
    const { id, role } = req;
    console.log(user);

    if (role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const usr = await companyUserModel.findOneAndDelete({
      companyId: id,
      externalUserId: user.id,
      email: user.email,
    });
    if (!usr) {
    }

    return res.status(200).json({
      success: true,
      usr,
    });
  } catch (error) { }
};

export const updateUser = async (req, res) => {
  try {
    const { payload } = req.body;
    const { id, role } = req;

    if (role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!payload || !payload.id) {
      return res.status(400).json({
        success: false,
        message: "User details are missing",
      });
    }

    const updatedUser = await companyUserModel.findOneAndUpdate(
      {
        externalUserId: payload.id,
        companyId: id,
      },
      {
        $set: {
          name: payload.name,
          email: payload.email,
          role: payload.role,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found or does not belong to your organization",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email address already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addMultipleUsers = async (req, res) => {
  const filePath = req.file ? path.join(process.cwd(), req.file.path) : null;

  try {
    const { id, role } = req;

    if (role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File not found",
      });
    }

    const users = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (!row.email || !row.name) return;

        users.push({
          companyId: id,
          externalUserId: row.id?.trim(),
          name: row.name.trim(),
          email: row.email.trim(),
          role: row.role?.trim() || "viewer",
        });
      })
      .on("end", async () => {
        try {
          if (!users.length) {
            fs.unlink(filePath, () => { });
            return res.status(400).json({
              success: false,
              message: "CSV is empty or invalid",
            });
          }

          let insertedDocs = [];
          let failedCount = 0;

          try {
            insertedDocs = await companyUserModel.insertMany(users, {
              ordered: false,
            });
          } catch (bulkError) {
            insertedDocs = bulkError.insertedDocs || [];
            failedCount = bulkError.writeErrors?.length || 0;
          }

          fs.unlink(filePath, () => { });

          if (!insertedDocs.length) {
            return res.status(400).json({
              success: false,
              message: "No users were added",
            });
          }

          return res.status(201).json({
            success: true,
            message:
              failedCount > 0
                ? "Some users added, some failed"
                : "All users added successfully",
            addedCount: insertedDocs.length,
            failedCount,
            users: insertedDocs,
          });
        } catch (err) {
          fs.unlink(filePath, () => { });
          return res.status(500).json({
            success: false,
            message: "Failed to insert users",
          });
        }
      });
  } catch (error) {
    if (filePath) fs.unlink(filePath, () => { });
    return res.status(500).json({
      success: false,
      message: "Failed to process file",
    });
  }
};

export const createConsentPurpose = async (req, res) => {
  try {
    const { id, role } = req;
    const { name, description, consentType, duration, status } = req.body;

    if (role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }

    const purpose = await ConsentPurpose.create({
      companyId: id,
      name: name.trim(),
      description: description.trim(),
      consentType: consentType?.trim() || "Required",
      duration: duration?.trim() || "12 months",
      status: status?.trim() || "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Consent purpose created",
      purpose,
    });
  } catch (error) {
    console.error("createConsentPurpose error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const fetchConsentPurposes = async (req, res) => {
  try {
    const { id, role } = req;

    if (role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const purposes = await ConsentPurpose.find({ companyId: id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      purposes,
    });
  } catch (error) {
    console.error("fetchConsentPurposes error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateConsentPurpose = async (req, res) => {
  try {
    const { id, role } = req;
    const { purposeId, updates } = req.body;

    if (role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!purposeId) {
      return res.status(400).json({
        success: false,
        message: "purposeId is required",
      });
    }

    const updateFields = {};
    if (updates?.name !== undefined) updateFields.name = updates.name.trim();
    if (updates?.description !== undefined)
      updateFields.description = updates.description.trim();
    if (updates?.consentType !== undefined)
      updateFields.consentType = updates.consentType.trim();
    if (updates?.duration !== undefined)
      updateFields.duration = updates.duration.trim();
    if (updates?.status !== undefined)
      updateFields.status = updates.status.trim();

    const purpose = await ConsentPurpose.findOneAndUpdate(
      { _id: purposeId, companyId: id },
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    if (!purpose) {
      return res.status(404).json({
        success: false,
        message: "Consent purpose not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Consent purpose updated",
      purpose,
    });
  } catch (error) {
    console.error("updateConsentPurpose error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteConsentPurpose = async (req, res) => {
  try {
    const { id, role } = req;
    const { purposeId } = req.body;

    if (role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!purposeId) {
      return res.status(400).json({
        success: false,
        message: "purposeId is required",
      });
    }

    const deleted = await ConsentPurpose.findOneAndDelete({
      _id: purposeId,
      companyId: id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Consent purpose not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Consent purpose deleted",
      purpose: deleted,
    });
  } catch (error) {
    console.error("deleteConsentPurpose error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { id, role } = req; // from auth middleware

    if (role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const company = await Company.findOne({ userId: id });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const email = company?.basicInformation?.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Company email is required to send OTP",
      });
    }

    const otpKey = `otp:${id}`;
    const attemptKey = `otp_attempt:${id}`;

    const attempts = await redis.incr(attemptKey);

    if (attempts === 1) {
      await redis.expire(attemptKey, 600);
    }

    if (attempts > 5) {
      return res.status(429).json({
        success: false,
        message: "Too many OTP requests. Try later.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await redis.setex(otpKey, 120, otp); // 2 min
    console.log(otp);
    const mailOptions = {
      from: `"Consent Ledger" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification OTP",
      text: `Your OTP is ${otp}. Valid for 2 minutes.`,
      html: getOtpEmailHtml({ otp }),
    };

    const isSent = await sendMail(mailOptions);

    if (!isSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { id, role } = req; // from auth middleware
    console.log("Came here to verify");
    if (role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const { otp } = req.body;
    console.log(otp);
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    const otpKey = `otp:${id}`;

    const storedOtp = await redis.get(otpKey);

    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    if (String(storedOtp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    await Company.updateOne({ userId: id }, { $set: { isVerified: true } });

    await redis.del(otpKey);
    await redis.del(`otp_attempt:${id}`);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const emailQueue = new Queue("Email_jobs", {
  connection: {
    host: process.env.REDIS_HOST || "redis",
    port: Number(process.env.REDIS_PORT || 6379),
  },
});

const addEmailJob = async (emailData) => {
  return emailQueue.add("send-consent-request", emailData);
};

export const sendConsentRequests = async (req, res) => {
  try {
    const { payload } = req.body;
    const { id, role } = req; // from auth middleware
    console.log("Came here to verify");
    if (role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const emailData = (payload.selectedUsers ?? []).flatMap((user) =>
      (payload.selectedPurposes ?? []).map((purpose) => ({
        name: user.name,
        email: user.email,
        purposeTitle: purpose.name,
        purposeDescription: purpose.description,
        purposeDuration: purpose.duration,
      })),
    );

    if (!emailData.length) {
      return res.status(400).json({
        success: false,
        message: "No users or purposes selected",
      });
    }

    await Promise.all(emailData.map((element) => addEmailJob(element)));

    return res.status(200).json({
      success: true,
      message: "All email jobs added to queue",
      totalJobs: emailData.length,
    });
  } catch (error) {
    console.error("Send consent requests queue error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add all email jobs to queue",
    });
  }
};
