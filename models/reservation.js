// You need to define the schema for a reservation
// The fields you require are:
// associated user
// numOfOccupants (number of occupants)
// roomType (options are 'single bed', 'double bed', 'queen', 'king')
// checkIn (just date, not time)
// checkOut (just date, not time)

const mongoose = require("mongoose");
//Removing deprecation Warnings
mongoose.set("useFindAndModify", false);
const HotelReservationsSchema = new mongoose.Schema(
  {
      
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  
    numOfOccupants: {
      type: Number,
      required: true, // This must exist
    },
    roomType: {
      type: String,
      enum : ["single bed", "double bed", "queen", "king"],
      default: 'single bed'
    },

    checkIn: {
      type: Date,
   
      required: false,
    },
    checkOut: {
      type: Date,
    
      required: false,
    },
},
  
  {
    timestamps: true,
  }
);

// Query Helpers
HotelReservationsSchema.query.drafts = function () {
  return this.where({
    status: "DRAFT",
  });
};

HotelReservationsSchema.query.published = function () {
  return this.where({
    status: "PUBLISHED",
  });
};

HotelReservationsSchema.virtual("synopsis").get(function () {
  const post = this.user;
  return post.replace(/(<([^>]+)>)/gi, "").substring(0, 250);
});

module.exports = mongoose.model("HotelRes", HotelReservationsSchema);