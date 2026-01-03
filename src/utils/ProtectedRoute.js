// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const { user, loading } = useAuth();

//   // Show loading spinner while checking authentication
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // If not authenticated, redirect to login
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // If user role is not allowed, redirect based on role
//   if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
//     // Redirect to appropriate dashboard based on user role
//     if (user.role === 'employer') {
//       return <Navigate to="/employer/dashboard" replace />;
//     } else if (user.role === 'seeker') {
//       return <Navigate to="/seeker/dashboard" replace />;
//     }
//     // Fallback to home if role is unknown
//     return <Navigate to="/" replace />;
//   }

//   // User is authenticated and authorized
//   return children;
// };

// export default ProtectedRoute;