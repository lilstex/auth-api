const Joi = require("joi");
require("dotenv").config();

const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test", "provision")
    .default("development"),
  PORT: Joi.number().required(),
  DATABASE: Joi.string().required().description("Database connection URL"),
})
  .unknown()
  .required();

const { error, value: env } = schema.validate(process.env);

if (error) {
  console.log(`Config validation error: ${error.message}`);
  return;
}

const config = {
    env: env.NODE_ENV,
    port: env.PORT,
    dbURL: env.DATABASE,
  };
  
  module.exports = config;
  