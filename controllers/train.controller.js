import Train from "../models/train.model.js";

export const getAllTrain = async (req, res) => {
  if (!req.session.user) return res.redirect("/admin/login");

  try {
    const allTrain = await Train.find();
    if (!allTrain || allTrain.length === 0) {
      return res.status(404).render("admin/dashboard", {
        trains: null,
        trainFound: "No trains found.",
        management: "trains",
      });
    }
    res.render("admin/dashboard", {
      trains: allTrain,
      trainFound: null,
      management: "trains",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};
