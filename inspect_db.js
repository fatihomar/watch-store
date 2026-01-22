const Product = require('./models/Product');
const sequelize = require('./config/database');

const inspect = async () => {
    try {
        await sequelize.authenticate();
        const products = await Product.findAll();
        console.log(JSON.stringify(products, null, 2));
    } catch (err) {
        console.error(err);
    }
};

inspect();
