import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeBlock from "@/components/ui/code-block";
import { useParams } from "wouter";

const exampleAuthenticationContent = `
// Provide your Bitcoin address and private key with every request
// Your private key is only used client-side for transaction signing

const response = await fetch('/api/v1/ordinals', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    bitcoinAddress: 'bc1p9yfwlm0w3vlczd7xzz3au0g08wnf89u838z3fvz90zkct7t2f9tqgskn6s',
    privateKey: '**************************************',
    // Other ordinal data...
  })
});
`;

const exampleEndpointsContent = `
// Create a new ordinal
POST /api/v1/ordinals

// Create a new collection
POST /api/v1/collections

// Get all ordinals
GET /api/v1/ordinals

// Get specific ordinal
GET /api/v1/ordinals/:id

// Get all collections
GET /api/v1/collections

// Get specific collection
GET /api/v1/collections/:id

// Get all ordinals in a collection
GET /api/v1/collections/:id/ordinals
`;

const exampleErrorsContent = `
// 400 Bad Request
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Invalid Bitcoin address format",
    "details": {
      "field": "bitcoinAddress",
      "reason": "Address must be a valid Taproot address starting with bc1p"
    }
  }
}

// 404 Not Found
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Ordinal not found"
  }
}

// 500 Internal Server Error
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
`;

const exampleLimitsContent = `
// Rate limit information is returned in response headers
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1632156823

// When rate limit is exceeded (429 Too Many Requests)
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "details": {
      "limit": 60,
      "reset": 1632156823
    }
  }
}
`;

const exampleQuickstartContent = `
// 1. Create a collection
const collectionResponse = await fetch('/api/v1/collections', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    bitcoinAddress: 'bc1p9yfwlm0w3vlczd7xzz3au0g08wnf89u838z3fvz90zkct7t2f9tqgskn6s',
    privateKey: '*************************************',
    name: 'My Collection',
    description: 'A collection of Bitcoin Ordinals',
    symbol: 'MYCOL',
    image: dataUrlOfImage
  })
});

const { data: collection } = await collectionResponse.json();

// 2. Create an ordinal in the collection
const ordinalResponse = await fetch('/api/v1/ordinals', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    bitcoinAddress: 'bc1p9yfwlm0w3vlczd7xzz3au0g08wnf89u838z3fvz90zkct7t2f9tqgskn6s',
    privateKey: '*************************************',
    name: 'My First Ordinal',
    description: 'An example ordinal',
    collectionId: collection.collectionId,
    attributes: [
      { trait_type: 'Type', value: 'Example' }
    ],
    image: dataUrlOfImage
  })
});

const { data: ordinal } = await ordinalResponse.json();
`;

const exampleListOrdinalsContent = `
// Get all ordinals
const response = await fetch('/api/v1/ordinals');
const data = await response.json();

// Get ordinals by Bitcoin address
const response = await fetch('/api/v1/ordinals?bitcoinAddress=bc1p9yfwlm0w3vlczd7xzz3au0g08wnf89u838z3fvz90zkct7t2f9tqgskn6s');
const data = await response.json();

// Get ordinals in a collection
const response = await fetch('/api/v1/collections/123/ordinals');
const data = await response.json();

// Example response
{
  "success": true,
  "data": [
    {
      "ordinalId": 1,
      "name": "Ordinal #1",
      "description": "An example ordinal",
      "txid": "8a2b89f3d2456789887654321c98765a40f87def4398cdef31415901e23456",
      "inscription": "8a2b89f3d2456789887654321c98765a40f87def4398cdef31415901e23456i0",
      "status": "confirmed",
      "timestamp": "2023-09-15T14:25:36Z"
    },
    // More ordinals...
  ]
}
`;

const exampleViewOrdinalContent = `
// Get a specific ordinal by ID
const response = await fetch('/api/v1/ordinals/1');
const data = await response.json();

// Example response
{
  "success": true,
  "data": {
    "ordinalId": 1,
    "name": "Ordinal #1",
    "description": "An example ordinal",
    "attributes": [
      { "trait_type": "Type", "value": "Example" }
    ],
    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEU...",
    "txid": "8a2b89f3d2456789887654321c98765a40f87def4398cdef31415901e23456",
    "inscription": "8a2b89f3d2456789887654321c98765a40f87def4398cdef31415901e23456i0",
    "blockHeight": 830129,
    "timestamp": "2023-09-15T14:25:36Z",
    "fees": 2450,
    "size": 245,
    "status": "confirmed"
  }
}
`;

