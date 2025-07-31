//uppu's test file
const request = require('supertest');
const express = require('express');
const axios = require('axios');
const mysql = require('mysql2/promise');
const app = require('./your-app-file'); // Replace with your actual file path

// Mock axios and mysql2/promise for testing
jest.mock('axios');
jest.mock('mysql2/promise');

describe('API Endpoints', () => {
  let mockPool;
  let mockConnection;

  beforeAll(() => {
    // Mock MySQL pool and connection
    mockConnection = {
      execute: jest.fn(),
      query: jest.fn(),
      release: jest.fn()
    };

    mockPool = {
      execute: jest.fn(),
      query: jest.fn(),
      getConnection: jest.fn().mockResolvedValue(mockConnection)
    };

    mysql.createPool.mockReturnValue(mockPool);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test /api/news endpoint
  describe('GET /api/news', () => {
    it('should return news data with valid parameters', async () => {
      const mockRows = [
        { datetime: '2023-01-01', headline: 'Test Headline', source: 'Test Source', url: 'http://test.com', summary: 'Test Summary' }
      ];
      mockPool.execute.mockResolvedValue([mockRows]);

      const response = await request(app)
        .get('/api/news')
        .query({ asset_type: 'stock', symbol: 'TSLA' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRows);
      expect(mockPool.execute).toHaveBeenCalledWith(
        'SELECT datetime, headline, source, url, summary FROM financial_news WHERE asset_type = ? AND symbol = ? ORDER BY datetime DESC',
        ['stock', 'TSLA']
      );
    });

    it('should return 400 for missing parameters', async () => {
      const response = await request(app).get('/api/news');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Test /api/asset_price endpoint
  describe('GET /api/asset_price', () => {
    it('should return price data with valid parameters', async () => {
      const mockRows = [{ price: 100.50 }];
      mockPool.execute.mockResolvedValue([mockRows]);

      const response = await request(app)
        .get('/api/asset_price')
        .query({ asset_type: 'stock', name: 'TSLA', date: '2023-01-01' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ price: 100.50 }, { note: "This is the price data for the given asset." }]);
    });

    it('should return 404 when no data found', async () => {
      mockPool.execute.mockResolvedValue([[]]);

      const response = await request(app)
        .get('/api/asset_price')
        .query({ asset_type: 'stock', name: 'INVALID', date: '2023-01-01' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for missing parameters', async () => {
      const response = await request(app).get('/api/asset_price');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Test /currentStock endpoint
  describe('GET /currentStock/:ticket', () => {
    it('should return stock price from Yahoo Finance', async () => {
      const mockResponse = {
        data: {
          chart: {
            result: [{
              indicators: {
                quote: [{
                  close: [185.42]
                }]
              }
            }]
          }
        }
      };
      axios.get.mockResolvedValue(mockResponse);

      const response = await request(app).get('/currentStock/TSLA');
      expect(response.status).toBe(200);
      expect(response.text).toBe('185.42');
    });

    it('should handle Yahoo Finance API error', async () => {
      axios.get.mockRejectedValue(new Error('API Error'));
      const response = await request(app).get('/currentStock/TSLA');
      expect(response.status).toBe(500); // Or whatever your error handling returns
    });
  });

  // Test /currentFund endpoint
  describe('GET /currentFund/:ticket', () => {
    it('should return fund price from Yahoo Finance', async () => {
      const mockResponse = {
        data: {
          chart: {
            result: [{
              indicators: {
                quote: [{
                  close: [250.75]
                }]
              }
            }]
          }
        }
      };
      axios.get.mockResolvedValue(mockResponse);

      const response = await request(app).get('/currentFund/VFINX');
      expect(response.status).toBe(200);
      expect(response.text).toBe('250.75');
    });
  });

  // Test /currentCrypto endpoint
  describe('GET /currentCrypto/:ticket', () => {
    it('should return crypto price from CoinGecko', async () => {
      const mockResponse = {
        data: {
          prices: [[1688976000000, 30000.50]]
        }
      };
      axios.get.mockResolvedValue(mockResponse);

      const response = await request(app).get('/currentCrypto/bitcoin');
      expect(response.status).toBe(200);
      expect(response.text).toBe('30000.5');
    });
  });

  // Test /currentExchange endpoint
  describe('GET /currentExchange/:ticket', () => {
    it('should return exchange rate from Frankfurter API', async () => {
      const mockResponse = {
        data: {
          rates: { USD: 1.2 }
        }
      };
      axios.get.mockResolvedValue(mockResponse);

      const response = await request(app).get('/currentExchange/EUR');
      expect(response.status).toBe(200);
      expect(response.text).toBe('1.2');
    });
  });

  // Test /currentIndex endpoint
  describe('GET /currentIndex/:ticket', () => {
    it('should return index price from Yahoo Finance', async () => {
      const mockResponse = {
        data: {
          chart: {
            result: [{
              indicators: {
                quote: [{
                  close: [4500.25]
                }]
              }
            }]
          }
        }
      };
      axios.get.mockResolvedValue(mockResponse);

      const response = await request(app).get('/currentIndex/^GSPC');
      expect(response.status).toBe(200);
      expect(response.text).toBe('4500.25');
    });
  });
});