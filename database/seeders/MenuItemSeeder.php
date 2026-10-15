<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        $menu = [
            'Starters & Soups' => [
                'Coconut Calamari' => 1900,
                'Buffalo Chicken Wings' => 1750,
                'Spicy Mexican Fajita Wrap' => 1850,
                'Grilled Prawn Kebab' => 1850,
                'Vegetable Spring Roll' => 1600,
                'Greek Salad' => 2200,
                'Chicken Caesar Salad' => 2400,
                'Spicy Thai Beef Salad' => 2400,
                'Grilled Seafood Pasta Salad' => 2450,
                'Tossed Green Salad' => 1600,
                'Roasted Tomato & Pumpkin Soup' => 1700,
                'Creamy Chicken & Sweet Corn Soup' => 1900,
                'Spicy Seafood Tom Yum' => 1900,
                'Cream of Mushroom Soup' => 1750,
                'Vegetable Broth with Egg Drop' => 1600,
            ],
            'Main Course' => [
                'Traditional Fish and Chips' => 2900,
                'Sizzling Seafood Mix Grill' => 5200,
                'Creamy Garlic Butter Prawns' => 3200,
                'Prawns and Chips' => 3400,
                'Chilli Con Carne' => 2950,
                'Beef Irish Stew' => 3900,
                'Bangers and Mash' => 2900,
                'Grilled Pork Chop' => 4200,
                'Chicken Mushroom Casserole' => 3800,
                'Mixed Grill' => 9000,
                'Grilled Chicken Delight' => 3800,
                'Beef Bolognese' => 3200,
                'Chicken Carbonara' => 3200,
                'Chicken Alfredo with Fettuccine' => 3200,
                'Spanakopita' => 2200,
                'Classic Greek Moussaka' => 3200,
                'Thai Spicy Fried Rice' => 2200,
                'Mixed Vegetable Fried Rice' => 1800,
                'Mongolian Rice' => 2700,
                'Garlic Rice' => 1700,
                'Nasi Goreng' => 2200,
                'Biryani' => 2400,
                'Rice and Curry' => 2250,
                'Pad Thai Noodles' => 2250,
                'Stir Fried Vermicelli' => 2500,
                'Fried Noodles' => 1900,
                'Kottu' => 2200,
            ],
            'Sandwiches & Burgers' => [
                'Paprika Chicken Ciabatta' => 2450,
                'Club Sandwich' => 2900,
                'Meatloaf Sandwich' => 1900,
                'Grilled Chicken Submarine' => 2700,
                'Steak Sandwich' => 2800,
                'Big Ben Burger' => 2650,
                'Chicken and Cheese Wrap' => 2100,
                'B.L.T Sandwich' => 1950,
            ],
            'Vegetarian' => [
                'Saffron Vegetable Biryani' => 1700,
                'Tropical Garden Fried Rice' => 1700,
                'Spiced Vegetable Nasi Goreng' => 1800,
                'Sri Lankan Heritage Rice & Curry' => 1700,
                'Creamy Herb Vegetable Spaghetti' => 1900,
                'The Poori Delight' => 1900,
                'Ghee Parotta or Dosa Selection' => 2000,
                'Chapathi & Rice Harmony' => 1950,
                'Parotta Indulgence' => 2200,
                'Family Clay Pot Experience (serves 4)' => 7950,
                'Samosa (3 Pieces)' => 900,
                'Crispy Vegetable Pakora' => 1200,
                'Golden Spring Rolls' => 1100,
                'Sea-Salt Potato Wedges' => 1200,
                'Traditional Banana Chips' => 1100,
            ],
            'Desserts' => [
                'Home Made Apple Pie' => 2200,
                'Black Forest Gateaux' => 2300,
                'Mango Cold Cheese Cake' => 2600,
                'Three Kinds of Ice Cream' => 1400,
                'Chocolate Praline Layer' => 2300,
                'Crème Brûlée' => 1400,
                'Fruit Salad with Ice Cream' => 1800,
                'Fruit Platter' => 1800,
            ],
            'Beverages' => [
                // Hot
                'Cup of Tea' => 350,
                'Cup of Coffee' => 350,
                'Cup of Nescafé' => 450,
                'Cup of Masala Tea' => 550,
                'Pot of Hibiscus Tea' => 1650,
                'Pot of Green Tea' => 1650,
                'Pot of Nilkatarolu Tea' => 1650,
                'Pot of Tea (3 Persons)' => 1350,
                'Pot of Coffee (3 Persons)' => 1350,
                'Hot Chocolate' => 1350,
                // Cold
                'Iced Tea' => 1250,
                'Iced Coffee' => 1350,
                'Mint Cucumber' => 1200,
                'Fruit Punch' => 1550,
                'Fruit Cocktail' => 1450,
                // Soft Drinks
                'Coca Cola' => 550,
                'Sprite' => 550,
                'EGB (Elephant Ginger Beer)' => 510,
                'Ginger Ale' => 550,
                'Tonic Water' => 550,
                'Soda Water' => 400,
                'Mineral Water 1L' => 400,
                'Mineral Water 500ml' => 200,
                // Fresh Juices
                'Lime Juice' => 950,
                'Lime and Soda' => 1200,
                'Pineapple Juice' => 1200,
                'Mango Juice' => 1200,
                'Watermelon Juice' => 1050,
                'Papaya Juice' => 1200,
                'Avocado Juice' => 1200,
                // Smoothies
                'Banana Smoothie' => 1350,
                'Mango Smoothie' => 1350,
                'Strawberry Smoothie' => 1750,
                'Sweet / Salt Lassi' => 1200,
                // Milk Shakes
                'Emerald Milk Shake' => 1750,
                'Vanilla Milk Shake' => 1450,
                'Chocolate Milk Shake' => 1550,
                'Strawberry Milk Shake' => 1550,
                // Mocktails
                'Emerald Special' => 1850,
                'Virgin Mojito' => 1450,
                'Virgin Colada' => 1550,
                'Mango Mule' => 1450,
                'Virgin Cucumber Gimlet' => 1550,
                'Watermelon Mint' => 1450,
                'Sun City Suber' => 1450,
                'Sunset' => 1550,
            ],
            'Pool Bar (Alcohol)' => [
                // Cocktails
                'Moscow Mule' => 1950,
                'Piña Colada' => 2200,
                'Long Island Sunset' => 2200,
                'Margarita' => 2300,
                'Screw Driver' => 2200,
                'Watermelon Daiquiri' => 1950,
                'Bloody Mary' => 2300,
                'Blue Lagoon' => 2700,
                'Gin Fizz' => 2100,
                'Cuba Libre' => 1950,
                'Watermelon Margarita' => 2200,
                'Iced Tea Cocktail' => 2700,
                'Arrack Cocktail' => 1650,
                'Emerald Bay Special Cocktail' => 2450,
                'Ceylon Sunset' => 1700,
                // Beer
                'Lion Lager (Bottle)' => 1100,
                'Carlsberg' => 1400,
                'Lion Lager (Can)' => 1000,
                'Somersby Cider' => 1200,
                // Aperitizers
                'Martini Rosso' => 1100,
                'Martini Bianco' => 1100,
                // Gin
                'London Dry Gin' => 1200,
                'Rockland Dry Gin' => 1050,
                'Rockland Lemon Gin' => 1050,
                // Tequila
                'Jose Cuervo Tequila' => 2100,
                'Casco Viejo Tequila' => 2200,
                // Rum
                'Rockland White Rum' => 950,
                'Rockland Red Rum' => 950,
                'Bacardi White' => 1100,
                'Bacardi Black' => 1100,
                'Appleton Rum' => 1900,
                // Brandy
                'Hennessy' => 3700,
                'Franklin Brandy' => 1100,
                'Galerie Brandy' => 1050,
                // Vodka
                'Eristoff Vodka' => 950,
                'Absolut Vodka' => 2750,
                'Skyy Vodka' => 2500,
                'Keroof Vodka' => 950,
                // Whiskey
                'Old Keg Whiskey' => 1000,
                'V&A Whiskey' => 1000,
                'Chivas Regal' => 3100,
                'Johnnie Walker Red' => 3300,
                'Johnnie Walker Black' => 3400,
                // Arrack
                'Extra Special Old Arrack' => 850,
                'Old Arrack' => 900,
                'Double Distilled Arrack' => 900,
                'White Arrack' => 850,
                // Wine
                'Red Wine (glass)' => 2250,
                'White Wine (glass)' => 2250,
            ],
            'Sides & Snacks' => [
                'Boiled Vegetables' => 1500,
                'Potato Wedges' => 2500,
                'Chicken Bites' => 1950,
                'Fish Bites' => 2100,
            ],
        ];

        foreach ($menu as $categoryName => $items) {
            $category = Category::firstOrCreate(['name' => $categoryName]);

            foreach ($items as $name => $price) {
                MenuItem::firstOrCreate(
                    ['category_id' => $category->id, 'name' => $name],
                    ['price' => $price]
                );
            }
        }

        // Superseded by the categories above - keep for historical invoice items, hide from active use.
        Category::whereIn('name', ['Food', 'Alcohol'])->update(['active' => false]);
    }
}
