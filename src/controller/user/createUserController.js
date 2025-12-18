import uniqid from "uniqid";
import saveUploadUser from "../../functions/user/storage/SaveUploadUser.js";
import { uuid } from "unique-string-generator";

const createUserController = async (req, res) => {
  if (
    !req.body?.payload ||
    !req.body.payload.userName ||
    !req.body.payload.userPhone
  ) {
    return res.status(400).json({
      message: "Please Provide Full Information of the user",
      data: null,
      status: false,
    });
  }
  try {
    const { userName, userPhone } = req.body.payload;

    const now = new Date();
    const createUser = {
      id: uniqid(),
      userName,
      userPhone,
      createdAt: now.toISOString(),
      token: uuid.v4(),
    };

    const savedUser = await saveUploadUser(createUser);

    return res.status(201).json({
      message: "User created successfully",
      status: true,
      data: savedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error From Server Side",
      data: null,
      status: false,
    });
  }
};

export default createUserController;
