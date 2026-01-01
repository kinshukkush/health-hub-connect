import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://kinshuksaxena3_db_user:Ov5lFTRGbYF3dXrY@cluster0.ceqszik.mongodb.net/?appName=Cluster0';
const dbName = 'healthhub';

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export async function connectToDatabase() {
  if (clientPromise) {
    return clientPromise;
  }

  if (!client) {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    clientPromise = client.connect();
  }

  return clientPromise;
}

export async function getDatabase() {
  const client = await connectToDatabase();
  return client.db(dbName);
}

export async function getCollection(collectionName: string) {
  const db = await getDatabase();
  return db.collection(collectionName);
}

// Helper functions for common operations
export const collections = {
  users: () => getCollection('users'),
  appointments: () => getCollection('appointments'),
  doctors: () => getCollection('doctors'),
  medicalRecords: () => getCollection('medical_records'),
};

// Disconnect function for cleanup
export async function disconnectFromDatabase() {
  if (client) {
    await client.close();
    client = null;
    clientPromise = null;
  }
}
