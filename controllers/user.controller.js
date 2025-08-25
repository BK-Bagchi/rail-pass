import User from "../models/user.model.js";

export const getAllUser = async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin")
    return res.redirect("/admin/login");

  try {
    const allUsers = await User.find();
    if (!allUsers || allUsers.length === 0)
      return res.status(404).render("admin/dashboard", {
        login: req.session.user,
        users: null,
        userFound: "No users found.",
        management: "users",
      });
    res.render("admin/dashboard", {
      login: req.session.user,
      users: allUsers,
      userFound: null,
      management: "users",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin")
    return res.redirect("/admin/login");
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        dateOfBirth: req.body.dateOfBirth,
        role: req.body.role,
      },
      { new: true }
    );

    if (updatedUser)
      return res.redirect("/admin/users?success=User updated successfully");
    else return res.redirect("/admin/users?error=Failed to update user");
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
