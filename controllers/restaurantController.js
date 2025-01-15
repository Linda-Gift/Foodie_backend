const Restaurant = require('../models/Restaurant')

exports.createRestaurant = async (req, res) => {
  try {
    const { name, location, cuisine, rating } = req.body
    if (!name || !location || !cuisine) {
      return res.status(400).json({ error: 'Name, location, and cuisine are required.' })
    }
    if (rating && (rating < 0 || rating > 5)) {
      return res.status(400).json({ error: 'Your rating should be between 0 and 5.' })
    }
    const newRestaurant = new Restaurant({ name, location, cuisine, rating })
    await newRestaurant.save()
    res.status(201).json(newRestaurant)
  } catch (error) {
    res.status(500).json({ error: 'Please an error occurred while creating the restaurant.' })
  }
}

exports.updateRestaurant = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, location, cuisine, rating } = req.body
      const restaurant = await Restaurant.findById(id)
      if (!restaurant || restaurant.isDeleted) {
        return res.status(404).json({ error: 'Restaurant not found.' })
      }
      if (rating && (rating < 0 || rating > 5)) {
        return res.status(400).json({ error: 'Your rating should be between 0 and 5.' })
      }
      restaurant.name = name || restaurant.name
      restaurant.location = location || restaurant.location
      restaurant.cuisine = cuisine || restaurant.cuisine
      restaurant.rating = rating !== undefined ? rating : restaurant.rating
      await restaurant.save()
      res.status(200).json(restaurant)
    } catch (error) {
      res.status(500).json({ error: 'Please an error occurred while updating the restaurant.' })
    }
  }

  exports.deleteRestaurant = async (req, res) => {
    try {
      const { id } = req.params
      const restaurant = await Restaurant.findById(id)
      if (!restaurant || restaurant.isDeleted) {
        return res.status(404).json({ error: 'Restaurant not found or is already deleted.' })
      }
      restaurant.isDeleted = true
      await restaurant.save()
      res.status(200).json({ message: 'Restaurant is deleted successfully.' })
    } catch (error) {
      res.status(500).json({ error: 'Please an error occurred while deleting the restaurant.' })
    }
  }
  
  exports.getAllRestaurants = async (req, res) => {
    try {
      const restaurants = await Restaurant.find({ isDeleted: false })
      res.status(200).json(restaurants)
    } catch (error) {
      res.status(500).json({ error: 'Please an error occurred while retrieving restaurants.' })
    }
  }
  
  exports.getRestaurantById = async (req, res) => {
    try {
      const { id } = req.params
      const restaurant = await Restaurant.findById(id)
      if (!restaurant || restaurant.isDeleted) {
        return res.status(404).json({ error: 'Restaurant not found.' })
      }
      res.status(200).json(restaurant);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while retrieving the restaurant.' })
    }
  }
  
  
