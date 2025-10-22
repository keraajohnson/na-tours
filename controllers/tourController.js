const Tour = require('./../models/tourModel');

// MIDDLEWARE

// ROUTE HANDLERS

// create tour
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// get all tours
exports.getAllTours = async (req, res) => {
  try {
    // find all
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// get tour
exports.getTour = async (req, res) => {
  try {
    // find one
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
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

// graveyard

// exports.createTour = (req, res) => {
//   const newId = tours[tours.length - 1].id + 1;
//   // we need to use middleware to get the body from our request
//   const newTour = Object.assign({ id: newId }, req.body);

//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     },
//   );
// };

// check tour id and return 404 if we do not have that id
// exports.checkID = (req, res, next, val) => {
//   console.log('tour id! :', val);
//   if (val * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// check that we have name + price on create tour body
// exports.checkPostBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'bad request',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };
