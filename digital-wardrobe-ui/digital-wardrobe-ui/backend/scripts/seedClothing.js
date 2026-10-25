const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const ClothingItem = require('../models/ClothingItem');

dotenv.config();

const BRAND = 'Closetly Sample';
const TOTAL_PER_CATEGORY = 18;
const USED_PHOTO_IDS = new Set();
const USED_IMAGE_URLS = new Set();

const categories = [
  {
    category: 'Tops',
    items: [
      [
        'White Linen Shirt',
        'White',
        'Casual',
        'white linen shirt isolated white background product photography',
      ],
      [
        'Black Fitted T-Shirt',
        'Black',
        'Casual',
        'black fitted women t shirt clothing product photo',
      ],
      ['Blue Oxford Shirt', 'Blue', 'College', 'blue oxford button down shirt product photography'],
      ['Cream Knit Sweater', 'Cream', 'Casual', 'cream knitted sweater isolated clothing product'],
      ['Floral Blouse', 'Floral', 'Party', 'floral women blouse product photography'],
      ['Brown Satin Top', 'Brown', 'Party', 'brown satin camisole top fashion product photo'],
      [
        'Striped Long-Sleeve Top',
        'Black and White',
        'Casual',
        'black white striped long sleeve shirt product photo',
      ],
      [
        'Olive Green Tank Top',
        'Olive Green',
        'Casual',
        'olive green sleeveless tank top product photo',
      ],
      ['Beige Ribbed Top', 'Beige', 'Casual', 'beige ribbed fitted top clothing product photo'],
      ['Pink Puff-Sleeve Blouse', 'Pink', 'Party', 'pink puff sleeve blouse product photography'],
      ['Navy Blue Polo Shirt', 'Navy', 'Casual', 'navy blue polo shirt isolated product photo'],
      ['White Crop Top', 'White', 'Casual', 'white women crop top fashion product photo'],
      ['Grey Oversized Hoodie', 'Grey', 'Casual', 'grey oversized hoodie product photography'],
      ['Lavender Cardigan', 'Lavender', 'Casual', 'lavender knitted cardigan clothing product'],
      ['Black Turtleneck', 'Black', 'Formal', 'black fitted turtleneck women top product photo'],
      ['Yellow Summer Blouse', 'Yellow', 'Casual', 'yellow summer blouse product photography'],
      ['Denim Button-Up Shirt', 'Blue', 'Casual', 'blue denim button up shirt product photo'],
      ['Maroon Wrap Top', 'Maroon', 'Party', 'maroon wrap top women fashion product photo'],
    ],
  },
  {
    category: 'Bottoms',
    items: [
      [
        'Blue Straight-Leg Jeans',
        'Blue',
        'Casual',
        'blue straight leg denim jeans product photography',
      ],
      ['Black Tailored Trousers', 'Black', 'Formal', 'black tailored women trousers product photo'],
      ['Beige Wide-Leg Pants', 'Beige', 'Casual', 'beige wide leg trousers isolated product'],
      ['White Denim Shorts', 'White', 'Casual', 'white denim shorts product photography'],
      ['Black Leggings', 'Black', 'Workout', 'black athletic leggings product photo'],
      ['Blue Denim Shorts', 'Blue', 'Casual', 'blue denim shorts clothing product photo'],
      [
        'Cream Pleated Trousers',
        'Cream',
        'Formal',
        'cream pleated tailored trousers product photo',
      ],
      ['Black Cargo Pants', 'Black', 'Casual', 'black cargo pants product photography'],
      ['Grey Straight-Leg Pants', 'Grey', 'Formal', 'grey straight leg tailored trousers product'],
      ['Brown Linen Trousers', 'Brown', 'Casual', 'brown linen pants clothing product photo'],
      ['Navy Blue Jeans', 'Navy', 'Casual', 'dark navy blue jeans product photography'],
      ['Khaki Cargo Shorts', 'Khaki', 'Casual', 'khaki cargo shorts product photo'],
      ['Black Pleated Skirt', 'Black', 'Party', 'black pleated skirt isolated product photography'],
      ['Floral Midi Skirt', 'Floral', 'Casual', 'floral midi skirt clothing product photo'],
      ['Beige Mini Skirt', 'Beige', 'Party', 'beige mini skirt product photography'],
      ['Olive Green Joggers', 'Olive Green', 'Workout', 'olive green jogger pants product photo'],
      ['White Wide-Leg Trousers', 'White', 'Formal', 'white wide leg trousers product photography'],
      ['Blue Denim Midi Skirt', 'Blue', 'Casual', 'blue denim midi skirt product photo'],
    ],
  },
  {
    category: 'Dresses',
    items: [
      [
        'Floral Midi Dress',
        'Floral',
        'Party',
        'floral midi dress women fashion product photography',
      ],
      ['Black Evening Dress', 'Black', 'Party', 'elegant black evening dress product photo'],
      ['Blue Summer Dress', 'Blue', 'Casual', 'blue summer sundress product photography'],
      [
        'Green Puff-Sleeve Dress',
        'Green',
        'Party',
        'green puff sleeve dress clothing product photo',
      ],
      ['Pink Floral Dress', 'Pink', 'Party', 'pink floral dress fashion product photo'],
      ['White Summer Dress', 'White', 'Casual', 'white summer dress isolated product photography'],
      ['Brown Maxi Dress', 'Brown', 'Party', 'brown maxi dress women fashion product photo'],
      ['Black Casual Dress', 'Black', 'Casual', 'black casual day dress product photography'],
      ['Lavender Satin Dress', 'Lavender', 'Party', 'lavender satin slip dress product photo'],
      ['Red Wrap Dress', 'Red', 'Party', 'red wrap dress clothing product photography'],
      ['Beige Knit Dress', 'Beige', 'Casual', 'beige knitted midi dress product photo'],
      ['Navy Blue Shirt Dress', 'Navy', 'Formal', 'navy blue shirt dress product photography'],
      ['Yellow Floral Maxi Dress', 'Yellow', 'Casual', 'yellow floral maxi dress product photo'],
      ['Pink Satin Slip Dress', 'Pink', 'Party', 'pink satin slip dress fashion product photo'],
      ['White Lace Dress', 'White', 'Party', 'white lace dress product photography'],
      ['Denim Shirt Dress', 'Blue', 'Casual', 'blue denim shirt dress product photo'],
      ['Emerald Green Gown', 'Green', 'Party', 'emerald green formal evening gown product photo'],
      [
        'Striped Summer Dress',
        'Multicolor',
        'Casual',
        'striped summer dress clothing product photography',
      ],
    ],
  },
  {
    category: 'Shoes',
    items: [
      [
        'White Sneakers',
        'White',
        'Casual',
        'white minimalist sneakers isolated white background product',
      ],
      [
        'Black High-Top Sneakers',
        'Black',
        'Casual',
        'black high top sneakers footwear product photography',
      ],
      ['Beige Trainers', 'Beige', 'Workout', 'beige running trainers product photo'],
      [
        'Black Heeled Sandals',
        'Black',
        'Party',
        'black heeled strappy sandals product photography',
      ],
      ['White Strappy Sandals', 'White', 'Party', 'white strappy sandals footwear product photo'],
      ['Brown Loafers', 'Brown', 'Formal', 'brown leather loafers isolated product photography'],
      ['Black Ankle Boots', 'Black', 'Casual', 'black leather ankle boots product photo'],
      ['Tan Flat Sandals', 'Tan', 'Casual', 'tan flat leather sandals product photography'],
      ['Cream Ballet Flats', 'Cream', 'Formal', 'cream ballet flat shoes product photo'],
      ['Red Mary Jane Shoes', 'Red', 'Party', 'red mary jane shoes footwear product photography'],
      ['Brown Chelsea Boots', 'Brown', 'Casual', 'brown chelsea boots product photo'],
      ['Silver Party Heels', 'Silver', 'Party', 'silver high heel party shoes product photography'],
      ['Navy Running Shoes', 'Navy', 'Workout', 'navy blue running shoes product photo'],
      ['Beige Ballet Flats', 'Beige', 'Casual', 'beige ballet flats isolated product photography'],
      ['Black Loafers', 'Black', 'Formal', 'black leather loafers product photo'],
      [
        'White Platform Sneakers',
        'White',
        'Casual',
        'white platform sneakers footwear product photography',
      ],
      ['Gold Strappy Heels', 'Gold', 'Party', 'gold strappy high heel sandals product photo'],
      [
        'Brown Leather Sandals',
        'Brown',
        'Casual',
        'brown leather flat sandals product photography',
      ],
    ],
  },
  {
    category: 'Accessories',
    items: [
      [
        'Black Shoulder Bag',
        'Black',
        'Casual',
        'black leather shoulder handbag product photography',
      ],
      ['Cream Tote Bag', 'Cream', 'Casual', 'cream canvas tote bag isolated product photo'],
      ['Black Leather Belt', 'Black', 'Casual', 'black leather belt silver buckle product photo'],
      [
        'Black Sunglasses',
        'Black',
        'Casual',
        'black fashion sunglasses isolated product photography',
      ],
      [
        'Gold Pendant Necklace',
        'Gold',
        'Party',
        'delicate gold pendant necklace jewellery product photo',
      ],
      ['Gold Hoop Earrings', 'Gold', 'Party', 'gold hoop earrings isolated white background'],
      [
        'Classic Wristwatch',
        'Brown and Gold',
        'Casual',
        'classic gold wristwatch brown leather strap product photo',
      ],
      [
        'Floral Hair Scrunchie',
        'Floral',
        'Casual',
        'floral fabric hair scrunchie product photography',
      ],
      ['Brown Crossbody Bag', 'Brown', 'Casual', 'brown leather crossbody handbag product photo'],
      [
        'Silver Stud Earrings',
        'Silver',
        'Casual',
        'silver stud earrings jewellery product photography',
      ],
      ['Pearl Necklace', 'White', 'Party', 'classic pearl necklace jewellery product photo'],
      ['Beige Baseball Cap', 'Beige', 'Casual', 'beige baseball cap isolated product photography'],
      ['Brown Leather Wallet', 'Brown', 'Casual', 'brown leather wallet product photo'],
      ['Gold Chain Bracelet', 'Gold', 'Party', 'gold chain bracelet jewellery product photography'],
      ['Black Claw Hair Clip', 'Black', 'Casual', 'black claw hair clip product photography'],
      ['Cream Knit Scarf', 'Cream', 'Casual', 'cream knitted scarf isolated product photo'],
      ['Tan Bucket Hat', 'Tan', 'Casual', 'tan bucket hat fashion product photography'],
      ['Minimalist Gold Watch', 'Gold', 'Formal', 'minimalist gold wristwatch product photo'],
    ],
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchImages(query) {
  const response = await axios.get('https://api.unsplash.com/search/photos', {
    params: {
      query,
      per_page: 30,
      orientation: 'squarish',
      content_filter: 'high',
    },
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
    },
    timeout: 20000,
  });

  return response.data.results || [];
}

function getUniquePhoto(photos) {
  // Prefer images that have not already been used.
  const photo = photos.find(
    (item) => !USED_PHOTO_IDS.has(item.id) && !USED_IMAGE_URLS.has(item.urls.regular),
  );

  if (!photo) return null;

  USED_PHOTO_IDS.add(photo.id);
  USED_IMAGE_URLS.add(photo.urls.regular);

  return photo;
}

async function findProductPhoto(query) {
  const photos = await fetchImages(query);

  let photo = getUniquePhoto(photos);

  // Retry with a slightly broader query if no unique image is found.
  if (!photo) {
    await delay(1100);
    const broaderPhotos = await fetchImages(query.replace(' isolated white background', ''));
    photo = getUniquePhoto(broaderPhotos);
  }

  return photo;
}

async function seedClothing() {
  let connected = false;

  try {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      throw new Error('UNSPLASH_ACCESS_KEY is missing from your backend .env file.');
    }

    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/closetly');
    connected = true;

    let added = 0;
    let updated = 0;
    let unchanged = 0;
    let failed = 0;

    for (const group of categories) {
      console.log(`\n========== ${group.category} ==========`);

      for (const [name, color, occasion, query] of group.items) {
        try {
          // Only find and update sample products, never personal items.
          const existing = await ClothingItem.findOne({
            name,
            brand: BRAND,
          });

          // Search for each product specifically.
          console.log(`Searching: ${name}`);
          const photo = await findProductPhoto(query);

          if (!photo) {
            console.warn(`No unique photo found for ${name}; skipping.`);
            failed++;
            await delay(1100);
            continue;
          }

          const productData = {
            name,
            category: group.category,
            color,
            brand: BRAND,
            season: 'All Season',
            occasion,
            size: 'M',
            image: photo.urls.regular,
            notes: 'Sample wardrobe item',
            isFavorite: false,
          };

          if (existing) {
            existing.set({
              category: productData.category,
              color: productData.color,
              season: productData.season,
              occasion: productData.occasion,
              image: productData.image,
            });

            await existing.save();
            updated++;
            console.log(`Updated: ${name}`);
          } else {
            await ClothingItem.create(productData);
            added++;
            console.log(`Added: ${name}`);
          }

          // Avoid sending requests too quickly.
          await delay(1100);
        } catch (error) {
          failed++;
          console.error(
            `Failed for ${name}:`,
            error.response?.data?.errors || error.response?.data || error.message,
          );

          // If Unsplash rate-limits requests, wait before continuing.
          if (error.response?.status === 429) {
            console.warn('Unsplash rate limit reached. Wait and rerun the script.');
            return;
          }

          await delay(1500);
        }
      }
    }

    console.log('\n========== SEEDING SUMMARY ==========');
    console.log(`New products added: ${added}`);
    console.log(`Existing products updated: ${updated}`);
    console.log(`Photos/products skipped: ${failed}`);
    console.log(`Unchanged products: ${unchanged}`);
    console.log('Finished processing the catalogue.');
  } catch (error) {
    console.error('Seeding failed:', error.response?.data || error.message);
  } finally {
    if (connected) {
      await mongoose.disconnect();
    }
  }
}

seedClothing();
