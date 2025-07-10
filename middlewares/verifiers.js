exports.verifySignInorResetPassword = (req, res, next) => {
  const { email, password } = req.body;

  if (!email)
    return res
      .status(400)
      .json({ status: false, code: 400, message: "email is required" });
  if (!password)
    return res
      .status(400)
      .json({ status: false, code: 400, message: "password is required" });

  next();
};

exports.verifySignUp = (req, res, next) => {
  const { email, password, company_name, contact } = req.body;

  if (!email)
    return res
      .status(400)
      .json({ status: false, code: 400, message: "Email is required" });
  if (!password)
    return res
      .status(400)
      .json({ status: false, code: 400, message: "Password is required" });

  if (!company_name)
    return res
      .status(400)
      .json({ status: false, code: 400, message: "Company name is required!" });
  if (!contact)
    return res
      .status(400)
      .json({ status: false, code: 400, message: "Phone number is required!" });

  next();
};

exports.verifyAddReport = (req, res, next) => {
  const {
    userId,
    count,
    latitude,
    longitude,
    coyoteDen,
    coyoteFood,
    description,
    dob,
  } = req.body;
  const { images } = req.files || {};

  if (!userId) {
    return res
      .status(400)
      .json({ status: false, code: 400, message: "UserId is required" });
  }

  // Count validation
  if (!count)
    return res
      .status(400)
      .json({ status: false, code: 400, message: "Count is required" });
  if (isNaN(count) || parseInt(count) <= 0)
    return res.status(400).json({
      status: false,
      code: 400,
      message: "Count must be a positive number",
    });

  // Latitude validation
  if (!latitude)
    return res
      .status(400)
      .json({ status: false, code: 400, message: "Latitude is required" });
  if (isNaN(latitude) || latitude < -90 || latitude > 90)
    return res.status(400).json({
      status: false,
      code: 400,
      message: "Latitude must be a valid number between -90 and 90",
    });

  // Longitude validation
  if (!longitude)
    return res
      .status(400)
      .json({ status: false, code: 400, message: "Longitude is required" });
  if (isNaN(longitude) || longitude < -180 || longitude > 180)
    return res.status(400).json({
      status: false,
      code: 400,
      message: "Longitude must be a valid number between -180 and 180",
    });

  // CoyoteDen validation
  if (coyoteDen !== undefined && typeof JSON.parse(coyoteDen) !== "boolean") {
    return res.status(400).json({
      status: false,
      code: 400,
      message: "CoyoteDen must be a boolean value",
    });
  }

  // CoyoteFood validation
  if (coyoteFood !== undefined && typeof JSON.parse(coyoteFood) !== "boolean") {
    return res.status(400).json({
      status: false,
      code: 400,
      message: "CoyoteFood must be a boolean value",
    });
  }

  next();
};
