import { 
  type Collection, 
  type InsertCollection, 
  type Ordinal, 
  type InsertOrdinal 
} from "@shared/schema";

// Interface for storage methods
export interface IStorage {
  createCollection(collection: Omit<InsertCollection, "privateKey" | "feeRate">): Promise<Collection>;
  getCollection(id: number): Promise<Collection | undefined>;
  getCollectionByTxid(txid: string): Promise<Collection | undefined>;
  getCollections(): Promise<Collection[]>;
  updateCollection(id: number, updates: Partial<Collection>): Promise<Collection>;
  
  createOrdinal(ordinal: Omit<InsertOrdinal, "privateKey" | "feeRate">): Promise<Ordinal>;
  getOrdinal(id: number): Promise<Ordinal | undefined>;
  getOrdinalByTxid(txid: string): Promise<Ordinal | undefined>;
  getOrdinals(filters?: { collectionId?: number, bitcoinAddress?: string }): Promise<Ordinal[]>;
  updateOrdinal(id: number, updates: Partial<Ordinal>): Promise<Ordinal>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private collections: Map<number, Collection>;
  private ordinals: Map<number, Ordinal>;
  private collectionIdCounter: number;
  private ordinalIdCounter: number;

  constructor() {
    this.collections = new Map();
    this.ordinals = new Map();
    this.collectionIdCounter = 1;
    this.ordinalIdCounter = 1;
  }

  // Collection methods
  async createCollection(collection: Omit<InsertCollection, "privateKey" | "feeRate">): Promise<Collection> {
    const id = this.collectionIdCounter++;
    const newCollection: Collection = {
      ...collection,
      id,
      status: "pending",
      timestamp: new Date(),
    };
    this.collections.set(id, newCollection);
    return newCollection;
  }

  async getCollection(id: number): Promise<Collection | undefined> {
    return this.collections.get(id);
  }

  async getCollectionByTxid(txid: string): Promise<Collection | undefined> {
    return Array.from(this.collections.values()).find(
      (collection) => collection.txid === txid
    );
  }

  async getCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values());
  }

  async updateCollection(id: number, updates: Partial<Collection>): Promise<Collection> {
    const collection = this.collections.get(id);
    if (!collection) {
      throw new Error(`Collection with ID ${id} not found`);
    }
    
    const updatedCollection = { ...collection, ...updates };
    this.collections.set(id, updatedCollection);
    return updatedCollection;
  }

  // Ordinal methods
  async createOrdinal(ordinal: Omit<InsertOrdinal, "privateKey" | "feeRate">): Promise<Ordinal> {
    const id = this.ordinalIdCounter++;
    const newOrdinal: Ordinal = {
      ...ordinal,
      id,
      status: "pending",
      timestamp: new Date(),
    };
    this.ordinals.set(id, newOrdinal);
    return newOrdinal;
  }

  async getOrdinal(id: number): Promise<Ordinal | undefined> {
    return this.ordinals.get(id);
  }

  async getOrdinalByTxid(txid: string): Promise<Ordinal | undefined> {
    return Array.from(this.ordinals.values()).find(
      (ordinal) => ordinal.txid === txid
    );
  }

  async getOrdinals(filters?: { collectionId?: number, bitcoinAddress?: string }): Promise<Ordinal[]> {
    let result = Array.from(this.ordinals.values());
    
    if (filters) {
      if (filters.collectionId !== undefined) {
        result = result.filter(ordinal => ordinal.collectionId === filters.collectionId);
      }
      
      if (filters.bitcoinAddress) {
        result = result.filter(ordinal => ordinal.bitcoinAddress === filters.bitcoinAddress);
      }
    }
    
    return result;
  }

  async updateOrdinal(id: number, updates: Partial<Ordinal>): Promise<Ordinal> {
    const ordinal = this.ordinals.get(id);
    if (!ordinal) {
      throw new Error(`Ordinal with ID ${id} not found`);
    }
    
    const updatedOrdinal = { ...ordinal, ...updates };
    this.ordinals.set(id, updatedOrdinal);
    return updatedOrdinal;
  }
}

// Export singleton instance
export const storage = new MemStorage();
