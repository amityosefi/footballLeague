const app = require('./main');

const port = process.env.PORT || "3000";

const server = app.listen(port, () => {
    console.log(`Server listen on port ${port}`);
  });
