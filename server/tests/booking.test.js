const assert = require('assert');
const { hasTimeOverlap, timeToMinutes, minutesToTime } = require('../services/bookingEngine');

console.log('--- Running HRMS Booking Engine Unit & Logic Tests ---');

// Test 1: Time Conversion
assert.strictEqual(timeToMinutes('00:00'), 0, '00:00 should be 0 minutes');
assert.strictEqual(timeToMinutes('12:30'), 750, '12:30 should be 750 minutes');
assert.strictEqual(timeToMinutes('19:45'), 1185, '19:45 should be 1185 minutes');
assert.strictEqual(minutesToTime(750), '12:30', '750 minutes should convert to 12:30');
console.log('✅ Test 1 Passed: Time conversion helpers');

// Test 2: Double-Booking Overlap Detection
// Case A: Overlapping reservations
const overlap1 = hasTimeOverlap('19:00', '20:30', '19:30', '21:00');
assert.strictEqual(overlap1, true, '19:00-20:30 and 19:30-21:00 MUST be flagged as overlapping');

// Case B: Completely non-overlapping slots (Lunch vs Dinner)
const overlap2 = hasTimeOverlap('12:00', '13:30', '19:00', '20:30');
assert.strictEqual(overlap2, false, '12:00-13:30 and 19:00-20:30 MUST NOT overlap');

// Case C: Adjacent contiguous slots (End of A is Start of B)
const overlap3 = hasTimeOverlap('12:00', '13:30', '13:30', '15:00');
assert.strictEqual(overlap3, false, 'Adjacent time slots (12:00-13:30 and 13:30-15:00) should be permissible without collision');

// Case D: Encapsulated slot (B is inside A)
const overlap4 = hasTimeOverlap('18:00', '22:00', '19:00', '20:00');
assert.strictEqual(overlap4, true, 'Slot inside a wider reservation must be flagged as collision');

console.log('✅ Test 2 Passed: Atomic double-booking overlap rules');

console.log('\n🎉 ALL HRMS CORE BOOKING ENGINE TESTS PASSED SUCCESSFULLY!\n');
