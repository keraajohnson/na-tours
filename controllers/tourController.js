const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

// MIDDLEWARE

// check tour id and return 404 if we do not have that id
exports.checkID = (req, res, next, val) => {
  console.log('tour id! :', val);
  if (val * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

// check that we have name + price on create tour body
exports.checkPostBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'bad request',
      message: 'Missing name or price',
    });
  }
  next();
};

// ROUTE HANDLERS

// create tour
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  // we need to use middleware to get the body from our request
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};

// get all tours
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tours,
    },
  });
};

// get tour
exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// update tour (missing most functionality)
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

// delete tour (missing most functionality)
exports.deleteTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Deleted tour here>',
    },
  });
};
