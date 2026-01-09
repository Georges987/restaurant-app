import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Clean existing data
    await prisma.payment.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.dish.deleteMany();
    await prisma.menu.deleteMany();
    await prisma.table.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    await prisma.restaurant.deleteMany();
    await prisma.organization.deleteMany();

    console.log('✅ Cleaned existing data');

    // Create Organization
    const organization = await prisma.organization.create({
        data: {
            name: 'Restaurant Group Demo',
            description: 'Demo organization for testing',
        },
    });
    console.log('✅ Created organization');

    // Create Restaurant
    const restaurant = await prisma.restaurant.create({
        data: {
            organizationId: organization.id,
            name: 'Le Gourmet',
            address: '123 Rue de la Paix, Cotonou',
            phone: '+229 12 34 56 78',
            email: 'contact@legourmet.bj',
            settings: {
                currency: 'XOF',
                timezone: 'Africa/Porto-Novo',
            },
        },
    });
    console.log('✅ Created restaurant');

    // Create Roles
    const superAdminRole = await prisma.role.create({
        data: {
            restaurantId: restaurant.id,
            name: 'Super Admin',
            description: 'Full access to all features',
            isDefault: true,
            permissions: {
                orders: { create: true, read: true, update: true, delete: true },
                menu: { create: true, read: true, update: true, delete: true },
                users: { create: true, read: true, update: true, delete: true },
                tables: { create: true, read: true, update: true, delete: true },
                statistics: { read: true },
                payments: { create: true, read: true, update: true, delete: true },
            },
        },
    });

    const serverRole = await prisma.role.create({
        data: {
            restaurantId: restaurant.id,
            name: 'Server',
            description: 'Can manage orders and payments',
            isDefault: true,
            permissions: {
                orders: { create: true, read: true, update: true, delete: false },
                menu: { create: false, read: true, update: false, delete: false },
                users: { create: false, read: false, update: false, delete: false },
                tables: { create: false, read: true, update: true, delete: false },
                statistics: { read: false },
                payments: { create: true, read: true, update: false, delete: false },
            },
        },
    });

    const cookRole = await prisma.role.create({
        data: {
            restaurantId: restaurant.id,
            name: 'Cook',
            description: 'Can view and update order status',
            isDefault: true,
            permissions: {
                orders: { create: false, read: true, update: true, delete: false },
                menu: { create: false, read: true, update: false, delete: false },
                users: { create: false, read: false, update: false, delete: false },
                tables: { create: false, read: true, update: false, delete: false },
                statistics: { read: false },
                payments: { create: false, read: false, update: false, delete: false },
            },
        },
    });
    console.log('✅ Created roles');

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.create({
        data: {
            restaurantId: restaurant.id,
            roleId: superAdminRole.id,
            email: 'admin@legourmet.bj',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            phone: '+229 12 34 56 78',
        },
    });

    const server = await prisma.user.create({
        data: {
            restaurantId: restaurant.id,
            roleId: serverRole.id,
            email: 'server@legourmet.bj',
            password: hashedPassword,
            firstName: 'Server',
            lastName: 'User',
            phone: '+229 12 34 56 79',
        },
    });

    const cook = await prisma.user.create({
        data: {
            restaurantId: restaurant.id,
            roleId: cookRole.id,
            email: 'cook@legourmet.bj',
            password: hashedPassword,
            firstName: 'Cook',
            lastName: 'User',
            phone: '+229 12 34 56 80',
        },
    });
    console.log('✅ Created users');

    // Create Tables
    const tables = await Promise.all([
        prisma.table.create({
            data: {
                restaurantId: restaurant.id,
                number: '1',
                capacity: 2,
                status: 'AVAILABLE',
            },
        }),
        prisma.table.create({
            data: {
                restaurantId: restaurant.id,
                number: '2',
                capacity: 4,
                status: 'AVAILABLE',
            },
        }),
        prisma.table.create({
            data: {
                restaurantId: restaurant.id,
                number: '3',
                capacity: 6,
                status: 'AVAILABLE',
            },
        }),
        prisma.table.create({
            data: {
                restaurantId: restaurant.id,
                number: '4',
                capacity: 4,
                status: 'AVAILABLE',
            },
        }),
    ]);
    console.log('✅ Created tables');

    // Create Menu
    const menu = await prisma.menu.create({
        data: {
            restaurantId: restaurant.id,
            name: 'Menu Principal',
            description: 'Notre sélection de plats',
            isActive: true,
        },
    });
    console.log('✅ Created menu');

    // Create Dishes
    const dishes = await Promise.all([
        prisma.dish.create({
            data: {
                menuId: menu.id,
                name: 'Poulet Braisé',
                description: 'Poulet grillé avec sauce pimentée',
                price: 2500,
                category: 'Plats Principaux',
                isAvailable: true,
            },
        }),
        prisma.dish.create({
            data: {
                menuId: menu.id,
                name: 'Poisson Grillé',
                description: 'Poisson frais grillé avec légumes',
                price: 3000,
                category: 'Plats Principaux',
                isAvailable: true,
            },
        }),
        prisma.dish.create({
            data: {
                menuId: menu.id,
                name: 'Riz Sauce Tomate',
                description: 'Riz avec sauce tomate maison',
                price: 1500,
                category: 'Plats Principaux',
                isAvailable: true,
            },
        }),
        prisma.dish.create({
            data: {
                menuId: menu.id,
                name: 'Alloco',
                description: 'Bananes plantains frites',
                price: 500,
                category: 'Accompagnements',
                isAvailable: true,
            },
        }),
        prisma.dish.create({
            data: {
                menuId: menu.id,
                name: 'Salade Verte',
                description: 'Salade fraîche du jour',
                price: 800,
                category: 'Entrées',
                isAvailable: true,
            },
        }),
        prisma.dish.create({
            data: {
                menuId: menu.id,
                name: 'Jus de Bissap',
                description: 'Jus de fleur d\'hibiscus',
                price: 500,
                category: 'Boissons',
                isAvailable: true,
            },
        }),
    ]);
    console.log('✅ Created dishes');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test credentials:');
    console.log('Super Admin: admin@legourmet.bj / password123');
    console.log('Server: server@legourmet.bj / password123');
    console.log('Cook: cook@legourmet.bj / password123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
