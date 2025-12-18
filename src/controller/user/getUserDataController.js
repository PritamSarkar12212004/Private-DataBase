import findUserFormDataBase from "../../functions/user/helper/findUserFormDataBase.js";

const getUserDataController = async (req, res) => {
  try {
    if (!req.body?.payload || !req.body.payload.userPhone) {
      return res.status(400).json({
        message: "Please Provide User Phone Number",
        status: false,
        data: null,
      });
    }

    const { userPhone } = req.body.payload;

    const result = await findUserFormDataBase(userPhone);

    if (result.error) {
      return res.status(404).json({
        message: result.error.message,
        status: false,
        data: null,
      });
    }

    return res.status(200).json({
      message: "User Found Successfully",
      status: true,
      data: result.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error",
      status: false,
      data: null,
    });
  }
};

export default getUserDataController;
