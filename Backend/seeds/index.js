import { User, Pharmacy, Medicine, Inventory, Reservation } from '../src/models/index.js';
import logger from '../src/utils/logger.js';
import pharmacyData from './data/pharmacies.js';
import medicineData from './data/medicines.js';
import demoUsers from './data/users.js';

// Deterministic spread so some medicines are out of stock at some pharmacies.
function buildInventory(pharmacies, medicines) {
  const rows = [];
  pharmacies.forEach((pharmacy, pIndex) => {
    medicines.forEach((medicine, mIndex) => {
      const quantity = (pIndex * 7 + mIndex * 13) % 5 === 0 ? 0 : ((pIndex + mIndex) % 9) * 12 + 4;
      rows.push({
        pharmacy: pharmacy._id,
        medicine: medicine._id,
        quantity,
        price: 25 + ((pIndex * 3 + mIndex * 11) % 40) * 4.5,
        expiryDate: new Date(Date.now() + (180 + mIndex * 30) * 24 * 60 * 60 * 1000)
      });
    });
  });
  return rows;
}

// Setup generic/substitute relationships
async function setupGenerics(medicines) {
  // Paracetamol (Dolo 650) can be substituted with other paracetamol brands
  const paracetamol = medicines.find(m => m.name === 'Paracetamol');
  // Cetirizine has generic alternatives
  const cetirizine = medicines.find(m => m.name === 'Cetirizine');
  
  if (paracetamol) {
    // Create a generic version
    const genericParacetamol = new Medicine({
      name: 'Paracetamol',
      brand: 'Crocin 650',
      composition: 'Paracetamol 650mg',
      form: 'tablet',
      strength: '650mg',
      generics: []
    });
    const saved = await genericParacetamol.save();
    await Medicine.updateOne({ _id: paracetamol._id }, { generics: [saved._id] });
  }

  if (cetirizine) {
    const genericCetirizine = new Medicine({
      name: 'Cetirizine',
      brand: 'Histacet',
      composition: 'Cetirizine 10mg',
      form: 'tablet',
      strength: '10mg',
      generics: []
    });
    const saved = await genericCetirizine.save();
    await Medicine.updateOne({ _id: cetirizine._id }, { generics: [saved._id] });
  }
}

export async function clearDatabase() {
  await Promise.all([
    User.deleteMany({}),
    Pharmacy.deleteMany({}),
    Medicine.deleteMany({}),
    Inventory.deleteMany({}),
    Reservation.deleteMany({})
  ]);
}

export async function seedDatabase() {
  await clearDatabase();

  const pharmacies = await Pharmacy.insertMany(pharmacyData);
  const medicines = await Medicine.insertMany(medicineData);
  
  // Setup generic relationships
  await setupGenerics(medicines);
  
  const inventory = await Inventory.insertMany(buildInventory(pharmacies, medicines));

  for (const { password, pharmacyLicense, ...profile } of demoUsers) {
    const user = new User(profile);
    if (pharmacyLicense) {
      user.pharmacy = pharmacies.find((p) => p.licenseNumber === pharmacyLicense)?._id;
    }
    await user.setPassword(password);
    await user.save();
  }

  logger.info(
    `Seeded ${pharmacies.length} pharmacies, ${medicines.length} medicines, ${inventory.length} stock rows, ${demoUsers.length} users`
  );
  logger.info('Logins: patient@medgpt.dev / pharmacist@medgpt.dev (password123)');

  return { pharmacies, medicines, inventory };
}

export default seedDatabase;
