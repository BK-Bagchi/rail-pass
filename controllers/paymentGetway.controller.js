import SSLCommerzPayment from "ssl-commerz-node";
import dotenv from "dotenv";
dotenv.config();

export const createSSLCommerzSession = async (req, res) => {
  try {
    const {
      trainId,
      trainName,
      seatClass,
      fromStation,
      toStation,
      journeyDate,
      fare,
      totalSeats,
    } = req.body;
    console.log(req.session.user);

    const store_id = process.env.SSLCOMMERZ_STORE_ID;
    const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
    const is_live = false; // true for live
    console.log(store_id, store_passwd, is_live);

    const data = {
      total_amount: Number(fare), // Total fare
      currency: "BDT",
      train_id: `${trainId}`, // Unique transaction ID
      success_url: `${process.env.BASE_URL}/booking/success?trainId=${trainId}`,
      fail_url: `${process.env.BASE_URL}/booking/fail`,
      cancel_url: `${process.env.BASE_URL}/booking/cancel`,
      ipn_url: `${process.env.BASE_URL}/booking/ipn`, // optional
      shipping_method: "NO",
      product_name: `Train Booking - ${trainName}`,
      product_category: "Train Ticket",
      product_profile: "general",
      cus_name: req.session.user?.name || "Guest",
      cus_email: req.session.user?.email || "guest@example.com",
      cus_add1: "N/A",
      cus_city: "N/A",
      cus_postcode: "0000",
      cus_country: "Bangladesh",
      cus_phone: "01700000000",
      multi_card_name: "mastercard,visacard,amexcard",
      value_a: trainId,
      value_b: seatClass,
      value_c: fromStation,
      value_d: toStation,
    };

    const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const response = await sslcommerz.init(data);

    // Redirect user to payment page
    if (response.GatewayPageURL) {
      return res.redirect(response.GatewayPageURL);
    } else {
      return res.status(400).send("SSLCommerz session failed!");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error creating SSLCommerz session");
  }
};

export const checkoutSuccess = (req, res) => {
  res.send(`Payment successful for ${req.query.trainId}!`);
};
