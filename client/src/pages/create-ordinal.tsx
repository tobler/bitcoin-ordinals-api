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
  FormFileUploadField,
  AttributeInput
} from "@/components/ui/form-field";
import { OrdinalResponse } from "@shared/schema";
import { estimateTransactionFee, estimateTransactionSize } from "@/lib/bitcoin";

export default function CreateOrdinalPage() {
  const { toast } = useToast();
  
  // Form state
  const [bitcoinAddress, setBitcoinAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState<Array<{ trait_type: string; value: string }>>([
    { trait_type: "", value: "" }
  ]);
  const [feeRate, setFeeRate] = useState("10");
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
  
  // Create ordinal mutation
  const createOrdinalMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/v1/ordinals", data);
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error?.message || "Failed to create ordinal");
      }
      return result.data as OrdinalResponse;
    },
    onSuccess: (data) => {
      toast({
        title: "Ordinal Created Successfully",
        description: `Transaction ID: ${data.txid}`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Creating Ordinal",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bitcoinAddress || !privateKey || !name || !imageDataUrl) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Clean up attributes to remove empty ones
    const filteredAttributes = attributes.filter(
      attr => attr.trait_type.trim() !== "" && attr.value.trim() !== ""
    );
    
    // Create ordinal data
    const ordinalData = {
      bitcoinAddress,
      privateKey,
      name,
      description,
      attributes: filteredAttributes,
      image: imageDataUrl,
      feeRate: parseInt(feeRate, 10),
      ...(collectionId ? { collectionId: parseInt(collectionId, 10) } : {})
    };
    
    createOrdinalMutation.mutate(ordinalData);
  };
  
  // Example request
  const exampleRequest = `POST /api/v1/ordinals HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "bitcoinAddress": "bc1p9yfwlm0w3vlczd7xzz3au0g08wnf89u838z3fvz90zkct7t2f9tqgskn6s",
  "privateKey": "****************************************",
  "collectionId": "65f4ae2b8c99f32e4f7a12d0",
  "name": "Crypto Punk #1234",
  "description": "A unique Bitcoin Ordinal NFT",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue"
    },
    {
      "trait_type": "Eyes",
      "value": "Laser"
    }
  ],
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEU...",
  "feeRate": 10
}`;

  // Example response
  const exampleResponse = `HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "ordinalId": "65f4af1c8c99f32e4f7a12d1",
    "txid": "8a2b89f3d2456789887654321c98765a40f87def4398cdef31415901e23456",
    "inscription": "1234567890abcdef1234567890abcdef12345678i0",
    "blockHeight": 830129,
    "timestamp": "2023-09-15T14:25:36Z",
    "fees": 2450,
    "size": 245,
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
          <h2 className="text-2xl font-bold text-gray-900">Create Bitcoin Ordinal</h2>
          <p className="text-gray-600">Create a new ordinal with on-chain metadata and image using Taproot transactions</p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          API Online
        </span>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-navy-100 text-navy-800 mr-3">
              POST
            </span>
            <code className="text-gray-800 text-sm font-mono">/api/v1/ordinals</code>
          </div>
          
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h3 className="text-lg font-semibold mb-4">Request Body</h3>
            
            <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
              {/* Form */}
              <div className="flex-1">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInputField
                      id="bitcoinAddress"
                      label="Bitcoin Address"
                      placeholder="bc1p..."
                      value={bitcoinAddress}
                      onChange={setBitcoinAddress}
                      required
                    />
                    <FormInputField
                      id="privateKey"
                      label="Private Key"
                      placeholder="Private key"
                      value={privateKey}
                      onChange={setPrivateKey}
                      isPassword
                      required
                    />
                  </div>
                  
                  <FormInputField
                    id="collectionId"
                    label="Collection ID (Optional)"
                    placeholder="Collection identifier"
                    value={collectionId}
                    onChange={setCollectionId}
                  />
                  
                  <FormInputField
                    id="name"
                    label="Ordinal Name"
                    placeholder="Name for your ordinal"
                    value={name}
                    onChange={setName}
                    required
                  />
                  
                  <FormTextAreaField
                    id="description"
                    label="Description"
                    placeholder="Description for your ordinal"
                    value={description}
                    onChange={setDescription}
                  />
                  
                  <AttributeInput
                    attributes={attributes}
                    setAttributes={setAttributes}
                  />
                  
                  <FormFileUploadField
                    id="image"
                    label="Image Upload"
                    onChange={handleFileChange}
                    required
                  />
                  
                  <div>
                    <label htmlFor="feeRate" className="block text-sm font-medium text-gray-700 mb-1">
                      Fee Rate (sats/vB)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        id="feeRate"
                        min="1"
                        max="100"
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
                      className="w-full bg-bitcoin-orange hover:bg-orange-600"
                      disabled={createOrdinalMutation.isPending}
                    >
                      {createOrdinalMutation.isPending ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Ordinal...
                        </>
                      ) : (
                        "Create Ordinal"
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
          <h3 className="text-lg font-semibold mb-4">How It Works</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800">Taproot Transactions</h4>
              <p className="text-gray-600">This API creates Bitcoin Ordinals using Taproot transactions, enabling efficient on-chain storage of metadata and images in a single transaction. Taproot offers improved privacy and reduced transaction size compared to legacy transaction formats.</p>
            </div>
            
            <div className="flex items-start mt-4">
              <div className="bg-bitcoin-light rounded-full p-2 text-bitcoin-orange mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Your private key is never stored on our servers and is only used for transaction signing. All signing is done client-side for security.</p>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <h4 className="font-medium text-gray-800">Transaction Process</h4>
              <ol className="mt-2 space-y-2 text-gray-600 list-decimal list-inside">
                <li>The API constructs a Taproot transaction with your provided data</li>
                <li>Metadata and image are embedded directly into the transaction</li>
                <li>The transaction is signed using the provided private key</li>
                <li>The signed transaction is broadcast to the Bitcoin network</li>
                <li>Once confirmed, your ordinal is permanently inscribed on the Bitcoin blockchain</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
