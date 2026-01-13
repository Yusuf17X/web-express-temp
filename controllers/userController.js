const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");

exports.updateUser = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findById(req.params.id);

  updatedUser.email = updatedUser.email || req.body.email;
  updatedUser.password = updatedUser.password || req.body.password;

  await updatedUser.save();

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
