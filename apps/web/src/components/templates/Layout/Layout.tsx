import { Link } from 'react-router-dom';
import { LayoutProps } from './Layout.types';

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex items-center'>
              <Link to='/' className='flex-shrink-0 flex items-center'>
                <h1 className='text-xl font-bold text-gray-900'>
                  Dealer Support
                </h1>
              </Link>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-500'>
                Case Management System
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>{children}</main>
    </div>
  );
};
