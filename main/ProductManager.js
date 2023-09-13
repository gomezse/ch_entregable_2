// import para hacer uso de File System nativo de node
const fs = require('fs');



class ProductManager {

    constructor() {
        this.products = [];
    }

    /**
     * @param {*} title  @param {*} description  @param {*} price  @param {*} thumbnail  @param {*} code @param {*} stock 
     * @returns true en caso de que se hayan cargados todos los atributos, false caso contrario.
     */

    validate = (title, description, price, thumbnail, code, stock) => title && description && price && thumbnail && code && stock;

    //Devolver true en caso de encontrar un objeto con el code, caso contrario false.
    async existCode(code, path) {
        const products = await this.getProducts(path);
        const existingProduct = products.find(product => product.code === code);

        return Boolean(existingProduct);
    }

    //Obtener un objeto del archivo mediante su id.
    async getProductById(searchId, path) {
        const products = await this.getProducts(path);
        const product = products.find(product => product.id === searchId);

        if (!product) {
            return 'No se ha encontrado el producto.';
        } else {
            return product;
        }
    }

    //Obtener el listado de productos del archivo.
    async getProducts(path) {
        try {
            if (fs.existsSync(path)) {
                const productsFile = await fs.promises.readFile(path, 'utf-8');
                return JSON.parse(productsFile);
            } else {
                return [];
            }
        } catch (error) {
            return error;
        }
    }

    //Agregar un nuevo producto.
    async addProduct(path, title, description, price, thumbnail, code, stock) {
        try {

            if (!this.validate(title, description, price, thumbnail, code, stock)) {
                return console.error('Debe llenar todos los campos, son obligatorios.');
            }

            //El control de code repetido, solo se hace en caso de que el archivo exista.
            if (fs.existsSync(path)) {

                const existCode = await this.existCode(code, path);

                if (existCode) {
                    return console.error('El codigo ingresado ya existe.')
                }
            }

            const products = await this.getProducts(path);

            const product = {
                id: !products.length ? 1 : products[products.length - 1].id + 1,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }

            products.push(product);
            await fs.promises.writeFile(path, JSON.stringify(products));

        } catch (error) {
            return error;
        }
    }

    //Eliminar un objeto del archivo
    async deleteProduct(path, id) {
        const products = await this.getProducts(path);
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex === -1) {

            return console.error('No existe el ID a eliminar.');

        } else {

            const newArrayProducts = products.filter(product => product.id !== id);

            await fs.promises.writeFile(path, JSON.stringify(newArrayProducts));
        }

    }

    //Modificar parcial o total los atributos de un objeto del archivo.(sin modificar su id)
    async updateProduct(path, id, updatedFields) {
        try {
            const products = await this.getProducts(path);
            const productIndex = products.findIndex(product => product.id === id);

            if (productIndex === -1) {
                return console.error('No se ha encontrado el producto.');
            }

            const updatedProduct = { ...products[productIndex], ...updatedFields };

            //forzar que por mas que venga el id como parametro a modificar, no se cambie.
            updatedProduct.id = products[productIndex].id;

            products[productIndex] = updatedProduct;

            await fs.promises.writeFile(path, JSON.stringify(products));

            return updatedProduct;
        } catch (error) {
            return error;
        }
    }


}



//---------------------------PRUEBAS------------------------------------------------
async function test() {

    const path = 'archivo1.json';
    const productManager = new ProductManager();


    //dar de alta productos
    await productManager.addProduct(path, 'producto prueba1', 'esto es un producto prueba1', 300, "Sin imagen1", "abc131", 34);
    await productManager.addProduct(path, 'producto prueba2', 'esto es un producto prueba2', 400, "Sin imagen2", "abc1222", 45);


    //generar error de duplicado y guardar el que cumpla los requisitos.
    // await productManager.addProduct(path, 'producto prueba1', 'esto es un producto prueba1', 300, "Sin imagen1", "abc131", 34);
    // await productManager.addProduct(path, 'producto prueba3', 'esto es un producto prueba3', 400, "Sin imagen3", "abc22", 45);


    //obtener listado de todos los productos.
    // const products = await productManager.getProducts(path);

    // console.log(products);



    //obtener un objeto en especial por id
    // const product = await productManager.getProductById(2, path);

    // console.log(product);



    //eliminar un objeto del archivo
    // const deletedProduct = await productManager.deleteProduct(path, 2);
    // const postDeleteList = await productManager.getProducts(path);

    // console.log(postDeleteList);



    //updetear un objeto parcial o total    
    // const updatedFields = { id:1,title: 'titulo update', description: "update del objeto", price: 999 };
    // const updatedProduct = await productManager.updateProduct(path, 3, updatedFields)

    // console.log('updateado', updatedProduct);
    // const postUpdateList = await productManager.getProducts(path);

    // console.log(postUpdateList);

}

test();
