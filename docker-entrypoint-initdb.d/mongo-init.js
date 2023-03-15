print('Start #################################################################');

db = db.getSiblingDB('mongo-vehicle');
db.createUser(
  {
    user: 'mateuszuran',
    pwd: 'password123',
    roles: [{ role: 'readWrite', db: 'mongo-vehicle' }],
  },
);
db.createCollection('vehicle');