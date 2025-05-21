import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bitcoin Ordinals API</h1>
          <p className="text-gray-600 mt-1">
            Create Bitcoin Ordinals and Collections using Taproot transactions with on-chain storage
          </p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          API Online
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-bitcoin-orange mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M10.9 2.1l9.9 1.4 1.4 9.9-9.8 9.9-9.9-1.4-1.4-9.9z" />
                <path d="M10.9 2.1v5.8" />
                <path d="M14.5 2.3l-2.5 2m-7.4-2.3l9.8 9.8" />
              </svg>
              <h3 className="text-lg font-semibold">Create Ordinals</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Create Bitcoin Ordinals with on-chain metadata and images using Taproot transactions.
            </p>
            <Link href="/create-ordinal">
              <Button variant="outline" className="w-full text-bitcoin-orange border-bitcoin-orange hover:bg-bitcoin-light">
                Create Ordinal
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-bitcoin-orange mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              <h3 className="text-lg font-semibold">Create Collections</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Group your ordinals into collections with shared metadata and attributes.
            </p>
            <Link href="/create-collection">
              <Button variant="outline" className="w-full text-bitcoin-orange border-bitcoin-orange hover:bg-bitcoin-light">
                Create Collection
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-bitcoin-orange mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M12 9v6" />
                <path d="M15 11H9" />
                <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" />
              </svg>
              <h3 className="text-lg font-semibold">API Documentation</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Explore the complete API documentation with examples and usage guides.
            </p>
            <Link href="/docs/authentication">
              <Button variant="outline" className="w-full text-bitcoin-orange border-bitcoin-orange hover:bg-bitcoin-light">
                View Documentation
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-bitcoin-light w-12 h-12 rounded-full flex items-center justify-center text-bitcoin-orange mb-4">
                <span className="font-bold">1</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Create Transaction</h3>
              <p className="text-gray-600 text-sm">
                Submit your metadata and image to be embedded in a Taproot transaction.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-bitcoin-light w-12 h-12 rounded-full flex items-center justify-center text-bitcoin-orange mb-4">
                <span className="font-bold">2</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Sign & Broadcast</h3>
              <p className="text-gray-600 text-sm">
                The transaction is signed with your private key and broadcast to the Bitcoin network.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-bitcoin-light w-12 h-12 rounded-full flex items-center justify-center text-bitcoin-orange mb-4">
                <span className="font-bold">3</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Permanent Storage</h3>
              <p className="text-gray-600 text-sm">
                Your data is permanently inscribed on the Bitcoin blockchain as an Ordinal.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start">
          <div className="bg-bitcoin-light rounded-full p-2 text-bitcoin-orange mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">Security Notice</h3>
            <p className="text-sm text-gray-600">
              Your private key is never stored on our servers and is only used for transaction signing. All signing is done client-side for maximum security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
