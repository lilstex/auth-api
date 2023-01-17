const app = require('./index');
const { env } = require('./configs');

const { port } = env;

app.listen(port, () => {
    console.log(
    `HMS service is running on http://localhost:${port}/swagger`
    );
});