import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CodeBlock from "@/components/ui/code-block";
import { 
  FormInputField, 
  FormTextAreaField, 
  FormFileUploadField 
} from "@/components/ui/form-field";
import { CollectionResponse } from "@shared/schema";
import { estimateTransactionFee, estimateTransactionSize } from "@/lib/bitcoin";

export default function CreateCollectionPage() {
  const { toast } = useToast();
  
  // Form state
  const [bitcoinAddress, setBitcoinAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [symbol, setSymbol] = useState("");
  const [feeRate, setFeeRate] = useState("5");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  
  // Handle file upload
  const handleFileChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageDataUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageDataUrl(null);
    }
  };
  
  // Create collection mutation
  const createCollectionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/v1/collections", data);
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error?.message || "Failed to create collection");
      }
      return result.data as CollectionResponse;
    },
    onSuccess: (data) => {
      toast({
        title: "Collection Created Successfully",
        description: `Collection ID: ${data.collectionId}, Transaction ID: ${data.txid}`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Creating Collection",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bitcoinAddress || !privateKey || !name) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Create collection data
    const collectionData = {
      bitcoinAddress,
      privateKey,
      name,
      description,
      symbol,
      image: imageDataUrl,
      feeRate: parseInt(feeRate, 10)
    };
    
    createCollectionMutation.mutate(collectionData);
  };
  
  // Example request
  const exampleRequest = `POST /api/v1/collections HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "bitcoinAddress": "bc1p9yfwlm0w3vlczd7xzz3au0g08wnf89u838z3fvz90zkct7t2f9tqgskn6s",
  "privateKey": "****************************************",
  "name": "Crypto Punks Collection",
  "description": "A collection of unique Bitcoin Ordinals",
  "symbol": "CPUNK",
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEU...",
  "feeRate": 5,
  "useTestnet": false
}`;

  // Example response
  const exampleResponse = `HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "collectionId": "65f4ae2b8c99f32e4f7a12d0",
    "txid": "9a3b78f2d1456789887654321c98765a40f87def4398cdef31415901e23458",
    "inscription": "1234567890abcdef1234567890abcdef12345678i0",
    "blockHeight": 830125,
    "timestamp": "2023-09-15T12:20:11Z",
    "fees": 1230,
    "size": 246,
    "status": "confirmed"
  }
}`;

  // Estimate fee
  const estimatedSize = estimateTransactionSize(2, 2, true);
  const estimatedFee = estimateTransactionFee(estimatedSize, parseInt(feeRate, 10));

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create Collection</h2>
          <p className="text-gray-600">Create a new collection to group multiple ordinals together</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-navy-100 text-navy-800 mr-3">
              POST
            </span>
            <code className="text-gray-800 text-sm font-mono">/api/v1/collections</code>
          </div>
          
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h3 className="text-lg font-semibold mb-4">Request Body</h3>
            
            <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
              {/* Form */}
              <div className="flex-1">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInputField
                      id="collectionBitcoinAddress"
                      label="Bitcoin Address"
                      placeholder="bc1p..."
                      value={bitcoinAddress}
                      onChange={setBitcoinAddress}
                      required
                    />
                    <FormInputField
                      id="collectionPrivateKey"
                      label="Private Key"
                      placeholder="Private key"
                      value={privateKey}
                      onChange={setPrivateKey}
                      isPassword
                      required
                    />
                  </div>
                  
                  <FormInputField
                    id="collectionName"
                    label="Collection Name"
                    placeholder="Name for your collection"
                    value={name}
                    onChange={setName}
                    required
                  />
                  
                  <FormTextAreaField
                    id="collectionDescription"
                    label="Description"
                    placeholder="Description for your collection"
                    value={description}
                    onChange={setDescription}
                  />
                  
                  <FormInputField
                    id="collectionSymbol"
                    label="Symbol"
                    placeholder="Collection symbol (e.g. BTCPUNK)"
                    value={symbol}
                    onChange={setSymbol}
                  />
                  
                  <FormFileUploadField
                    id="collectionImage"
                    label="Collection Image"
                    onChange={handleFileChange}
                  />
                  
                  <div>
                    <label htmlFor="collectionFeeRate" className="block text-sm font-medium text-gray-700 mb-1">
                      Fee Rate (sats/vB)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        id="collectionFeeRate"
                        min="1"
                        max="50"
                        value={feeRate}
                        onChange={(e) => setFeeRate(e.target.value)}
                        className="w-full"
                      />
                      <span className="ml-2 text-sm text-gray-600">{feeRate} sats/vB</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Estimated fee: {estimatedFee} sats (~${(estimatedFee * 0.00000001 * 60000).toFixed(2)} USD)
                    </p>
                  </div>
                  
                  <div className="py-3">
                    <Button
                      type="submit"
                      className="w-full bg-bitcoin-orange text-white font-bold hover:bg-orange-600"
                      disabled={createCollectionMutation.isPending}
                    >
                      {createCollectionMutation.isPending ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Collection...
                        </>
                      ) : (
                        "Create Collection"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
              
              {/* Code Example */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-4">Example Request</h3>
                <CodeBlock code={exampleRequest} title="Request" />
                
                <h3 className="text-lg font-semibold mt-6 mb-4">Example Response</h3>
                <CodeBlock code={exampleResponse} title="Response" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Collections and Ordinals</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800">What are Collections?</h4>
              <p className="text-gray-600">
                Collections allow you to group related ordinals together under a common identifier. This enables organization and discoverability of ordinals that share common traits or belong to the same project.
              </p>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <h4 className="font-medium text-gray-800">How to Use Collections</h4>
              <ol className="mt-2 space-y-2 text-gray-600 list-decimal list-inside">
                <li>Create a collection using this endpoint</li>
                <li>Save the returned collection ID</li>
                <li>When creating new ordinals, include the collection ID in the request</li>
                <li>The ordinals will automatically be associated with your collection</li>
              </ol>
            </div>
            
            <div className="flex items-start mt-4">
              <div className="bg-bitcoin-light rounded-full p-2 text-bitcoin-orange mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-5 0v-15A2.5 2.5 0 0 1 9.5 2Z" />
                  <path d="M14.5 8A2.5 2.5 0 0 1 17 10.5v9a2.5 2.5 0 0 1-5 0v-9A2.5 2.5 0 0 1 14.5 8Z" />
                  <path d="M3 10l2 2-2 2" />
                  <path d="M21 14l-2-2 2-2" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Collections themselves are created as ordinals, with their metadata and image stored on-chain using the same Taproot transaction mechanism.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
