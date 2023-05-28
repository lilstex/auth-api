const swaggerJsDoc = require("swagger-jsdoc");
const port = process.env.PORT;

const swagger = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "AUTHENTICATION SERVICE API",
      contact: { name: "Emmanuel C Mbagwu" },
      servers: [{ url: `http://localhost:${port}`}]
    },
  },
  apis: ['./swaggerDocs/**/*.yml']
};

module.exports = swaggerJsDoc(swagger);
