const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  console.log('Tag Route Hit')

      try {
        const tagData = await Tag.findAll({
          include: [{ model: Product }],
        });
        res.status(200).json(tagData);
      } catch (err) {
        res.status(500).json(err);
       }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await  Tag.findByPk(req.params.id, {
      include:[{ model: Product }],
    });
    if (!tagData) {
      res.status(404).json({ message: 'No Tag found with that id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});




 // {
    //   "tag_name": "Crisp",
    //   "productIds": [1, 2, 3, 4]
    // }
//                                        Create New Tag
router.post('/', (req, res) => {
  // create a new tag
  console.log("Tag Post Route");

Tag.create(req.body)
  .then((tag) => {
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.productIds.length) {
      const tagProductIdArr = req.body.productIds.map((product_id) => {
        return {
          tag_id: tag.id,
          product_id,
        };
      });
      return ProductTag.bulkCreate(tagProductIdArr);
    }
    // if no product tags, just respond
    res.status(200).json(tag);
  })
  .then((tagProductIds) => res.status(200).json(tagProductIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});






// {
//   "tag_name": "ChadThings"
// }
router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then((tag) => {
    if (req.body.productIds && req.body.productIds.length) {

      ProductTag.findAll({
        where: { tag_id: req.params.id }
      }).then((productTags) => {
        // create filtered list of new product_ids

        const productTagIds = productTags.map(({ product_id }) => product_id);
        const newProductTags = req.body.productIds
          .filter((product_id) => !productTagIds.includes(product_id))
          .map((product_id) => {
            return {
              tag_id: req.params.id,
              product_id,
            };
          });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ product_id }) => !req.body.productIds.includes(product_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(tag);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});











router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  console.log("tag deleted")
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!tagData) {
      res.status(404).json({ message: 'No product with this id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }






});

module.exports = router;