const exampleTestApiContent = `
// Using the API with Fetch
async function createOrdinal() {
  const response = await fetch('/api/v1/ordinals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bitcoinAddress: 'bc1p9yfwlm0w3vlczd7xzz3au0g08wnf89u838z3fvz90zkct7t2f9tqgskn6s',
      privateKey: '*************************************',
      name: 'Test Ordinal',
      description: 'Testing the API',
      attributes: [
        { trait_type: 'Purpose', value: 'Testing' }
      ],
      image: dataUrlOfImage,
      feeRate: 10
    })
  });
  
  const data = await response.json();
  console.log('Ordinal created:', data);
}

// Using the API with Axios
import axios from 'axios';

async function createCollection() {
  try {
    const response = await axios.post('/api/v1/collections', {
      bitcoinAddress: 'bc1p9yfwlm0w3vlczd7xzz3au0g08wnf89u838z3fvz90zkct7t2f9tqgskn6s',
      privateKey: '*************************************',
      name: 'Test Collection',
      description: 'Testing the API',
      symbol: 'TEST',
      image: dataUrlOfImage,
      feeRate: 5
    });
    
    console.log('Collection created:', response.data);
  } catch (error) {
    console.error('Error creating collection:', error.response?.data || error.message);
  }
}
`;

const exampleSwaggerContent = `
// Swagger UI is available at:
/api/docs

// OpenAPI specification is available at:
/api/docs/swagger.json

// You can also use the specification with tools like Postman, Insomnia, etc.
`;

