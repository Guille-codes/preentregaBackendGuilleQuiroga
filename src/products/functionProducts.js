const fs = require("fs");
const path = "./src/products/products.json";

if (!fs.existsSync(path)) {
  fs.writeFileSync(path, JSON.stringify([], null, "\t"));
}

async function getAllProductsFromDB(limit) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          let products = JSON.parse(data);
          if (limit) {
            products = products.slice(0, limit);
          }
          resolve(products);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

async function getProductFromDB(pid) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          let products = JSON.parse(data);
          let product = products.find((p) => p.id === pid);
          if (!product) {
            reject(new Error(`No se encontró un producto con el id ${pid}`));
          } else {
            resolve(product);
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

async function addProductToDB(newProduct) {
  try {
    const data = await fs.promises.readFile(path);
    const products = JSON.parse(data);

    const existingProduct = products.find(
      (product) => product.code === newProduct.code
    );

    if (existingProduct) {
      throw { 'error': "el codigo de producto ya existe." };
    }
    products.push(newProduct);
    await fs.promises.writeFile(path, JSON.stringify(products));
    return newProduct;
  } catch (error) {
    throw error;
  }

}

async function updateProductInDB(pid, updatedProduct) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          let products = JSON.parse(data);
          let productIndex = products.findIndex((p) => p.id === pid);
          if (productIndex === -1) {
            reject(new Error(`No se encontró un producto con el id ${pid}`));
          } else {
            Object.assign(products[productIndex], updatedProduct);
            fs.writeFile(path, JSON.stringify(products), (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(products[productIndex]);
              }
            });
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

async function deleteProductFromDB(pid) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          let products = JSON.parse(data);
          let productIndex = products.findIndex((p) => p.id === pid);
          if (productIndex === -1) {
            reject(new Error(`No se encontró un producto con el id ${pid}`));
          } else {
            products.splice(productIndex, 1);
            fs.writeFile(path, JSON.stringify(products), (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

module.exports = {
  getProductFromDB,
  getAllProductsFromDB,
  addProductToDB,
  updateProductInDB,
  deleteProductFromDB,
};
