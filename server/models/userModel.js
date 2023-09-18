const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const Goal = require("./goalModel");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    education: {
      type: String,
    },
    fieldOfInterest: {
      type: String,
    },
    university: {
      type: String,
    },
    department: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Student", "Mentor"],
    },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    mentor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    goals: [
      {
        task: {
          type: String,
          require: true,
        },
        creator: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        assigned_to: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        isCompleted: {
          type: Boolean,
        },
        deadline: {
          type: Date,
        },
      },
    ],
    thesis: [
      {
        cloudinaryLink: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          require: true,
        },
        mentor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        creator_student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: "String",
        feedback: [
          {
            title: {
              type: String,
            },
            body: {
              type: String,
            },
          },
        ],
      },
    ],
    description: {
      type: String,
      default:
        "I am a tech professional who designs and builds websites, ensuring they function smoothly and look appealing. I use programming languages like HTML, CSS, and JavaScript to create user-friendly and responsive web applications. Web developers play a crucial role in bringing digital ideas to life on the internet",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.post("findOneAndDelete", async (data) => {
  console.log("Post middleware");
  if (data.goals.length) {
    const res = await Goal.deleteMany({ _id: { $in: data.goals } });
    console.log(res);
  }
  console.log("All goals deleted");
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
