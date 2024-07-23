
class Product {
  constructor(title, description, price, thumbnail, code, stock){
    this.tile = title
    this.description = description
    this.price = price
    this.thumbnail = thumbnail
    this.code = code
    this.stock = stock
  }

}

class ProductManager {
    constructor() {
      this.products = [];
    }
    
    addProduct(title, description, price, thumbnail, code, stock){
      const product = new Product(title, description, price, thumbnail, code, stock);
      this.products.push(product);
    }

    getProducts(){
      return this.products;
    }

    getProductsById(code){
      const product = this.products.find(product => product.code === code);
      if (product) {
        return product
      } else {
        console.error("Not Found");
        return null;
      
      }
    }

  }


const productManager = new ProductManager();
  productManager.addProduct('Remera', 'Remera verde', 1500, './imgs/remera.png', '12', 2);
  productManager.addProduct('Pantalon', 'Verde verde', 1600, './imgs/pantalon.png', '13', 3);
  productManager.addProduct('Camisa', 'Camisa verde', 1700, './imgs/camisa.png', 11, 3);


  
console.log(productManager.getProducts());

console.log(productManager.getProductsById('13'));
console.log(productManager.getProductsById(11));
console.log(productManager.getProductsById('12'));
