const Restaurant = require('../models/Restaurant');
const Table = require('../models/Table');

// @route   GET /api/restaurants
// @desc    List all restaurants with search, cuisine, party size, and live table counts
exports.getAllRestaurants = async (req, res, next) => {
  try {
    const { search, cuisine, partySize, minRating, sort } = req.query;

    const filter = {};

    // Text search on name, description, area
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { description: regex },
        { 'address.area': regex },
        { 'address.city': regex },
      ];
    }

    // Cuisine filter
    if (cuisine && cuisine.trim()) {
      filter.cuisine = { $in: [new RegExp(cuisine.trim(), 'i')] };
    }

    // Min rating
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    let query = Restaurant.find(filter);

    // Sorting
    if (sort === 'rating') {
      query = query.sort({ rating: -1 });
    } else if (sort === 'name') {
      query = query.sort({ name: 1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const restaurants = await query.exec();

    // Attach live seat availability summaries to each restaurant
    const restaurantsWithAvailability = await Promise.all(
      restaurants.map(async (rest) => {
        const tables = await Table.find({ restaurantId: rest._id });
        const totalTables = tables.length;
        const availableTables = tables.filter((t) => t.status === 'available').length;
        const occupiedTables = tables.filter((t) => t.status === 'occupied').length;
        const heldTables = tables.filter((t) => t.status === 'held').length;
        const reservedTables = tables.filter((t) => t.status === 'reserved').length;

        // If partySize requested, count tables that match capacity and are available
        let matchingAvailable = availableTables;
        if (partySize) {
          const reqSize = parseInt(partySize, 10);
          matchingAvailable = tables.filter(
            (t) => t.status === 'available' && t.capacity >= reqSize
          ).length;
        }

        const plain = rest.toObject();
        plain.availabilitySummary = {
          totalTables,
          availableTables,
          occupiedTables,
          heldTables,
          reservedTables,
          matchingAvailable,
          occupancyRate: totalTables > 0 ? Math.round((occupiedTables / totalTables) * 100) : 0,
        };

        return plain;
      })
    );

    // Optional filter by partySize availability if user requested
    let resultList = restaurantsWithAvailability;
    if (partySize && req.query.availableOnly === 'true') {
      resultList = resultList.filter((r) => r.availabilitySummary.matchingAvailable > 0);
    }

    return res.json({
      success: true,
      count: resultList.length,
      restaurants: resultList,
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/restaurants/:id
// @desc    Get detailed restaurant profile
exports.getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found.',
      });
    }

    const tables = await Table.find({ restaurantId: restaurant._id });
    const availableTables = tables.filter((t) => t.status === 'available').length;

    const restObj = restaurant.toObject();
    restObj.totalTables = tables.length;
    restObj.availableTables = availableTables;

    return res.json({
      success: true,
      restaurant: restObj,
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/restaurants/:id/tables
// @desc    Get real-time tables & floor layout for a restaurant
exports.getRestaurantTables = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { floor } = req.query;

    const filter = { restaurantId: id };
    if (floor) {
      filter.floor = floor;
    }

    const tables = await Table.find(filter).sort({ tableNumber: 1 });

    return res.json({
      success: true,
      count: tables.length,
      tables,
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/restaurants
// @desc    Create a new restaurant (admin only)
exports.createRestaurant = async (req, res, next) => {
  try {
    const restaurantData = { ...req.body, ownerId: req.user._id };
    const restaurant = await Restaurant.create(restaurantData);

    // Link admin user to this restaurant if not already
    if (!req.user.restaurantId) {
      req.user.restaurantId = restaurant._id;
      await req.user.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Restaurant created successfully.',
      restaurant,
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/restaurants/:id
// @desc    Update restaurant profile
exports.updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found.',
      });
    }

    return res.json({
      success: true,
      message: 'Restaurant profile updated successfully.',
      restaurant,
    });
  } catch (err) {
    next(err);
  }
};
