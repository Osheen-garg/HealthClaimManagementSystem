const connectDb = require("./src/config/db");
const createAdmin = require("./src/seed/createAdmin");

const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");

const PORT = process.env.PORT || 6000;

const startServer = async () => {
  try {
    await connectDb();
    // await createAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

startServer();