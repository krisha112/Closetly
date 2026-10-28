const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const ClothingItem = require('../models/ClothingItem');

dotenv.config();

const BRAND = 'Closetly Sample';
const TOTAL_PER_CATEGORY = 20;

const USED_PHOTO_IDS = new Set();
const USED_IMAGE_URLS = new Set();

const PHOTO_STYLE =
  'product only no people no model no mannequin simple natural background flat lay still life clothing photography';

const categories = [
  {
    category: 'Tops',
    items: [
      ['White Linen Shirt', 'White', 'Casual', 'white linen shirt'],
      ['Black Fitted T-Shirt', 'Black', 'Casual', 'black fitted t shirt'],
      ['Blue Oxford Shirt', 'Blue', 'College', 'blue oxford button down shirt'],
      ['Cream Knit Sweater', 'Cream', 'Casual', 'cream knitted sweater'],
      ['Floral Blouse', 'Floral', 'Party', 'floral blouse'],
      ['Brown Satin Top', 'Brown', 'Party', 'brown satin camisole top'],
      [
        'Striped Long-Sleeve Top',
        'Black and White',
        'Casual',
        'black white striped long sleeve top',
      ],
      ['Olive Green Tank Top', 'Olive Green', 'Casual', 'olive green sleeveless tank top'],
      ['Beige Ribbed Top', 'Beige', 'Casual', 'beige ribbed fitted top'],
      ['Pink Puff-Sleeve Blouse', 'Pink', 'Party', 'pink puff sleeve blouse'],
      ['Navy Blue Polo Shirt', 'Navy', 'Casual', 'navy blue polo shirt'],
      ['White Crop Top', 'White', 'Casual', 'white crop top'],
      ['Grey Oversized Hoodie', 'Grey', 'Casual', 'grey oversized hoodie'],
      ['Lavender Cardigan', 'Lavender', 'Casual', 'lavender knitted cardigan'],
      ['Black Turtleneck', 'Black', 'Formal', 'black turtleneck top'],
      ['Yellow Summer Blouse', 'Yellow', 'Casual', 'yellow summer blouse'],
      ['Denim Button-Up Shirt', 'Blue', 'Casual', 'blue denim button up shirt'],
      ['Maroon Wrap Top', 'Maroon', 'Party', 'maroon wrap top'],
      ['Sage Green Linen Shirt', 'Sage Green', 'Casual', 'sage green linen shirt'],
      ['Blue Ribbed Knit Top', 'Blue', 'Casual', 'blue ribbed knit top'],
    ],
  },
  {
    category: 'Bottoms',
    items: [
      ['Blue Straight-Leg Jeans', 'Blue', 'Casual', 'blue straight leg jeans'],
      ['Black Tailored Trousers', 'Black', 'Formal', 'black tailored trousers'],
      ['Beige Wide-Leg Pants', 'Beige', 'Casual', 'beige wide leg pants'],
      ['White Denim Shorts', 'White', 'Casual', 'white denim shorts'],
      ['Black Leggings', 'Black', 'Workout', 'black athletic leggings'],
      ['Blue Denim Shorts', 'Blue', 'Casual', 'blue denim shorts'],
      ['Cream Pleated Trousers', 'Cream', 'Formal', 'cream pleated trousers'],
      ['Black Cargo Pants', 'Black', 'Casual', 'black cargo pants'],
      ['Grey Straight-Leg Pants', 'Grey', 'Formal', 'grey straight leg pants'],
      ['Brown Linen Trousers', 'Brown', 'Casual', 'brown linen trousers'],
      ['Navy Blue Jeans', 'Navy', 'Casual', 'navy blue jeans'],
      ['Khaki Cargo Shorts', 'Khaki', 'Casual', 'khaki cargo shorts'],
      ['Black Pleated Skirt', 'Black', 'Party', 'black pleated skirt'],
      ['Floral Midi Skirt', 'Floral', 'Casual', 'floral midi skirt'],
      ['Beige Mini Skirt', 'Beige', 'Party', 'beige mini skirt'],
      ['Olive Green Joggers', 'Olive Green', 'Workout', 'olive green jogger pants'],
      ['White Wide-Leg Trousers', 'White', 'Formal', 'white wide leg trousers'],
      ['Blue Denim Midi Skirt', 'Blue', 'Casual', 'blue denim midi skirt'],
      ['Charcoal Pleated Trousers', 'Charcoal', 'Formal', 'charcoal pleated trousers'],
      ['Light Blue Denim Skirt', 'Light Blue', 'Casual', 'light blue denim skirt'],
    ],
  },
  {
    category: 'Dresses',
    items: [
      ['Floral Midi Dress', 'Floral', 'Party', 'floral midi dress'],
      ['Black Evening Dress', 'Black', 'Party', 'black evening dress'],
      ['Blue Summer Dress', 'Blue', 'Casual', 'blue summer sundress'],
      ['Green Puff-Sleeve Dress', 'Green', 'Party', 'green puff sleeve dress'],
      ['Pink Floral Dress', 'Pink', 'Party', 'pink floral dress'],
      ['White Summer Dress', 'White', 'Casual', 'white summer dress'],
      ['Brown Maxi Dress', 'Brown', 'Party', 'brown maxi dress'],
      ['Black Casual Dress', 'Black', 'Casual', 'black casual day dress'],
      ['Lavender Satin Dress', 'Lavender', 'Party', 'lavender satin dress'],
      ['Red Wrap Dress', 'Red', 'Party', 'red wrap dress'],
      ['Beige Knit Dress', 'Beige', 'Casual', 'beige knitted midi dress'],
      ['Navy Blue Shirt Dress', 'Navy', 'Formal', 'navy blue shirt dress'],
      ['Yellow Floral Maxi Dress', 'Yellow', 'Casual', 'yellow floral maxi dress'],
      ['Pink Satin Slip Dress', 'Pink', 'Party', 'pink satin slip dress'],
      ['White Lace Dress', 'White', 'Party', 'white lace dress'],
      ['Denim Shirt Dress', 'Blue', 'Casual', 'blue denim shirt dress'],
      ['Emerald Green Gown', 'Green', 'Party', 'emerald green evening gown'],
      ['Striped Summer Dress', 'Multicolor', 'Casual', 'striped summer dress'],
      ['Terracotta Linen Dress', 'Terracotta', 'Casual', 'terracotta linen midi dress'],
      ['Sage Green Wrap Dress', 'Sage Green', 'Party', 'sage green wrap dress'],
    ],
  },
  {
    category: 'Shoes',
    items: [
      ['White Sneakers', 'White', 'Casual', 'white minimalist sneakers'],
      ['Black High-Top Sneakers', 'Black', 'Casual', 'black high top sneakers'],
      ['Beige Trainers', 'Beige', 'Workout', 'beige running trainers'],
      ['Black Heeled Sandals', 'Black', 'Party', 'black heeled strappy sandals'],
      ['White Strappy Sandals', 'White', 'Party', 'white strappy sandals'],
      ['Brown Loafers', 'Brown', 'Formal', 'brown leather loafers'],
      ['Black Ankle Boots', 'Black', 'Casual', 'black leather ankle boots'],
      ['Tan Flat Sandals', 'Tan', 'Casual', 'tan flat sandals'],
      ['Cream Ballet Flats', 'Cream', 'Formal', 'cream ballet flats'],
      ['Red Mary Jane Shoes', 'Red', 'Party', 'red mary jane shoes'],
      ['Brown Chelsea Boots', 'Brown', 'Casual', 'brown chelsea boots'],
      ['Silver Party Heels', 'Silver', 'Party', 'silver high heel shoes'],
      ['Navy Running Shoes', 'Navy', 'Workout', 'navy blue running shoes'],
      ['Beige Ballet Flats', 'Beige', 'Casual', 'beige ballet flats'],
      ['Black Loafers', 'Black', 'Formal', 'black leather loafers'],
      ['White Platform Sneakers', 'White', 'Casual', 'white platform sneakers'],
      ['Gold Strappy Heels', 'Gold', 'Party', 'gold strappy heels'],
      ['Brown Leather Sandals', 'Brown', 'Casual', 'brown leather sandals'],
      ['White Canvas Slip-Ons', 'White', 'Casual', 'white canvas slip on shoes'],
      ['Dark Brown Derby Shoes', 'Dark Brown', 'Formal', 'dark brown leather derby shoes'],
    ],
  },
  {
    category: 'Accessories',
    items: [
      ['Black Shoulder Bag', 'Black', 'Casual', 'black leather shoulder bag'],
      ['Cream Tote Bag', 'Cream', 'Casual', 'cream canvas tote bag'],
      ['Black Leather Belt', 'Black', 'Casual', 'black leather belt silver buckle'],
      ['Black Sunglasses', 'Black', 'Casual', 'black sunglasses'],
      ['Gold Pendant Necklace', 'Gold', 'Party', 'gold pendant necklace'],
      ['Gold Hoop Earrings', 'Gold', 'Party', 'gold hoop earrings'],
      ['Classic Wristwatch', 'Brown and Gold', 'Casual', 'gold wristwatch brown leather strap'],
      ['Floral Hair Scrunchie', 'Floral', 'Casual', 'floral fabric hair scrunchie'],
      ['Brown Crossbody Bag', 'Brown', 'Casual', 'brown leather crossbody bag'],
      ['Silver Stud Earrings', 'Silver', 'Casual', 'silver stud earrings'],
      ['Pearl Necklace', 'White', 'Party', 'classic pearl necklace'],
      ['Beige Baseball Cap', 'Beige', 'Casual', 'beige baseball cap'],
      ['Brown Leather Wallet', 'Brown', 'Casual', 'brown leather wallet'],
      ['Gold Chain Bracelet', 'Gold', 'Party', 'gold chain bracelet'],
      ['Black Claw Hair Clip', 'Black', 'Casual', 'black claw hair clip'],
      ['Cream Knit Scarf', 'Cream', 'Casual', 'cream knitted scarf'],
      ['Tan Bucket Hat', 'Tan', 'Casual', 'tan bucket hat'],
      ['Minimalist Gold Watch', 'Gold', 'Formal', 'minimalist gold wristwatch'],
      ['Natural Straw Tote Bag', 'Tan', 'Casual', 'natural straw woven tote bag'],
      ['Silver Chain Bracelet', 'Silver', 'Party', 'silver chain bracelet'],
    ],
  },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRateLimitError(error) {
  return error.response?.status === 429;
}

async function fetchImages(query) {
  const response = await axios.get('https://api.unsplash.com/search/photos', {
    params: {
      query: `${query} ${PHOTO_STYLE}`,
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
  const photo = photos.find(
    (item) =>
      item.id &&
      item.urls?.regular &&
      !USED_PHOTO_IDS.has(item.id) &&
      !USED_IMAGE_URLS.has(item.urls.regular),
  );

  if (!photo) return null;

  USED_PHOTO_IDS.add(photo.id);
  USED_IMAGE_URLS.add(photo.urls.regular);

  return photo;
}

async function findProductPhoto(query) {
  const firstResults = await fetchImages(query);
  let photo = getUniquePhoto(firstResults);

  if (!photo) {
    await delay(1200);

    const secondResults = await fetchImages(`${query} clothing item on plain background`);

    photo = getUniquePhoto(secondResults);
  }

  return photo;
}

async function seedClothing() {
  let connected = false;
  let added = 0;
  let updated = 0;
  let reused = 0;
  let failed = 0;
  let stoppedByRateLimit = false;

  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/closetly');

    connected = true;

    if (!process.env.UNSPLASH_ACCESS_KEY) {
      throw new Error('UNSPLASH_ACCESS_KEY is missing from your backend .env file.');
    }

    for (const group of categories) {
      console.log(`\n========== ${group.category} ==========`);

      for (const [name, color, occasion, query] of group.items) {
        try {
          // Only sample catalogue records are queried or modified.
          // Personal wardrobe items with other brands are left untouched.
          const existing = await ClothingItem.findOne({
            name,
            brand: BRAND,
          });

          // Reuse a saved image rather than making another API request.
          if (existing && typeof existing.image === 'string' && existing.image.trim()) {
            reused++;
            console.log(`Keeping existing photo: ${name}`);
            continue;
          }

          console.log(`Searching for missing photo: ${name}`);

          let photo;

          // Retry temporary network errors, but never keep retrying rate limits.
          for (let attempt = 1; attempt <= 3; attempt++) {
            try {
              photo = await findProductPhoto(query);
              break;
            } catch (error) {
              if (isRateLimitError(error)) {
                stoppedByRateLimit = true;
                console.error(
                  'Unsplash rate limit reached. Stopping to avoid more failed requests.',
                );
                break;
              }

              const temporaryNetworkError = [
                'ECONNRESET',
                'ENOTFOUND',
                'ETIMEDOUT',
                'ECONNABORTED',
                'EAI_AGAIN',
              ].includes(error.code);

              if (!temporaryNetworkError || attempt === 3) {
                throw error;
              }

              const waitMs = attempt * 2000;
              console.warn(`Temporary network error for ${name}. Retrying in ${waitMs / 1000}s...`);
              await delay(waitMs);
            }
          }

          if (stoppedByRateLimit) break;

          if (!photo) {
            failed++;
            console.warn(`No suitable unique photo returned for: ${name}`);
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
            notes: `${name} in ${color.toLowerCase()}. Suitable for ${occasion.toLowerCase()} occasions. Sample product description.`,
            isFavorite: false,
          };

          if (existing) {
            existing.set({
              category: productData.category,
              color: productData.color,
              season: productData.season,
              occasion: productData.occasion,
              image: productData.image,
              notes: productData.notes,
            });

            await existing.save();
            updated++;
            console.log(`Updated missing image: ${name}`);
          } else {
            await ClothingItem.create(productData);
            added++;
            console.log(`Added sample product: ${name}`);
          }

          await delay(1200);
        } catch (error) {
          if (isRateLimitError(error)) {
            stoppedByRateLimit = true;
            console.error('Unsplash rate limit reached. Stopping now.');
            break;
          }

          failed++;
          console.error(`Failed for ${name}:`, error.response?.data || error.message);
        }
      }

      if (stoppedByRateLimit) break;
    }

    console.log('\n========== SEEDING SUMMARY ==========');
    console.log(`New products added: ${added}`);
    console.log(`Missing-image products updated: ${updated}`);
    console.log(`Existing photos reused: ${reused}`);
    console.log(`Failed products: ${failed}`);
    console.log(`Target items per category: ${TOTAL_PER_CATEGORY}`);

    if (stoppedByRateLimit) {
      console.log(
        '\nStopped because Unsplash rate-limited the requests. Existing photos were preserved.',
      );
      console.log(
        'Wait until your API quota resets, then run this script again for products still missing images.',
      );
    } else {
      console.log('\nFinished processing the sample catalogue.');
    }
  } catch (error) {
    console.error('Seeding failed:', error.response?.data || error.message);
  } finally {
    if (connected) {
      await mongoose.disconnect();
    }
  }
}

seedClothing();
