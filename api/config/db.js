import mongoose from "mongoose";

const ConnectDB = async () => {
  let DBURL = "";

  try {
    DBURL =
      process.env.NODE_ENV === "DEVELOPMENT"
        ? process.env.DB_LOCAL_URL
        : process.env.DB_PROD_URL;

    if (!DBURL) {
      throw new Error("Database URL is not defined.");
    }

    const con = await mongoose.connect(DBURL);

    console.log(`MongoDB Connected: ${con.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default ConnectDB;
