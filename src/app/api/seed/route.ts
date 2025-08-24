import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const demoUsers = [
  {
    name: "Admin User",
    email: "admin@bongflavours.com",
    password: "admin123",
    phone: "9876543210",
    role: "admin",
    addresses: []
  },
  {
    name: "Raj Kumar",
    email: "raj@example.com",
    password: "password123",
    phone: "9876543211",
    role: "customer",
    addresses: [
      {
        type: "home",
        street: "123 Park Street",
        city: "Kolkata",
        state: "West Bengal",
        zipCode: "700016",
        isDefault: true
      }
    ]
  },
  {
    name: "Priya Sharma",
    email: "priya@example.com",
    password: "password123",
    phone: "9876543212",
    role: "customer",
    addresses: [
      {
        type: "home",
        street: "456 Salt Lake",
        city: "Kolkata",
        state: "West Bengal",
        zipCode: "700064",
        isDefault: true
      }
    ]
  },
  {
    name: "Rahul Kumar",
    email: "rahul@example.com",
    password: "password123",
    phone: "9876543213",
    role: "customer",
    addresses: [
      {
        type: "home",
        street: "789 New Town",
        city: "Kolkata",
        state: "West Bengal",
        zipCode: "700156",
        isDefault: true
      }
    ]
  },
  {
    name: "Amit Das",
    email: "amit@example.com",
    password: "password123",
    phone: "9876543214",
    role: "customer",
    addresses: [
      {
        type: "home",
        street: "321 Ballygunge",
        city: "Kolkata",
        state: "West Bengal",
        zipCode: "700019",
        isDefault: true
      }
    ]
  },
  {
    name: "Sneha Roy",
    email: "sneha@example.com",
    password: "password123",
    phone: "9876543215",
    role: "customer",
    addresses: [
      {
        type: "home",
        street: "321 Ballygunge",
        city: "Kolkata",
        state: "West Bengal",
        zipCode: "700019",
        isDefault: true
      }
    ]
  },
  {
    name: "Debdoot Manna",
    email: "debdootmanna007@gmail.com",
    password: "password123",
    phone: "8238018577",
    role: "admin",
    addresses: [
      {
        type: "home",
        street: "Your Address",
        city: "Your City",
        state: "Your State",
        zipCode: "700001",
        isDefault: true
      }
    ]
  }
];

