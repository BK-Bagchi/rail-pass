// checkout session route
export const checkoutSession = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment session failed..." });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};
