let mongoURI =
  process.env.ENV == "DEVELOOPMENT"
    ? process.env.DATABASE_LOCAL
    : process.env.DATABASE_PROD;

console.log(`mongoURI: ${mongoURI}`);
const connectDB = async (mongoose) => {
  try {
    await mongoose.connect(mongoURI, {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected...`);
  } catch (error) {
    console.log(`Error @connectDB: ${error.message}`);

    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
