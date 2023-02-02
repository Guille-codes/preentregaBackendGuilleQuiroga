const fs = require('fs');
const path = './src/carts/carts.json'

if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify([], null, "\t"));
} 

async function getCartFromDB(cid) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    let carts = JSON.parse(data);
                    let cart = carts.find(c => c.id === cid);
                    if (!cart) {
                        reject(new Error(`No se encontró un carrito con el id ${cid}`));
                    } else {
                        resolve(cart);
                    }
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
}

async function addCartToDB(newCart) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    let carts = JSON.parse(data);

                    carts.push(newCart);
                    fs.writeFile(path, JSON.stringify(carts), err => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(newCart);
                        }
                    });
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
}

async function updateCartInDB(cid, updatedCart) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    let carts = JSON.parse(data);
                    let cartIndex = carts.findIndex(c => c.id === cid);
                    if (cartIndex === -1) {
                        reject(new Error(`No se encontró un carrito con el id ${cid}`));
                    } else {
                        Object.assign(carts[cartIndex], updatedCart);
                        fs.writeFile(path, JSON.stringify(carts), err => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(carts[cartIndex]);
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

module.exports = { getCartFromDB, addCartToDB, updateCartInDB}