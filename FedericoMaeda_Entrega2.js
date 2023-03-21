const fs = require("fs/promises");

class ProductManager {
  constructor(path) {
    this.products = [];
    this.lastId = 0;
    this.path = path;
  }

  async init() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      this.products = products;
      this.lastId = products.length > 0 ? products[products.length - 1].id : 0;
    } catch (error) {
      console.error(error);
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("All fields are required");
      return;
    }

    if (this.products.find((product) => product.code === code)) {
      console.error("Product with code already exists");
      return;
    }

    const newProduct = {
      id: ++this.lastId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    await this.saveProducts();
  }

  getProducts() {
    return this.products;
  }

  async getProductById(id) {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      const product = products.find((product) => product.id === id);
  
      if (!product) {
        console.error("Product not found");
        return;
      }
  
      return product;
    } catch (error) {
      console.error(error);
    }
  }

  async updateProduct(id, updates) {
    const productIndex = this.products.findIndex((product) => product.id === id);
  
    if (productIndex === -1) {
      console.error("Product not found");
      return;
    }
  
    const updatedProduct = {
      ...this.products[productIndex],
      ...updates,
      id
    }
  
    if (this.products.find((product) => product.code === updatedProduct.code && product.id !== updatedProduct.id)) {
      console.error("Product with code already exists");
      return;
    }
  
    Object.assign(this.products[productIndex], updatedProduct);
    await this.saveProducts();

    
  }
  

  

  async deleteProduct(id) {
    const productIndex = this.products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      console.error("Product not found");
      return;
    }

    this.products.splice(productIndex, 1);
    await this.saveProducts();
  }

  async saveProducts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products));
      console.log("Products saved successfully!");
    } catch (error) {
      console.error(error);
    }
  }
}

const productManager = new ProductManager("./productos.json");
productManager.init();

(async () => {
  await productManager.addProduct(
    "producto prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc123",
    25
  );

  
  // test
  console.log(productManager.getProducts());

  // get the product by id
  const product = await productManager.getProductById(1);
  console.log("Original product:", product);


  // update the price of the product
  await productManager.updateProduct(1, { price: 250 });

  // get the updated product by id
  const updatedProduct = await productManager.getProductById(1);
  console.log("Updated product:", updatedProduct);


 // delete product
  await productManager.deleteProduct(1);

  console.log(productManager.getProducts());
})();

