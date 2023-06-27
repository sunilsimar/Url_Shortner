const express = require('express');
const router = express.Router();
const URL = require('./models/url');
const shortid = require('shortid');

//creating a function for creating shorturl using npm shortid package
function generateShortUrl() {
  return shortid.generate();
}

// GET route
// router.get('/', async(req, res) => {
//   try{
//     const shortUrls = await URL.find();
//     console.log(shortUrls);
//     res.render('combined', { shortUrls });
//   }
//   catch(error){
//     console.error(error);
//     res.sendStatus(500);
//   }
// });

// Search route
router.get('/', async (req, res) => {
    const searchText = req.query.q; // Get the search query from the request
    let shortUrls;
    if (searchText) {
        shortUrls = await URL.find({
            $or: [
                { full: { $regex: searchText, $options: 'i' } }, // Case-insensitive search in the full URL
                { short: { $regex: searchText, $options: 'i' } }, // Case-insensitive search in the short URL
            ],
        }).exec();
    } else {
        shortUrls = await URL.find().exec(); // Fetch all short URLs if no search query provided
    }
    res.render('combined', { shortUrls });
    
});

// POST route
router.post('/', async (req, res) => {
  const{ fullUrl } = req.body;
  try{
    const existingUrl = await URL.findOne({ full: fullUrl });
    if(existingUrl){
      res.redirect('/');
    }
    else{
      const shortUrl = new URL({
        full: fullUrl,
        short: generateShortUrl(),
        clicks: 0
      });
      await shortUrl.save();
      res.redirect('/');
    }
  }
  catch(err){
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Redirect route
router.get('/:shortUrl', async(req,res) => {
  const { shortUrl } = req.params;

  try{
    const url = await URL.findOne({ short: shortUrl });

    if(url){
      console.log('Original URL:', url.full);
      console.log('Current clicks:', url.clicks);

      url.clicks++; // Increment the clicks for the shortened URL
      await url.save(); // Save the updated clicks to the database

      console.log('Updated clicks:', url.clicks);

      res.redirect(url.full);
    }
    else{
      res.sendStatus(404);
    }
  }
  catch(error){
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