export default function DocumentationPage() {
  const params = useParams();
  const { section = "authentication" } = params;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive guide to using the Bitcoin Ordinals API
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue={section} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-8">
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="errors">Errors</TabsTrigger>
              <TabsTrigger value="limits">Rate Limits</TabsTrigger>
              <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
              <TabsTrigger value="list-ordinals">List Ordinals</TabsTrigger>
              <TabsTrigger value="view-ordinal">View Ordinal</TabsTrigger>
              <TabsTrigger value="test-api">Test API</TabsTrigger>
            </TabsList>
            
            <TabsContent value="authentication" className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Authentication</h3>
              <p className="text-gray-600 mb-4">
                This API uses private key authentication for all endpoints. Your Bitcoin private key is required to sign 
                transactions but is only used client-side and never stored on our servers.
              </p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 h-5 w-5">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Security Warning:</strong> Never share your private key. Use testing keys with minimal funds during development.
                    </p>
                  </div>
                </div>
              </div>
              
              <h4 className="font-medium text-gray-800 mt-6 mb-2">Example Usage</h4>
              <CodeBlock code={exampleAuthenticationContent} language="javascript" title="Authentication Example" />
            </TabsContent>
            
            <TabsContent value="endpoints" className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">API Endpoints</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/api/v1/ordinals</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">POST</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Create a new Bitcoin Ordinal</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/api/v1/collections</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">POST</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Create a new collection</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/api/v1/ordinals</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GET</td>
                      <td className="px-6 py-4 text-sm text-gray-500">List all ordinals for an address</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/api/v1/ordinals/{"{id}"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GET</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Get ordinal details by ID</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/api/v1/collections</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GET</td>
                      <td className="px-6 py-4 text-sm text-gray-500">List all collections</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/api/v1/collections/{"{id}"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GET</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Get collection details by ID</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/api/v1/collections/{"{id}"}/ordinals</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GET</td>
                      <td className="px-6 py-4 text-sm text-gray-500">List all ordinals in a collection</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <CodeBlock code={exampleEndpointsContent} language="javascript" title="API Endpoints" />
            </TabsContent>
            
            <TabsContent value="errors" className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Error Handling</h3>
              <p className="text-gray-600 mb-4">
                The API uses standard HTTP status codes along with detailed error messages.
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Code</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">400</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Bad Request</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Invalid input parameters or data format</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">401</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Unauthorized</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Invalid or missing API key</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">403</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Forbidden</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Not authorized to perform the requested action</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">404</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Not Found</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Requested resource not found</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">429</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Too Many Requests</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Rate limit exceeded</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">500</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Internal Server Error</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Unexpected server error</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4 className="font-medium text-gray-800 mt-6 mb-2">Error Response Format</h4>
              <CodeBlock code={exampleErrorsContent} language="javascript" title="Error Response Format" />
            </TabsContent>
            
            <TabsContent value="limits" className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Rate Limits</h3>
              <p className="text-gray-600 mb-4">
                To ensure fair usage of the API, rate limits are applied based on your subscription tier.
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate Limit</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Burst Limit</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Free</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10 requests per minute</td>
                      <td className="px-6 py-4 text-sm text-gray-500">20 requests</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Developer</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">60 requests per minute</td>
                      <td className="px-6 py-4 text-sm text-gray-500">100 requests</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Business</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">300 requests per minute</td>
                      <td className="px-6 py-4 text-sm text-gray-500">500 requests</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Enterprise</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Custom</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Custom</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4 className="font-medium text-gray-800 mt-6 mb-2">Rate Limit Headers</h4>
              <CodeBlock code={exampleLimitsContent} language="javascript" title="Rate Limit Headers" />
            </TabsContent>
            
            <TabsContent value="quickstart" className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Quick Start Guide</h3>
              <p className="text-gray-600 mb-4">
                This guide will help you get started with the Bitcoin Ordinals API.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">Step 1: Prepare Your Bitcoin Address</h4>
                  <p className="text-gray-600">
                    You'll need a Taproot-compatible Bitcoin address (starting with bc1p) and its corresponding private key.
                    Make sure the address has sufficient funds to cover transaction fees.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800">Step 2: Create a Collection (Optional)</h4>
                  <p className="text-gray-600">
                    If you want to group multiple ordinals together, start by creating a collection.
                    You'll get back a collection ID to use when creating ordinals.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800">Step 3: Create an Ordinal</h4>
                  <p className="text-gray-600">
                    Create your ordinal with metadata and an image. If you created a collection, include its ID in the request.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800">Step 4: Check Transaction Status</h4>
                  <p className="text-gray-600">
                    Use the returned transaction ID to check the status of your transaction on a Bitcoin block explorer.
                  </p>
                </div>
              </div>
              
              <h4 className="font-medium text-gray-800 mt-6 mb-2">Example Code</h4>
              <CodeBlock code={exampleQuickstartContent} language="javascript" title="Quick Start Example" />
            </TabsContent>
            
            <TabsContent value="list-ordinals" className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">List Ordinals</h3>
              <p className="text-gray-600 mb-4">
                Retrieve a list of ordinals with various filtering options.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">Filtering Options</h4>
                  <p className="text-gray-600">
                    You can filter ordinals by Bitcoin address or collection ID.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600">
                    <li>Get all ordinals: <code className="text-sm bg-gray-100 p-1 rounded">/api/v1/ordinals</code></li>
                    <li>Filter by Bitcoin address: <code className="text-sm bg-gray-100 p-1 rounded">/api/v1/ordinals?bitcoinAddress=bc1p...</code></li>
                    <li>Get ordinals in a collection: <code className="text-sm bg-gray-100 p-1 rounded">/api/v1/collections/{"{id}"}/ordinals</code></li>
                  </ul>
                </div>
              </div>
              
              <h4 className="font-medium text-gray-800 mt-6 mb-2">Example Code</h4>
              <CodeBlock code={exampleListOrdinalsContent} language="javascript" title="List Ordinals Example" />
            </TabsContent>
            
            <TabsContent value="view-ordinal" className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">View Ordinal</h3>
              <p className="text-gray-600 mb-4">
                Get detailed information about a specific ordinal.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">Available Information</h4>
                  <p className="text-gray-600">
                    The API returns comprehensive information about the ordinal, including:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600">
                    <li>Basic details (name, description)</li>
                    <li>Attributes</li>
                    <li>Image data</li>
                    <li>Transaction information (txid, inscription, block height)</li>
                    <li>Status and timestamp</li>
                    <li>Transaction fees and size</li>
                  </ul>
                </div>
              </div>
              
              <h4 className="font-medium text-gray-800 mt-6 mb-2">Example Code</h4>
              <CodeBlock code={exampleViewOrdinalContent} language="javascript" title="View Ordinal Example" />
            </TabsContent>
            
            <TabsContent value="test-api" className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Test API</h3>
              <p className="text-gray-600 mb-4">
                Examples for testing the API with different HTTP clients.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">Testing Tools</h4>
                  <p className="text-gray-600">
                    You can test the API using various HTTP clients:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600">
                    <li>Browser's Fetch API</li>
                    <li>Axios</li>
                    <li>Postman</li>
                    <li>cURL</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 h-5 w-5">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Testing Tip:</strong> Always use test addresses and private keys with minimal funds when testing the API.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <h4 className="font-medium text-gray-800 mt-6 mb-2">Example Code</h4>
              <CodeBlock code={exampleTestApiContent} language="javascript" title="Test API Examples" />
            </TabsContent>
            
            <TabsContent value="swagger" className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Swagger Documentation</h3>
              <p className="text-gray-600 mb-4">
                The API is documented using OpenAPI/Swagger specification.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">Interactive Documentation</h4>
                  <p className="text-gray-600">
                    Swagger UI provides an interactive interface for exploring and testing the API.
                  </p>
                </div>
              </div>
              
              <h4 className="font-medium text-gray-800 mt-6 mb-2">Access Swagger</h4>
              <CodeBlock code={exampleSwaggerContent} language="javascript" title="Swagger Access" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
