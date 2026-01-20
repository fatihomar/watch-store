const seedDB = require('./seed');

(async () => {
    console.log('Starting Manual Seed...');
    await seedDB();
    console.log('Seed Completed.');
    process.exit();
})();
