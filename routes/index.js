var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

const getCategories = () => {
  try {
    const filePath = path.join(__dirname, '../DB/categories.json');
    const data = fs.readFileSync(filePath, 'utf8');
    
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading categories:", error);
    return [];
  }
};

const getProducts = () => {
  try {
    const filePath = path.join(__dirname, '../DB/data.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading products:", error);
    return [];
  }
};

router.get('/', function (req, res, next) {
  const allCategories = getCategories();
  const products = getProducts();

  res.render('index', {
    title: 'TechStore - Home',
    allCategories,
    products,
    activeTab: 'home'
  });
});

router.get('/categories/:slug', function (req, res, next) {
  const allCategories = getCategories();
  const products = getProducts();

  const category = allCategories.find(cat => cat.slug === req.params.slug);

  if (!category) {
    return next();
  }

  const categoryProducts = products.filter(prod => prod.categorySlug === category.slug);

  res.render('category', {
    title: `${category.title} - TechStore`,
    allCategories,
    category,
    products: categoryProducts,
    activeTab: category.slug
  });
});

router.get('/products/:slug', function (req, res, next) {
  const allCategories = getCategories();
  const products = getProducts();

  const product = products.find(p => p.slug === req.params.slug);

  if (!product) {
    return next();
  }

  const category = allCategories.find(cat => cat.slug === product.categorySlug);

  res.render('product', {
    title: `${product.title} - TechStore`,
    allCategories,
    product,
    category,
    activeTab: product.categorySlug
  });
});

module.exports = router;
