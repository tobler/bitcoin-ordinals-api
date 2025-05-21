import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { z } from 'zod';
import { storage } from "./storage";
import { 
  insertOrdinalSchema, 
  insertCollectionSchema, 
  ordinalResponseSchema, 
  collectionResponseSchema 
} from "@shared/schema";
import { createOrdinal, createCollection } from "./bitcoin/ordinals";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  /**
   * Create an ordinal
   */
  app.post('/api/v1/ordinals', async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validationResult = insertOrdinalSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PARAMETERS',
            message: 'Invalid request parameters',
            details: validationResult.error.format()
          }
        });
      }
      
      const ordinalData = validationResult.data;
      
      // Extract privateKey and feeRate before storing
      const { privateKey, feeRate, ...ordinalToStore } = ordinalData;
      
      // Create the transaction
      const txResult = await createOrdinal(
        ordinalData.bitcoinAddress,
        privateKey,
        ordinalData.name,
        ordinalData.description || '',
        ordinalData.attributes || [],
        ordinalData.image || '',
        ordinalData.collectionId,
        feeRate
      );
      
      // Store ordinal in database with transaction info
      const ordinal = await storage.createOrdinal({
        ...ordinalToStore,
        txid: txResult.txid,
        status: 'confirmed', // In real implementation, this would initially be "pending"
        blockHeight: 830129, // Mock value - in real implementation, this would be updated after confirmation
        fees: txResult.fees,
        size: txResult.size
      });
      
      // Format response according to schema
      const response = ordinalResponseSchema.parse({
        ordinalId: ordinal.id,
        txid: ordinal.txid,
        inscription: `${ordinal.txid}i0`, // Simplified inscription ID format
        blockHeight: ordinal.blockHeight,
        timestamp: ordinal.timestamp?.toISOString(),
        fees: ordinal.fees,
        size: ordinal.size,
        status: ordinal.status
      });
      
      return res.status(200).json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error creating ordinal:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
      });
    }
  });
  
  /**
   * Create a collection
   */
  app.post('/api/v1/collections', async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validationResult = insertCollectionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PARAMETERS',
            message: 'Invalid request parameters',
            details: validationResult.error.format()
          }
        });
      }
      
      const collectionData = validationResult.data;
      
      // Extract privateKey and feeRate before storing
      const { privateKey, feeRate, ...collectionToStore } = collectionData;
      
      // Create the transaction
      const txResult = await createCollection(
        collectionData.bitcoinAddress,
        privateKey,
        collectionData.name,
        collectionData.description || '',
        collectionData.symbol || '',
        collectionData.image || '',
        feeRate
      );
      
      // Store collection in database with transaction info
      const collection = await storage.createCollection({
        ...collectionToStore,
        txid: txResult.txid,
        status: 'confirmed', // In real implementation, this would initially be "pending"
        blockHeight: 830125, // Mock value - in real implementation, this would be updated after confirmation
        fees: txResult.fees
      });
      
      // Format response according to schema
      const response = collectionResponseSchema.parse({
        collectionId: collection.id,
        txid: collection.txid,
        inscription: `${collection.txid}i0`, // Simplified inscription ID format
        blockHeight: collection.blockHeight,
        timestamp: collection.timestamp?.toISOString(),
        fees: collection.fees,
        size: txResult.size,
        status: collection.status
      });
      
      return res.status(200).json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error creating collection:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
      });
    }
  });
  
  /**
   * Get all ordinals
   */
  app.get('/api/v1/ordinals', async (req: Request, res: Response) => {
    try {
      const { collectionId, bitcoinAddress } = req.query;
      
      const filters: { collectionId?: number, bitcoinAddress?: string } = {};
      
      if (collectionId) {
        filters.collectionId = parseInt(collectionId as string, 10);
      }
      
      if (bitcoinAddress) {
        filters.bitcoinAddress = bitcoinAddress as string;
      }
      
      const ordinals = await storage.getOrdinals(filters);
      
      return res.status(200).json({
        success: true,
        data: ordinals.map(ordinal => ({
          ordinalId: ordinal.id,
          name: ordinal.name,
          description: ordinal.description,
          txid: ordinal.txid,
          inscription: ordinal.inscription,
          status: ordinal.status,
          timestamp: ordinal.timestamp?.toISOString()
        }))
      });
    } catch (error) {
      console.error('Error fetching ordinals:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
      });
    }
  });
  
  /**
   * Get a specific ordinal by ID
   */
  app.get('/api/v1/ordinals/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Invalid ordinal ID'
          }
        });
      }
      
      const ordinal = await storage.getOrdinal(id);
      
      if (!ordinal) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Ordinal not found'
          }
        });
      }
      
      return res.status(200).json({
        success: true,
        data: {
          ordinalId: ordinal.id,
          name: ordinal.name,
          description: ordinal.description,
          attributes: ordinal.attributes,
          image: ordinal.image,
          txid: ordinal.txid,
          inscription: ordinal.inscription,
          blockHeight: ordinal.blockHeight,
          timestamp: ordinal.timestamp?.toISOString(),
          fees: ordinal.fees,
          size: ordinal.size,
          status: ordinal.status
        }
      });
    } catch (error) {
      console.error('Error fetching ordinal:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
      });
    }
  });
  
  /**
   * Get all collections
   */
  app.get('/api/v1/collections', async (req: Request, res: Response) => {
    try {
      const collections = await storage.getCollections();
      
      return res.status(200).json({
        success: true,
        data: collections.map(collection => ({
          collectionId: collection.id,
          name: collection.name,
          symbol: collection.symbol,
          txid: collection.txid,
          inscription: collection.inscription,
          status: collection.status,
          timestamp: collection.timestamp?.toISOString()
        }))
      });
    } catch (error) {
      console.error('Error fetching collections:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
      });
    }
  });
  
  /**
   * Get a specific collection by ID
   */
  app.get('/api/v1/collections/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Invalid collection ID'
          }
        });
      }
      
      const collection = await storage.getCollection(id);
      
      if (!collection) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Collection not found'
          }
        });
      }
      
      return res.status(200).json({
        success: true,
        data: {
          collectionId: collection.id,
          name: collection.name,
          description: collection.description,
          symbol: collection.symbol,
          image: collection.image,
          txid: collection.txid,
          inscription: collection.inscription,
          blockHeight: collection.blockHeight,
          timestamp: collection.timestamp?.toISOString(),
          fees: collection.fees,
          status: collection.status
        }
      });
    } catch (error) {
      console.error('Error fetching collection:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
      });
    }
  });
  
  /**
   * Get all ordinals in a collection
   */
  app.get('/api/v1/collections/:id/ordinals', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Invalid collection ID'
          }
        });
      }
      
      const collection = await storage.getCollection(id);
      
      if (!collection) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Collection not found'
          }
        });
      }
      
      const ordinals = await storage.getOrdinals({ collectionId: id });
      
      return res.status(200).json({
        success: true,
        data: {
          collection: {
            collectionId: collection.id,
            name: collection.name
          },
          ordinals: ordinals.map(ordinal => ({
            ordinalId: ordinal.id,
            name: ordinal.name,
            txid: ordinal.txid,
            inscription: ordinal.inscription,
            status: ordinal.status
          }))
        }
      });
    } catch (error) {
      console.error('Error fetching collection ordinals:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
