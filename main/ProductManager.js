/*Clase que tiene como fin gestionar un conjunto de productos.
Restricciones:
-Debe tener campo "id" automatico, unique y autoincremental.
-El campo "code" debe ser unique.
-Todos los campos son obligatorios
*/
const fs = require('fs');

const path='';
// El resto de tu código aquí...

class ProductManager {

    constructor() {
        this.products = [];
    }

    /**
     * @param {*} title  @param {*} description  @param {*} price  @param {*} thumbnail  @param {*} code @param {*} stock 
     * @returns true en caso de que se hayan cargados todos los atributos, false caso contrario.
     */

    validate = (title, description, price, thumbnail, code, stock) => title && description && price && thumbnail && code && stock;

    /**
     * @param {*} code codigo del producto a buscar en la lista de productos.
     * @returns devuelve el objeto en caso de coincidir el code
     */

    existCode = (code) => this.products.find(product => product.code === code);

    /**
     * @param {*} searchId del producto a buscar en la lista de productos
     * @returns objeto o undefinded
     */

    
    async getProduct(searchId){
        const products= await this.getProducts();
        const product = products.find(product=>product.id === searchId);
        
        if(!product){
            return 'No se ha encontrado el producto.';
        }else{
            return product;
        }
    }
    /**
     * @returns listado de todos los productos 
     */

    async getProducts(){
        try {
            if (existsSync(path)) {
                const productsFile = await promises.readFile(path, 'utf-8');
                return JSON.parse(productsFile);
            } else {
                return [];
            }
        } catch (error) {
            return error;
        } 
    }

    /**     
     * @param {*} searchId id del producto a buscar
     * @returns producto en caso de encontrarlo, sino error.
     */

    getProductById(searchId) {
        const result = this.getProduct(searchId);

        if (!result) {
            return console.error('Not found.');
        }

        return console.log(result);
    }


    /**
     * @param {*} title  @param {*} description  @param {*} price  @param {*} thumbnail  @param {*} code  @param {*} stock 
     * @returns se agrega un nuevo producto al listado o devuelvo algun error
     */

  async  addProduct(path,title, description, price, thumbnail, code, stock) {
        try {
            this.path=path;
            if (!this.validate(title, description, price, thumbnail, code, stock)) {
                return console.error('Debe llenar todos los campos, son obligatorios.');
            }
    
            if (this.existCode(code)) {
                return console.error('El codigo ingresado ya existe.')
            }
            
            const products = await  this.getProducts();            
    
            const product = {
                id: !this.products.length ? 1 : this.products[this.products.length - 1].id + 1,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }
    
            products.push(product);
            await promises.writeFile(path,JSON.stringify(products))  ; 

        } catch (error) {
            return error;
        }                
    }

    async deleteProduct(){
        const products = await this.getProducts();
        const newArrayProducts= products.filter(product => product.id !== id);
        
        await promises.writeFile(path, JSON.stringify(products));
    }
}



//---------------------------PRUEBAS------------------------------------------------
const productManager1 = new ProductManager();

productManager1.addProduct('archivoprueba.json','producto prueba', 'esto es un producto prueba', 200, "Sin imagen", "abc123", 25);

productManager1.addProduct('archivoprueba.json','producto prueba', 'esto es un producto prueba', 200, "Sin imagen", "abc1234", 25);

console.log(productManager1.getProducts());

// productManager1.getProductById(1);




