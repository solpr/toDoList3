import appControl from './source/controllers/index.js';

const port = 3000;

appControl.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
