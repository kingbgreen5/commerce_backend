const router = require('express').Router();
const { Category, Product } = require('../../models');
const { findByPk } = require('../../models/Product');

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


router.put('/:id', async (req, res) => {
  console.log();
  // update a category by its `id` value
  try {
const categoryUpdate = await Category.findByPk(req.params.id)

if (!categoryUpdate){
  return res.status(404).json({ error: 'Category not found' });
}
await categoryUpdate.update({
  category_name: req.body.category_name,
});

res.status(200).json(categoryUpdate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  console.log("delete")

  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No Category wit this ID!' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
