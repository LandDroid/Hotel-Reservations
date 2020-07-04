// You need to complete this controller with the required 7 actions
const viewPath = "reservations";
const HotelRes = require("../models/reservation");
const User = require("../models/user");

exports.index = async (req, res) => {
  try {
    const reservations = await HotelRes.find()
      .populate("user")
      .sort({ updatedAt: "desc" });

    res.render(`${viewPath}/index`, {
      pageTitle: "Archive",
      reservations: reservations,
    });
  } catch (error) {
    req.flash("danger", `There was an error displaying the Reservation Database: ${error}`);
    res.redirect("/");
  }
};

exports.show = async (req, res) => {
  try {
    const reservation = await HotelRes.findById(req.params.id).populate("user");
    console.log(reservation);

    res.render(`${viewPath}/show`, {
      pageTitle: reservation.user,
      reservation: reservation,
    });
  } catch (error) {
    req.flash("danger", `There was an error displaying this Reservation: ${error}`);
    res.redirect("/");
  }
};

exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: "New Reservation",
    roomTypes: ['single bed', 'double bed', 'queen', 'King']
  });
};

exports.create = async (req, res) => {
    
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({ email: email });

    const reservation = await HotelRes.create({ user: user._id, ...req.body });
    req.flash("success", "Your Reservation was created successfully");
    res.redirect(`/reservations/${reservation.id}`);
  } catch (error) {
    req.flash(
      "danger",
      `There was an error creating this Reservation, you might have to login first`
    );
    req.session.formData = req.body;
    res.redirect("/reservations/new");
  }
};

exports.edit = async (req, res) => {
  try {
    const reservation = await HotelRes.findById(req.params.id).populate("user");
    res.render(`${viewPath}/edit`, {
      pageTitle: reservation,
      formData: reservation,
    });
  } catch (error) {
    req.flash("danger", `There was an error accessing this Reservation: ${error}`);
    res.redirect("/");
  }
};

exports.update = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({ email: email });

    let reservation = await HotelRes.findById(req.body.id);
    if (!reservation) throw new Error("Reservation could not be found");

    const attributes = { user: user._id, ...req.body };
    await HotelRes.validate(attributes);
    await HotelRes.findOneAndUpdate(attributes.id, attributes).populate("user");

    req.flash("success", "The Reservation was updated successfully");
    res.redirect(`/reservations/${req.body.id}`);
  } catch (error) {
    req.flash("danger", `There was an error updating this Reservation: ${error}`);
    res.redirect(`/reservations/${req.body.id}/edit`);
  }
};

exports.delete = async (req, res) => {
  try {
    await HotelRes.findOneAndDelete({ _id: req.body.id });
    req.flash("success", "The Reservation was deleted successfully");
    res.redirect(`/reservations`);
  } catch (error) {
    req.flash("danger", `There was an error deleting this reservation: ${error}`);
    res.redirect(`/reservations`);
  }
};