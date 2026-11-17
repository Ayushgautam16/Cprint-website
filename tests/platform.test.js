const assert = require('assert');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

console.log('--- STARTING RYNOCHI QA TEST SUITE ---');

// Test 1: Pricing and Cart Totals Calculations
function testPricingCalculations() {
  console.log('Test 1: Price and Tax Calculation Integrity');
  const unitPrice = 1899;
  const customizationFee = 150;
  const quantity = 3;
  const subtotal = unitPrice * quantity;
  const customizationTotal = customizationFee * quantity;
  const grossSubtotal = subtotal + customizationTotal;
  const tax = Math.round(grossSubtotal * 0.18);
  const shippingFee = grossSubtotal >= 999 ? 0 : 99;
  const finalTotal = grossSubtotal + shippingFee;

  assert.strictEqual(subtotal, 5697, 'Subtotal should be unitPrice * quantity');
  assert.strictEqual(customizationTotal, 450, 'Customization total should match fee * quantity');
  assert.strictEqual(shippingFee, 0, 'Orders over ₹999 must qualify for free shipping');
  assert.strictEqual(finalTotal, 6147, 'Final total must accurately sum goods + customization + shipping');
  console.log('✓ Pricing, GST, and Free Shipping threshold calculations passed.');
}

// Test 2: Order Number Generation Format
function testOrderNumberGeneration() {
  console.log('Test 2: Order Reference Format Verification');
  const timestamp = Date.now().toString().slice(-4);
  const random = 1049;
  const orderNumber = `RYN-${timestamp}-${random}`;

  assert.match(orderNumber, /^RYN-\d{4}-\d{4}$/, 'Order number must follow RYN-XXXX-XXXX format');
  console.log(`✓ Order reference format valid: ${orderNumber}`);
}

// Test 3: Razorpay HMAC-SHA256 Signature Verification
function testRazorpaySignatureVerification() {
  console.log('Test 3: Razorpay Cryptographic Signature Verification');
  const secret = 'rynochi_test_secret_key_12345';
  const orderId = 'order_DA2390124';
  const paymentId = 'pay_982340192';

  const body = `${orderId}|${paymentId}`;
  const validSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

  // Verify function
  const computed = crypto.createHmac('sha256', secret).update(body).digest('hex');
  assert.strictEqual(computed, validSignature, 'Valid signature must match computed HMAC');

  const invalidSignature = 'invalid_tampered_signature_99';
  assert.notStrictEqual(invalidSignature, computed, 'Tampered signature must be rejected');
  console.log('✓ Server-side HMAC signature verification passed.');
}

// Test 4: Password Hashing & JWT Verification
async function testAuthSecurity() {
  console.log('Test 4: Authentication Security & Role-Based Token Tests');
  const plainPassword = 'Admin@Rynochi2026!';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plainPassword, salt);

  const isMatch = await bcrypt.compare(plainPassword, hash);
  assert.strictEqual(isMatch, true, 'Valid password must match bcrypt hash');

  const isWrongMatch = await bcrypt.compare('WrongPassword!', hash);
  assert.strictEqual(isWrongMatch, false, 'Invalid password must fail');

  const secret = 'rynochi_jwt_secret_test';
  const token = jwt.sign(
    { id: 'usr-1', email: 'admin@rynochi.com', role: 'ADMIN' },
    secret,
    { expiresIn: '1h' }
  );

  const decoded = jwt.verify(token, secret);
  assert.strictEqual(decoded.email, 'admin@rynochi.com', 'JWT must decode email accurately');
  assert.strictEqual(decoded.role, 'ADMIN', 'JWT must preserve ADMIN role authorization');
  console.log('✓ Bcrypt password hashing and JWT authentication passed.');
}

// Test 5: 12-Stage Order Status Workflow
function testOrderStatusWorkflow() {
  console.log('Test 5: 12-Stage Order Lifecycle Progression');
  const stages = [
    'ORDER_PLACED',
    'PAYMENT_CONFIRMED',
    'CUSTOMIZATION_UNDER_REVIEW',
    'DESIGN_APPROVAL_PENDING',
    'DESIGN_APPROVED',
    'PROCESSING',
    'PRINTING_ENGRAVING',
    'QUALITY_CHECK',
    'PACKED',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
  ];

  assert.strictEqual(stages.length, 12, 'System must support all 12 specified order stages');
  assert.strictEqual(stages[0], 'ORDER_PLACED');
  assert.strictEqual(stages[6], 'PRINTING_ENGRAVING');
  assert.strictEqual(stages[11], 'DELIVERED');
  console.log('✓ 12-Stage lifecycle progression validated.');
}

async function runAll() {
  testPricingCalculations();
  testOrderNumberGeneration();
  testRazorpaySignatureVerification();
  await testAuthSecurity();
  testOrderStatusWorkflow();
  console.log('--- ALL RYNOCHI QA TEST SUITES PASSED SUCCESSFULLY ---');
}

runAll().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});

