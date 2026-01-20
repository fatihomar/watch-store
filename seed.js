const Product = require('./models/Product');

const sequelize = require('./config/database');

const seedDB = async () => {
    try {
        await sequelize.sync({ force: true }); // Drop and Recreate Tables
        console.log('🔄 Database Schema Updated');

        // await Product.destroy({ where: {}, truncate: true }); // No longer needed with force: true
        console.log('🧹 Cleared existing products');

        const products = [
            /* ... (same products array, I will preserve it in the multi-line block below) ... */
            // MEN (1-5)
            {
                name: 'Rolex Cosmograph Daytona',
                brand: 'Rolex',
                price: 45000,
                category: 'Luxury',
                gender: 'Men',
                image: '/images/watch1.jpg',
                description: 'Efsanevi yarış kronografı. Hassasiyet ve stilin mükemmel birleşimi.',
                featured: true,
                specs: { mechanism: 'Otomatik', caseSize: '40mm', material: 'Oystersteel', waterResistance: '100m' }
            },
            {
                name: 'Tag Heuer Carrera',
                brand: 'Tag Heuer',
                price: 5200,
                category: 'Sport',
                gender: 'Men',
                image: '/images/watch2.jpg',
                description: 'Cesur ve sportif tasarım. Motor sporları tutkunları için üretildi.',
                featured: true
            },
            {
                name: 'Patek Philippe Nautilus',
                brand: 'Patek Philippe',
                price: 120000,
                category: 'Luxury',
                gender: 'Men',
                image: '/images/watch3.jpg',
                description: 'Zarafetin zirvesi. Eşsiz sekizgen bezel tasarımı.',
                featured: true
            },
            {
                name: 'Omega Speedmaster',
                brand: 'Omega',
                price: 7600,
                category: 'Classic',
                gender: 'Men',
                image: '/images/watch4.jpg',
                description: 'Aya ilk çıkan saat. Tarihi miras ve modern teknoloji.'
            },
            {
                name: 'Hublot Big Bang',
                brand: 'Hublot',
                price: 18500,
                category: 'Luxury',
                gender: 'Men',
                image: '/images/watch5.jpg',
                description: 'Füzyon sanatı. Seramik ve titanyumun güçlü uyumu.'
            },

            // WOMEN (6-10)
            {
                name: 'Cartier Tank Must',
                brand: 'Cartier',
                price: 3800,
                category: 'Classic',
                gender: 'Women',
                image: '/images/watch6.jpg',
                description: 'Zamansız bir ikon. Sade ve sofistike tasarım.',
                featured: true
            },
            {
                name: 'Michael Kors Rose Gold',
                brand: 'Michael Kors',
                price: 450,
                category: 'Classic', // Changed from Unisex to Classic because Unisex is not in schema enum
                gender: 'Women',
                image: '/images/watch7.jpg',
                description: 'Şık ve modern. Günlük kullanım için ideal parlaklık.'
            },
            {
                name: 'Daniel Wellington Petite',
                brand: 'Daniel Wellington',
                price: 189,
                category: 'Classic',
                gender: 'Women',
                image: '/images/watch8.jpg',
                description: 'Minimalist tasarım. Her kıyafetle uyumlu.',
                featured: true
            },
            {
                name: 'Rolex Lady-Datejust',
                brand: 'Rolex',
                price: 14500,
                category: 'Luxury',
                gender: 'Women',
                image: '/images/watch9.jpg',
                description: 'Klasik Rolex estetiği, zarif boyutlarda.'
            },
            {
                name: 'Longines DolceVita',
                brand: 'Longines',
                price: 2100,
                category: 'Classic',
                gender: 'Women',
                image: '/images/watch10.jpg',
                description: 'İtalyan yaşam tarzından ilham alan zarif dikdörtgen tasarım.'
            },

            // UNISEX / EXTRA (11-14)
            {
                name: 'Apple Watch Series 9',
                brand: 'Apple',
                price: 799,
                category: 'Smart',
                gender: 'Unisex',
                image: '/images/watch11.jpg',
                description: 'En gelişmiş sağlık sensörleri ve hep açık ekran.'
            },
            {
                name: 'Seiko Prospex Diver',
                brand: 'Seiko',
                price: 1200,
                category: 'Sport',
                gender: 'Men',
                image: '/images/watch12.jpg',
                description: 'Profesyonel dalgıç saati. 200m su geçirmezlik.'
            },
            {
                name: 'Casio G-Shock Carbon',
                brand: 'Casio',
                price: 250,
                category: 'Sport',
                gender: 'Unisex',
                image: '/images/watch13.jpg',
                description: 'Kırılmaz sağlamlık. Karbon çekirdek koruma yapısı.'
            },
            {
                name: 'Audemars Piguet Royal Oak',
                brand: 'Audemars Piguet',
                price: 85000,
                category: 'Luxury',
                gender: 'Men',
                image: '/images/watch14.jpg',
                description: 'Lüks spor saatinin tanımı. Entegre bilezik tasarımı.'
            },
            {
                name: 'Richard Mille RM 11-03',
                brand: 'Richard Mille',
                price: 180000,
                category: 'Luxury',
                gender: 'Men',
                image: '/images/watch15.jpg',
                description: 'İleri teknoloji ve sıradışı tasarım.',
                featured: true
            },
            {
                name: 'Breitling Navitimer',
                brand: 'Breitling',
                price: 8500,
                category: 'Sport',
                gender: 'Men',
                image: '/images/watch16.jpg',
                description: 'Havacılık efsanesi. Kronograf ve hesap cetveli bezel.'
            },
            {
                name: 'IWC Portugieser',
                brand: 'IWC',
                price: 12500,
                category: 'Classic',
                gender: 'Men',
                image: '/images/watch17.jpg',
                description: 'Zarif ve karmaşık. İkonik tasarım.'
            },
            {
                name: 'Panerai Luminor',
                brand: 'Panerai',
                price: 6800,
                category: 'Sport',
                gender: 'Men',
                image: '/images/watch18.jpg',
                description: 'İtalyan tasarımı, İsviçre teknolojisi. Eşsiz kurma kolu koruması.'
            },
            {
                name: 'Vacheron Constantin Overseas',
                brand: 'Vacheron Constantin',
                price: 25000,
                category: 'Luxury',
                gender: 'Men',
                image: '/images/watch19.jpg',
                description: 'Seyahat tutkunları için sportif şıklık.'
            },
            {
                name: 'Jaeger-LeCoultre Reverso',
                brand: 'Jaeger-LeCoultre',
                price: 10500,
                category: 'Classic',
                gender: 'Unisex',
                image: '/images/watch20.jpg',
                description: 'Dönebilen kasa tasarımı. Art Deco klasiği.'
            }
        ];

        await Product.bulkCreate(products);
        console.log('✅ Seeded ' + products.length + ' products');
    } catch (err) {
        console.error(err);
    }
};

module.exports = seedDB;
