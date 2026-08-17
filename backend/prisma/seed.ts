import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('Admin@123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@hairsup.com' },
    // Login rejects unverified accounts, and no one can click a verification
    // link for a seeded account, so without this the admin can never sign in.
    update: { isVerified: true },
    create: {
      email: 'admin@hairsup.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'HairsUp',
      role: 'ADMIN',
      isVerified: true,
    },
  });

  const menCat = await prisma.category.upsert({
    where: { slug: 'men-wigs' },
    update: {},
    create: {
      name: "Men's Wigs",
      slug: 'men-wigs',
      description: 'Premium quality wigs for men',
      gender: 'MEN',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    },
  });

  const womenCat = await prisma.category.upsert({
    where: { slug: 'women-wigs' },
    update: {},
    create: {
      name: "Women's Wigs",
      slug: 'women-wigs',
      description: 'Elegant and stylish wigs for women',
      gender: 'WOMEN',
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400',
    },
  });

  const humanHairCat = await prisma.category.upsert({
    where: { slug: 'human-hair' },
    update: {},
    create: { name: 'Human Hair', slug: 'human-hair', parentId: womenCat.id },
  });

  const syntheticCat = await prisma.category.upsert({
    where: { slug: 'synthetic' },
    update: {},
    create: { name: 'Synthetic', slug: 'synthetic', parentId: menCat.id },
  });

  const products = [
    {
      name: 'Full Head Hair Wig for Man, Black Breathable Front Hair Patch for Men with Lace Cap Clips',
      slug: 'full-head-hair-wig-for-man-black-breathable-front-hair-patch',
      description: 'This Full Head Hair Wig for Men features a black, breathable front hair patch with lace cap clips, designed for thinning hair and easy daily styling. Crafted from premium high-temperature silk synthetic fiber that replicates natural hair texture, the front hair patch blends seamlessly with existing hair for a realistic, undetectable look. Includes lace and fixing clips for a secure, comfortable fit.',
      shortDesc: 'Breathable front hair patch, lace cap clips, heat-resistant synthetic',
      categoryId: syntheticCat.id,
      gender: 'MEN',
      basePrice: 3599,
      stock: 1,
      sku: 'HU-M-007',
      material: 'Synthetic',
      texture: 'Straight',
      color: 'Black',
      isNewArrival: true,
      tags: JSON.stringify(['wig', 'men', 'synthetic', 'lace front', 'hair patch']),
      images: [
        { url: '/wigs/wig7/men front hair wig.png', isPrimary: true, angle: 0, isTryOn: true },
        // Left/right profile shots, used to cross-fade in as the user turns their head
        // during try-on (see wigImages angle-blend logic in wigRenderer.ts/angleInterpolation.ts).
        { url: '/wigs/wig7/men left view.png', isPrimary: false, angle: 315, isTryOn: true },
        { url: '/wigs/wig7/men right view.png', isPrimary: false, angle: 45, isTryOn: true },
      ],
    },
    {
      name: 'AHS Bob Hair Wig for Women | Full Head Synthetic Straight Bob Wig | Natural Looking Shoulder Length Black Bob Wig for Daily & Party Use (Brown)',
      slug: 'ahs-bob-hair-wig-for-women-full-head-synthetic-straight-bob-wig',
      description: 'The AHS Bob Hair Wig for Women is a full head synthetic straight bob wig with a natural-looking, shoulder-length finish. Designed for daily wear and party use, this Brown bob wig offers a sleek, natural silhouette that\'s easy to style straight out of the box.',
      shortDesc: 'Synthetic straight bob, shoulder length, natural look',
      categoryId: womenCat.id,
      gender: 'WOMEN',
      basePrice: 3999,
      stock: 1,
      sku: 'HU-W-001',
      material: 'Synthetic',
      texture: 'Straight',
      color: 'Brown',
      isNewArrival: true,
      tags: JSON.stringify(['wig', 'women', 'synthetic', 'bob', 'straight']),
      images: [
        { url: '/wigs/wig8/women front hair wig.png', isPrimary: true, angle: 0, isTryOn: true },
        // Left/right profile shots, cross-fade in as the user turns their head during
        // try-on (see wigImages angle-blend logic in wigRenderer.ts/angleInterpolation.ts).
        { url: '/wigs/wig8/women left view.png', isPrimary: false, angle: 315, isTryOn: true },
        { url: '/wigs/wig8/women right view.png', isPrimary: false, angle: 45, isTryOn: true },
      ],
    },
  ];

  for (const p of products) {
    const { images, tags, ...data } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        images: {
          deleteMany: {},
          create: images,
        },
      },
      create: {
        ...data,
        tags,
        rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
        reviewCount: Math.floor(Math.random() * 200) + 50,
        images: { create: images },
      },
    });
    console.log(`Created: ${p.name}`);
  }

  await prisma.coupon.upsert({
    where: { code: 'FIRST20' },
    update: {},
    create: { code: 'FIRST20', type: 'PERCENTAGE', value: 20, minOrder: 1000, maxDiscount: 500 },
  });
  await prisma.coupon.upsert({
    where: { code: 'HAIRSUP200' },
    update: {},
    create: { code: 'HAIRSUP200', type: 'FIXED', value: 200, minOrder: 2000 },
  });

  const storeHours = JSON.stringify({ mon: '10:00-21:00', tue: '10:00-21:00', wed: '10:00-21:00', thu: '10:00-21:00', fri: '10:00-22:00', sat: '10:00-22:00', sun: '11:00-20:00' });
  const stores = [
    { name: 'HairsUp Mumbai Flagship', address: 'Ground Floor, Phoenix Palladium, Senapati Bapat Marg', city: 'Mumbai', state: 'Maharashtra', pincode: '400013', phone: '+91 98765 43210', email: 'mumbai@hairsup.com', hours: storeHours, lat: 19.076, lng: 72.8777 },
    { name: 'HairsUp Delhi Select', address: 'Level 2, Select Citywalk, Saket', city: 'New Delhi', state: 'Delhi', pincode: '110017', phone: '+91 98765 43211', email: 'delhi@hairsup.com', hours: storeHours, lat: 28.5274, lng: 77.2193 },
    { name: 'HairsUp Bangalore Forum', address: 'Forum Mall, Hosur Road, Koramangala', city: 'Bangalore', state: 'Karnataka', pincode: '560095', phone: '+91 98765 43212', email: 'bangalore@hairsup.com', hours: storeHours, lat: 12.9352, lng: 77.6245 },
  ];
  for (const store of stores) {
    await prisma.storeLocation.upsert({
      where: { id: store.name },
      update: {},
      create: store,
    }).catch(() => prisma.storeLocation.create({ data: store }).catch(() => {}));
  }

  await prisma.blogPost.upsert({
    where: { slug: 'ultimate-guide-choosing-first-wig' },
    update: {},
    create: {
      title: 'The Ultimate Guide to Choosing Your First Wig',
      slug: 'ultimate-guide-choosing-first-wig',
      excerpt: 'Everything you need to know before buying your first wig.',
      content: '<h2>Finding Your Perfect Wig</h2><p>Choosing your first wig can feel overwhelming...</p>',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
      author: 'HairsUp Expert Team',
      tags: JSON.stringify(['beginner', 'guide', 'wig care']),
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  console.log('Seeding complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
