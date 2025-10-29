const Tour = require('./../models/tourModel');

// MIDDLEWARE
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,difficulty';
  next();
};
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
    // BUILD QUERY
    // 1a) FILTERING
    // make hard copy of object to get just the filters
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    // delete excluded fields
    excludedFields.forEach((item) => delete queryObj[item]);

    // 1b) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);

    // add the $ to the advanced filter bc that's what mongo understands
    queryStr = queryStr.replace(/(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // gte, gt, lte, lt (greater than or equal, greater than, less than or equal, less than)

    // find all + filters added to query param
    let query = Tour.find(JSON.parse(queryStr));

    // 2) SORTING
    if (req.query.sort) {
      // this enables us to use multiple variables to sort by
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3) FIELD LIMITING
    // limit the fields we want returned from the API
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      // this is called projecting
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4) PAGINATION
    //  (* 1) turns our string into a number
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    // calculate skip value
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numOfTours = await Tour.countDocuments();
      if (skip >= numOfTours) throw new Error('This page does not exist');
    }

    // EXECUTE QUERY
    const tours = await query;

    // SEND RESPONSE
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

// update tour
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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

// delete tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// notes (related to get all tours filter)
// how queries work in mongoose
// find() will return a query
// we have a query object from mongoose which returns a bunch of methods
// that's how we can chain methods like we do below --  as soon as we await the result, the query will execute and return the document we're looking for
// we need to actually save the find into a query and make sure that we're saving the filter/sort/limit etc all at once

// const tours =  Tour.find()
//   .where('duration')
//   .equals(5)
//   .where('difficulty')
//   .equals('easy');

// graveyard

// filter object
// $gte == greater or equal
// {diff: "easy", "duration": {$gte: 5}}

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