const menuItems = [
  // STARTERS
  { name: "Fish Fry", category: "starters", price: 250, description: "Crispy fried fish with Bengali spices", image: "/images/fish-fry.jpg", isVeg: false, isAvailable: true },
  { name: "Chicken Kobiraji", category: "starters", price: 280, description: "Breaded chicken cutlet Bengali style", image: "/images/chicken-kobiraji.jpg", isVeg: false, isAvailable: true },
  { name: "Prawn Kobiraji", category: "starters", price: 320, description: "Crispy breaded prawns", image: "/images/prawn-kobiraji.jpg", isVeg: false, isAvailable: true },
  { name: "Mutton Kosha", category: "starters", price: 350, description: "Slow-cooked spicy mutton", image: "/images/mutton-kosha.jpg", isVeg: false, isAvailable: true },
  { name: "Beguni", category: "starters", price: 120, description: "Crispy fried brinjal fritters", image: "/images/beguni.jpg", isVeg: true, isAvailable: true },
  { name: "Aloo Kabli", category: "starters", price: 100, description: "Spiced potato chaat", image: "/images/aloo-kabli.jpg", isVeg: true, isAvailable: true },
  { name: "Ghugni", category: "starters", price: 80, description: "Spiced yellow peas", image: "/images/ghugni.jpg", isVeg: true, isAvailable: true },
  { name: "Telebhaja", category: "starters", price: 90, description: "Mixed vegetable fritters", image: "/images/telebhaja.jpg", isVeg: true, isAvailable: true },

  // RICE DISHES
  { name: "Mutton Biryani", category: "rice", price: 450, description: "Aromatic basmati rice with tender mutton", image: "/images/mutton-biryani.jpg", isVeg: false, isAvailable: true },
  { name: "Chicken Biryani", category: "rice", price: 380, description: "Fragrant rice with chicken pieces", image: "/images/chicken-biryani.jpg", isVeg: false, isAvailable: true },
  { name: "Kosha Mangsho with Rice", category: "rice", price: 420, description: "Spicy mutton curry with steamed rice", image: "/images/kosha-rice.jpg", isVeg: false, isAvailable: true },
  { name: "Fish Curry Rice", category: "rice", price: 320, description: "Bengali fish curry with rice", image: "/images/fish-curry-rice.jpg", isVeg: false, isAvailable: true },
  { name: "Egg Curry Rice", category: "rice", price: 250, description: "Spiced egg curry with rice", image: "/images/egg-curry-rice.jpg", isVeg: false, isAvailable: true },
  { name: "Dal Rice", category: "rice", price: 180, description: "Lentil curry with steamed rice", image: "/images/dal-rice.jpg", isVeg: true, isAvailable: true },
  { name: "Veg Biryani", category: "rice", price: 280, description: "Aromatic rice with mixed vegetables", image: "/images/veg-biryani.jpg", isVeg: true, isAvailable: true },
  { name: "Jeera Rice", category: "rice", price: 150, description: "Cumin flavored basmati rice", image: "/images/jeera-rice.jpg", isVeg: true, isAvailable: true },

  // FISH & SEAFOOD
  { name: "Hilsa Fish Curry", category: "fish", price: 550, description: "Bengali favorite hilsa in mustard gravy", image: "/images/hilsa-curry.jpg", isVeg: false, isAvailable: true },
  { name: "Rohu Fish Curry", category: "fish", price: 420, description: "Traditional Bengali fish curry", image: "/images/rohu-curry.jpg", isVeg: false, isAvailable: true },
  { name: "Prawn Malaikari", category: "fish", price: 480, description: "Prawns in coconut milk curry", image: "/images/prawn-malaikari.jpg", isVeg: false, isAvailable: true },
  { name: "Fish Doi Katla", category: "fish", price: 450, description: "Fish curry in yogurt gravy", image: "/images/fish-doi.jpg", isVeg: false, isAvailable: true },
  { name: "Chingri Bhapa", category: "fish", price: 520, description: "Steamed prawns in coconut", image: "/images/chingri-bhapa.jpg", isVeg: false, isAvailable: true },
  { name: "Fish Kalia", category: "fish", price: 400, description: "Rich fish curry with potatoes", image: "/images/fish-kalia.jpg", isVeg: false, isAvailable: true },
  { name: "Bhetki Paturi", category: "fish", price: 480, description: "Fish steamed in banana leaf", image: "/images/bhetki-paturi.jpg", isVeg: false, isAvailable: true },
  { name: "Crab Curry", category: "fish", price: 580, description: "Bengali style crab curry", image: "/images/crab-curry.jpg", isVeg: false, isAvailable: true },

  // CHICKEN
  { name: "Chicken Curry", category: "chicken", price: 350, description: "Traditional Bengali chicken curry", image: "/images/chicken-curry.jpg", isVeg: false, isAvailable: true },
  { name: "Chicken Rezala", category: "chicken", price: 380, description: "Mughlai style chicken in white gravy", image: "/images/chicken-rezala.jpg", isVeg: false, isAvailable: true },
  { name: "Chicken Chaap", category: "chicken", price: 400, description: "Tender chicken in rich gravy", image: "/images/chicken-chaap.jpg", isVeg: false, isAvailable: true },
  { name: "Chicken Kasha", category: "chicken", price: 370, description: "Dry spicy chicken preparation", image: "/images/chicken-kasha.jpg", isVeg: false, isAvailable: true },
  { name: "Chicken Dak Bungalow", category: "chicken", price: 420, description: "Anglo-Indian style chicken curry", image: "/images/chicken-dak.jpg", isVeg: false, isAvailable: true },
  { name: "Butter Chicken", category: "chicken", price: 390, description: "Creamy tomato based chicken", image: "/images/butter-chicken.jpg", isVeg: false, isAvailable: true },
  { name: "Chicken Tikka", category: "chicken", price: 320, description: "Grilled marinated chicken pieces", image: "/images/chicken-tikka.jpg", isVeg: false, isAvailable: true },
  { name: "Chicken Korma", category: "chicken", price: 410, description: "Chicken in aromatic yogurt gravy", image: "/images/chicken-korma.jpg", isVeg: false, isAvailable: true },

  // MUTTON
  { name: "Mutton Curry", category: "mutton", price: 480, description: "Traditional Bengali mutton curry", image: "/images/mutton-curry.jpg", isVeg: false, isAvailable: true },
  { name: "Kosha Mangsho", category: "mutton", price: 520, description: "Slow-cooked spicy mutton", image: "/images/kosha-mangsho.jpg", isVeg: false, isAvailable: true },
  { name: "Mutton Rezala", category: "mutton", price: 550, description: "Mutton in rich white gravy", image: "/images/mutton-rezala.jpg", isVeg: false, isAvailable: true },
  { name: "Mutton Kalia", category: "mutton", price: 500, description: "Rich mutton curry with potatoes", image: "/images/mutton-kalia.jpg", isVeg: false, isAvailable: true },
  { name: "Mutton Chaap", category: "mutton", price: 580, description: "Tender mutton ribs in gravy", image: "/images/mutton-chaap.jpg", isVeg: false, isAvailable: true },
  { name: "Mutton Bhuna", category: "mutton", price: 510, description: "Dry roasted mutton with spices", image: "/images/mutton-bhuna.jpg", isVeg: false, isAvailable: true },
  { name: "Mutton Korma", category: "mutton", price: 530, description: "Mutton in aromatic gravy", image: "/images/mutton-korma.jpg", isVeg: false, isAvailable: true },
  { name: "Keema Curry", category: "mutton", price: 420, description: "Minced mutton curry", image: "/images/keema-curry.jpg", isVeg: false, isAvailable: true },

  // VEGETARIAN
  { name: "Aloo Posto", category: "vegetarian", price: 180, description: "Potatoes in poppy seed paste", image: "/images/aloo-posto.jpg", isVeg: true, isAvailable: true },
  { name: "Shukto", category: "vegetarian", price: 220, description: "Mixed vegetables in light gravy", image: "/images/shukto.jpg", isVeg: true, isAvailable: true },
  { name: "Cholar Dal", category: "vegetarian", price: 160, description: "Bengali style chana dal", image: "/images/cholar-dal.jpg", isVeg: true, isAvailable: true },
  { name: "Paneer Butter Masala", category: "vegetarian", price: 280, description: "Cottage cheese in tomato gravy", image: "/images/paneer-butter.jpg", isVeg: true, isAvailable: true },
  { name: "Palak Paneer", category: "vegetarian", price: 260, description: "Cottage cheese in spinach gravy", image: "/images/palak-paneer.jpg", isVeg: true, isAvailable: true },
  { name: "Dal Tadka", category: "vegetarian", price: 140, description: "Tempered yellow lentils", image: "/images/dal-tadka.jpg", isVeg: true, isAvailable: true },
  { name: "Baingan Bharta", category: "vegetarian", price: 200, description: "Mashed roasted eggplant", image: "/images/baingan-bharta.jpg", isVeg: true, isAvailable: true },
  { name: "Aloo Gobi", category: "vegetarian", price: 190, description: "Potato and cauliflower curry", image: "/images/aloo-gobi.jpg", isVeg: true, isAvailable: true },
  { name: "Mixed Veg Curry", category: "vegetarian", price: 210, description: "Seasonal mixed vegetables", image: "/images/mixed-veg.jpg", isVeg: true, isAvailable: true },
  { name: "Dhokar Dalna", category: "vegetarian", price: 240, description: "Lentil cakes in curry", image: "/images/dhokar-dalna.jpg", isVeg: true, isAvailable: true },

  // BREADS
  { name: "Luchi", category: "breads", price: 60, description: "Puffed deep-fried bread", image: "/images/luchi.jpg", isVeg: true, isAvailable: true },
  { name: "Kochuri", category: "breads", price: 80, description: "Stuffed puffed bread", image: "/images/kochuri.jpg", isVeg: true, isAvailable: true },
  { name: "Paratha", category: "breads", price: 70, description: "Layered flatbread", image: "/images/paratha.jpg", isVeg: true, isAvailable: true },
  { name: "Roti", category: "breads", price: 50, description: "Simple wheat flatbread", image: "/images/roti.jpg", isVeg: true, isAvailable: true },
  { name: "Naan", category: "breads", price: 90, description: "Soft leavened bread", image: "/images/naan.jpg", isVeg: true, isAvailable: true },
  { name: "Butter Naan", category: "breads", price: 110, description: "Naan brushed with butter", image: "/images/butter-naan.jpg", isVeg: true, isAvailable: true },
  { name: "Garlic Naan", category: "breads", price: 120, description: "Naan with garlic and herbs", image: "/images/garlic-naan.jpg", isVeg: true, isAvailable: true },
  { name: "Radhaballabhi", category: "breads", price: 90, description: "Lentil stuffed puffed bread", image: "/images/radhaballabhi.jpg", isVeg: true, isAvailable: true },

  // DESSERTS
  { name: "Rasgulla", category: "desserts", price: 120, description: "Soft cottage cheese balls in syrup", image: "/images/rasgulla.jpg", isVeg: true, isAvailable: true },
  { name: "Sandesh", category: "desserts", price: 150, description: "Traditional Bengali sweet", image: "/images/sandesh.jpg", isVeg: true, isAvailable: true },
  { name: "Mishti Doi", category: "desserts", price: 100, description: "Sweet curd dessert", image: "/images/mishti-doi.jpg", isVeg: true, isAvailable: true },
  { name: "Payesh", category: "desserts", price: 140, description: "Rice pudding with jaggery", image: "/images/payesh.jpg", isVeg: true, isAvailable: true },
  { name: "Kulfi", category: "desserts", price: 110, description: "Traditional Indian ice cream", image: "/images/kulfi.jpg", isVeg: true, isAvailable: true },
  { name: "Gulab Jamun", category: "desserts", price: 130, description: "Deep-fried milk balls in syrup", image: "/images/gulab-jamun.jpg", isVeg: true, isAvailable: true },
  { name: "Soan Papdi", category: "desserts", price: 160, description: "Flaky sweet confection", image: "/images/soan-papdi.jpg", isVeg: true, isAvailable: true },
  { name: "Jalebi", category: "desserts", price: 120, description: "Crispy sweet spirals in syrup", image: "/images/jalebi.jpg", isVeg: true, isAvailable: true },

  // BEVERAGES
  { name: "Masala Chai", category: "beverages", price: 40, description: "Spiced milk tea", image: "/images/masala-chai.jpg", isVeg: true, isAvailable: true },
  { name: "Lassi (Sweet)", category: "beverages", price: 80, description: "Sweet yogurt drink", image: "/images/sweet-lassi.jpg", isVeg: true, isAvailable: true },
  { name: "Lassi (Salted)", category: "beverages", price: 80, description: "Salted yogurt drink", image: "/images/salted-lassi.jpg", isVeg: true, isAvailable: true },
  { name: "Fresh Lime Water", category: "beverages", price: 60, description: "Fresh lime juice with water", image: "/images/lime-water.jpg", isVeg: true, isAvailable: true },
  { name: "Mango Juice", category: "beverages", price: 100, description: "Fresh mango juice", image: "/images/mango-juice.jpg", isVeg: true, isAvailable: true },
  { name: "Coconut Water", category: "beverages", price: 70, description: "Fresh coconut water", image: "/images/coconut-water.jpg", isVeg: true, isAvailable: true },
  { name: "Coffee", category: "beverages", price: 50, description: "Hot filter coffee", image: "/images/coffee.jpg", isVeg: true, isAvailable: true },
  { name: "Cold Coffee", category: "beverages", price: 90, description: "Iced coffee with milk", image: "/images/cold-coffee.jpg", isVeg: true, isAvailable: true },
  { name: "Thums Up", category: "beverages", price: 50, description: "Cola soft drink", image: "/images/thumbs-up.jpg", isVeg: true, isAvailable: true },
  { name: "Sprite", category: "beverages", price: 50, description: "Lemon lime soda", image: "/images/sprite.jpg", isVeg: true, isAvailable: true },

  // SPECIAL THALIS
  { name: "Bengali Veg Thali", category: "thalis", price: 350, description: "Complete vegetarian Bengali meal", image: "/images/veg-thali.jpg", isVeg: true, isAvailable: true },
  { name: "Bengali Non-Veg Thali", category: "thalis", price: 450, description: "Complete non-vegetarian Bengali meal", image: "/images/nonveg-thali.jpg", isVeg: false, isAvailable: true },
  { name: "Fish Thali", category: "thalis", price: 420, description: "Fish curry with rice and sides", image: "/images/fish-thali.jpg", isVeg: false, isAvailable: true },
  { name: "Chicken Thali", category: "thalis", price: 400, description: "Chicken curry with rice and sides", image: "/images/chicken-thali.jpg", isVeg: false, isAvailable: true },
  { name: "Mutton Thali", category: "thalis", price: 550, description: "Mutton curry with rice and sides", image: "/images/mutton-thali.jpg", isVeg: false, isAvailable: true },
  { name: "Mini Thali", category: "thalis", price: 250, description: "Smaller portion complete meal", image: "/images/mini-thali.jpg", isVeg: true, isAvailable: true },
  { name: "Special Biryani Thali", category: "thalis", price: 480, description: "Biryani with raita and shorba", image: "/images/biryani-thali.jpg", isVeg: false, isAvailable: true },

  // COMBO MEALS
  { name: "Lunch Combo 1", category: "combos", price: 280, description: "Dal, rice, veg curry, roti", image: "/images/lunch-combo1.jpg", isVeg: true, isAvailable: true },
  { name: "Lunch Combo 2", category: "combos", price: 350, description: "Chicken curry, rice, dal, roti", image: "/images/lunch-combo2.jpg", isVeg: false, isAvailable: true },
  { name: "Dinner Combo 1", category: "combos", price: 420, description: "Fish curry, rice, dal, veg, dessert", image: "/images/dinner-combo1.jpg", isVeg: false, isAvailable: true },
  { name: "Dinner Combo 2", category: "combos", price: 480, description: "Mutton curry, rice, dal, veg, dessert", image: "/images/dinner-combo2.jpg", isVeg: false, isAvailable: true },
  { name: "Family Pack", category: "combos", price: 1200, description: "Complete meal for 4 people", image: "/images/family-pack.jpg", isVeg: false, isAvailable: true },
  { name: "Date Night Special", category: "combos", price: 800, description: "Romantic dinner for two", image: "/images/date-night.jpg", isVeg: false, isAvailable: true },
  { name: "Student Meal", category: "combos", price: 180, description: "Budget-friendly complete meal", image: "/images/student-meal.jpg", isVeg: true, isAvailable: true },

  // SNACKS
  { name: "Samosa", category: "snacks", price: 30, description: "Crispy fried pastry with filling", image: "/images/samosa.jpg", isVeg: true, isAvailable: true },
  { name: "Kachori", category: "snacks", price: 35, description: "Spiced lentil-filled pastry", image: "/images/kachori.jpg", isVeg: true, isAvailable: true },
  { name: "Pakora", category: "snacks", price: 80, description: "Mixed vegetable fritters", image: "/images/pakora.jpg", isVeg: true, isAvailable: true },
  { name: "Pani Puri", category: "snacks", price: 60, description: "Crispy shells with spiced water", image: "/images/pani-puri.jpg", isVeg: true, isAvailable: true },
  { name: "Bhel Puri", category: "snacks", price: 70, description: "Puffed rice snack mix", image: "/images/bhel-puri.jpg", isVeg: true, isAvailable: true },
  { name: "Dahi Puri", category: "snacks", price: 80, description: "Crispy shells with yogurt", image: "/images/dahi-puri.jpg", isVeg: true, isAvailable: true },
  { name: "Chana Chaat", category: "snacks", price: 90, description: "Spiced chickpea salad", image: "/images/chana-chaat.jpg", isVeg: true, isAvailable: true },
  { name: "Papdi Chaat", category: "snacks", price: 85, description: "Crispy wafers with chutneys", image: "/images/papdi-chaat.jpg", isVeg: true, isAvailable: true }
];

