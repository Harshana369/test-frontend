// 'use client';

// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { isAuthenticated, getUser, setAuthToken, setUser as setUserState } from '@/lib/auth';
// import { logout } from '@/lib/api';
// import { useEffect, useState } from 'react';

// export default function Navbar() {
//   const router = useRouter();
//   const [user, setUser] = useState(getUser());
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     setUser(getUser());
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       setAuthToken(null);
//       setUserState(null);
//       setUser(null);
//       router.push('/auth/login');
//     } catch (err) {
//       console.error('Logout failed:', err);
//       // Even if logout fails on server, clear local storage
//       setAuthToken(null);
//       setUserState(null);
//       setUser(null);
//       router.push('/auth/login');
//     }
//   };

//   // Prevent hydration mismatch
//   if (!mounted) {
//     return (
//       <nav className="bg-blue-600 p-4">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <Link href="/" className="text-white text-xl font-bold">
//             My Blog
//           </Link>
//           <div className="space-x-4">
//             <Link href="/auth/login" className="text-white hover:text-gray-200">
//               Login
//             </Link>
//             <Link href="/auth/register" className="text-white hover:text-gray-200">
//               Register
//             </Link>
//           </div>
//         </div>
//       </nav>
//     );
//   }

//   return (
//     <nav className="bg-blue-600 p-4">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         <Link href="/" className="text-white text-xl font-bold">
//           My Blog
//         </Link>
//         <div className="flex items-center space-x-4">
//           {isAuthenticated() && user ? (
//             <>
//               <div className="text-white text-sm">
//                 <div className="flex items-center space-x-2">
//                   <div className="text-right">
//                     <div className="font-medium">
//                       {user.first_name && user.last_name 
//                         ? `${user.first_name} ${user.last_name}` 
//                         : user.username}
//                     </div>
//                     <div className="text-xs text-blue-200">
//                       {user.email}
//                     </div>
//                   </div>
//                   {user.avatar_url && (
//                     <img 
//                       src={user.avatar_url} 
//                       alt="Avatar" 
//                       className="w-8 h-8 rounded-full"
//                     />
//                   )}
//                 </div>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-sm transition-colors"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link href="/auth/login" className="text-white hover:text-gray-200">
//                 Login
//               </Link>
//               <Link href="/auth/register" className="text-white hover:text-gray-200">
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }


'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUser, setAuthToken, setUser as setUserState } from '@/lib/auth';
import { logout } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(getUser());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getUser());
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setAuthToken(null);
      setUserState(null);
      setUser(null);
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout failed:', err);
      setAuthToken(null);
      setUserState(null);
      setUser(null);
      router.push('/auth/login');
    }
  };

  if (!mounted) {
    return (
      <nav className="bg-blue-600 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-white text-xl font-bold">
            My Blog
          </Link>
          <div className="space-x-4">
            <Link href="/auth/login" className="text-white hover:text-gray-200">
              Login
            </Link>
            <Link href="/auth/register" className="text-white hover:text-gray-200">
              Register
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-blue-600 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          My Blog
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated() && user ? (
            <>
              <div className="text-white text-sm">
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="font-medium">
                      {user.first_name && user.last_name 
                        ? `${user.first_name} ${user.last_name}` 
                        : user.username}
                    </div>
                    <div className="text-xs text-blue-200">
                      {user.email}
                    </div>
                  </div>
                  {user.avatar_url && (
                    <img 
                      src={user.avatar_url} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                </div>
              </div>
              <Link href="/profile" className="text-white hover:text-gray-200">
                Profile
              </Link>
              <Link href="/dashboard" className="text-white hover:text-gray-200">
                Dashboard
              </Link>
              <Link href="/activity" className="text-white hover:text-gray-200">
                Activity
              </Link>
              <Link href="/sessions" className="text-white hover:text-gray-200">
                Sessions
              </Link>
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-white hover:text-gray-200">
                Login
              </Link>
              <Link href="/auth/register" className="text-white hover:text-gray-200">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}