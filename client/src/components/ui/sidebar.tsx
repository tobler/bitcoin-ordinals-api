import { Link, useLocation } from "wouter";

type SidebarProps = {
  open: boolean;
};

export default function Sidebar({ open }: SidebarProps) {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <aside 
      className={`bg-navy-900 text-white w-64 flex-shrink-0 fixed h-full overflow-y-auto z-10 transition-all duration-300 ease-in-out ${
        open ? 'translate-x-0' : '-translate-x-64'
      }`}
    >
      <div className="p-4 flex items-center space-x-3 border-b border-navy-700">
        <svg 
          className="w-8 h-8" 
          viewBox="0 0 24 24" 
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" fill="#F7931A"/>
          <path d="M15.6 10.8c.2-1.4-.8-2.2-2.3-2.7l.5-1.9-1.2-.3-.5 1.8c-.3-.1-.6-.2-1-.3l.5-1.8-1.2-.3-.5 1.9c-.2-.1-.5-.1-.7-.2l-1.6-.4-.3 1.3s.9.2.9.2c.5.1.6.4.5.7l-.5 2c0 .1.1.1.1.1-.1 0-.1 0-.2-.1L7.5 15c-.1.3-.4.7-.9.5l-.9-.2-.5 1.4 1.6.4c.3.1.6.2.8.2l-.5 1.9 1.2.3.5-1.9c.3.1.6.2.9.3l-.5 1.9 1.2.3.5-1.9c1.7.3 3 .2 3.5-1.4.4-1.3 0-2-.9-2.5.7-.1 1.2-.6 1.3-1.5zm-2.3 3.3c-.3 1.2-2.4.5-3 .4l.5-2.1c.7.2 2.8.5 2.5 1.7zm.3-3.1c-.3 1.1-2 .5-2.6.4l.5-1.9c.6.1 2.2.4 2.1 1.5z" 
            fill="white"/>
        </svg>
        <h1 className="text-xl font-bold">Ordinals API</h1>
      </div>

      <nav className="p-4">
        <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Documentation</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/">
              <a className={`flex items-center ${isActive('/') ? 'text-white bg-navy-800' : 'text-gray-300 hover:text-white hover:bg-navy-800'} rounded-md px-3 py-2`}>
                <i className="fas fa-home w-5 h-5 mr-2"></i>
                <span>Overview</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/docs/quickstart">
              <a className={`flex items-center ${isActive('/docs/quickstart') ? 'text-white bg-navy-800' : 'text-gray-300 hover:text-white hover:bg-navy-800'} rounded-md px-3 py-2`}>
                <i className="fas fa-bolt w-5 h-5 mr-2"></i>
                <span>Quick Start</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/docs/authentication">
              <a className={`flex items-center ${isActive('/docs/authentication') ? 'text-white bg-navy-800' : 'text-gray-300 hover:text-white hover:bg-navy-800'} rounded-md px-3 py-2`}>
                <i className="fas fa-key w-5 h-5 mr-2"></i>
                <span>Authentication</span>
              </a>
            </Link>
          </li>
        </ul>
        
        <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mt-6 mb-3">API Reference</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/create-ordinal">
              <a className={`flex items-center ${isActive('/create-ordinal') ? 'text-white bg-navy-800' : 'text-gray-300 hover:text-white hover:bg-navy-800'} rounded-md px-3 py-2`}>
                <i className="fas fa-plus-circle w-5 h-5 mr-2"></i>
                <span>Create Ordinal</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/create-collection">
              <a className={`flex items-center ${isActive('/create-collection') ? 'text-white bg-navy-800' : 'text-gray-300 hover:text-white hover:bg-navy-800'} rounded-md px-3 py-2`}>
                <i className="fas fa-layer-group w-5 h-5 mr-2"></i>
                <span>Create Collection</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/docs/list-ordinals">
              <a className={`flex items-center ${isActive('/docs/list-ordinals') ? 'text-white bg-navy-800' : 'text-gray-300 hover:text-white hover:bg-navy-800'} rounded-md px-3 py-2`}>
                <i className="fas fa-list w-5 h-5 mr-2"></i>
                <span>List Ordinals</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/docs/view-ordinal">
              <a className={`flex items-center ${isActive('/docs/view-ordinal') ? 'text-white bg-navy-800' : 'text-gray-300 hover:text-white hover:bg-navy-800'} rounded-md px-3 py-2`}>
                <i className="fas fa-eye w-5 h-5 mr-2"></i>
                <span>View Ordinal</span>
              </a>
            </Link>
          </li>
        </ul>
        
        <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mt-6 mb-3">Development</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/docs/test-api">
              <a className={`flex items-center ${isActive('/docs/test-api') ? 'text-white bg-navy-800' : 'text-gray-300 hover:text-white hover:bg-navy-800'} rounded-md px-3 py-2`}>
                <i className="fas fa-vial w-5 h-5 mr-2"></i>
                <span>Test API</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/docs/swagger">
              <a className={`flex items-center ${isActive('/docs/swagger') ? 'text-white bg-navy-800' : 'text-gray-300 hover:text-white hover:bg-navy-800'} rounded-md px-3 py-2`}>
                <i className="fas fa-file-code w-5 h-5 mr-2"></i>
                <span>Swagger Docs</span>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