export async function POST(request: Request) {
  try {
    // Security check - only allow seeding in development or with specific key
    const { searchParams } = new URL(request.url);
    const seedKey = searchParams.get('key');
    
    if (seedKey !== 'bong-flavours-seed-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Clear existing data using Mongoose connection
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    await db.collection('users').deleteMany({});
    await db.collection('menuitems').deleteMany({});

    // Hash passwords for users
    const hashedUsers = await Promise.all(
      demoUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    // Insert demo users
    const usersResult = await db.collection('users').insertMany(hashedUsers);

    // Add timestamps to menu items
    const menuWithTimestamps = menuItems.map(item => ({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Insert menu items
    const menuResult = await db.collection('menuitems').insertMany(menuWithTimestamps);

    return NextResponse.json({
      success: true,
      message: 'Production database seeded successfully! 🎉',
      data: {
        usersInserted: usersResult.insertedCount,
        menuItemsInserted: menuResult.insertedCount,
        demoAccounts: [
          '👑 ADMIN: admin@bongflavours.com / admin123',
          '👑 ADMIN: debdootmanna007@gmail.com / password123',
          '👤 Customer: raj@example.com / password123',
          '👤 Customer: priya@example.com / password123',
          '👤 Customer: rahul@example.com / password123',
          '👤 Customer: amit@example.com / password123',
          '👤 Customer: sneha@example.com / password123'
        ]
      }
    });

  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
