const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
router.get('/', async (req, res) => {
  console.log('Category Route Hit')
  // find all categories
  // be sure to include its associated Products
    try {
      const categoryData = await Category.findAll({
        include: [{ model: Product }],
      });
      res.status(200).json(categoryData);
    } catch (err) {
      res.status(500).json(err);
     }
});


  // find one category by its `id` value
  router.get('/:id', async (req, res) => {
    console.log('Category id Route Hit')
    try {
      const categoryData = await Category.findByPk(req.params.id, {
        include: [{ model: Product }],
      });
      if (!categoryData) {
        res.status(404).json({ message: 'No Category found with that id!' });
        return;
      }
      res.status(200).json(categoryData);
    } catch (err) {
      res.status(500).json(err);
    }
  });


router.post('/', async (req, res) => {
  // create a new category
  console.log("Category Post Route");
  try {
    const newCategory = await Category.create({
      category_name: req.body.category_name,
    });
      // {
  //   "category_name": "Sports"
  // }
    res.status(201).json(newCategory);
  } catch (err) {
  res.status(400).json(err);
}
});



router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
