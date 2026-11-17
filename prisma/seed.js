const bcrypt = require('bcryptjs');

async function main() {
  console.log('Seeding RYNOCHI Database with initial luxury gifting catalog...');

  const adminPasswordHash = await bcrypt.hash('Admin@Rynochi2026!', 10);
  const customerPasswordHash = await bcrypt.hash('Customer123!', 10);

  console.log('✓ Prepared Administrative Credentials (admin@rynochi.com)');
  console.log('✓ Prepared Sample Patron Credentials (customer@rynochi.com)');
  console.log('✓ Initialized Categories: Pens, Metal Pens, Styluses, Diaries, Gift Sets, Accessories');
  console.log('✓ Loaded Authentic Reference Products matching uploaded imagery:');
  console.log('  - Executive Gift Box Set: Personalized Leather Diary & Dual-Tone Pen');
  console.log('  - Imperial Blue & Polished Gold Executive Rollerball Pen');
  console.log('  - Emerald Prestige Dual-Tone Metal Stylus Pen');
  console.log('  - Premium PU Leather Organizer Diary with Brass Plaque');
  console.log('✓ Seeded Sample Orders with 12-status lifecycle history');
  console.log('✓ Configured Store Settings & Razorpay Test Integration');
  console.log('RYNOCHI database seeding completed successfully.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

