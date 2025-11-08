// "use client";
// import React, { useEffect, useState } from "react";
// import { User } from "@/api/entities";
// import { createPageUrl } from "@/utils";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Shield, ArrowRight } from "lucide-react";
// import { motion } from "framer-motion";

// export default function AdminLogin() {
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     checkCurrentUser();
//   }, []);

//   const checkCurrentUser = async () => {
//     try {
//       const user = await User.me();
//       if (user) {
//         if (user.role === 'admin') {
//           window.location.href = createPageUrl("AdminDashboard");
//         } else if (user.role === 'team_member') {
//           window.location.href = createPageUrl("TeamDashboard");
//         } else {
//           window.location.href = createPageUrl("Dashboard");
//         }
//         return;
//       }
//     } catch (error) {
//       // User not logged in, show admin login page
//     }
//     setIsLoading(false);
//   };

//   const handleAdminLogin = async () => {
//     try {
//       // After login, the user will be redirected and checkCurrentUser will run again
//       await User.loginWithRedirect(window.location.href);
//     } catch (error) {
//       console.error('Admin login error:', error);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center py-12 px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="w-full max-w-md"
//       >
//         <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
//           <CardHeader className="text-center pb-4">
//             <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
//               <Shield className="h-8 w-8 text-white" />
//             </div>
//             <CardTitle className="text-2xl font-bold text-slate-800">
//               Staff Access
//             </CardTitle>
//             <p className="text-slate-600 mt-2">
//               Login for Administrators and Team Members
//             </p>
//           </CardHeader>

//           <CardContent className="space-y-6">
//             <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
//               <p className="text-amber-800 text-sm">
//                 <strong>Note:</strong> This area is restricted. You will be redirected based on your assigned role.
//               </p>
//             </div>

//             <Button
//               onClick={handleAdminLogin}
//               className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white"
//               size="lg"
//             >
//               Login as Staff
//               <ArrowRight className="ml-2 h-4 w-4" />
//             </Button>

//             <div className="text-center">
//               <p className="text-sm text-slate-500">
//                 Need regular user access?{" "}
//                 <a 
//                   href={createPageUrl("Home")} 
//                   className="text-teal-600 hover:text-teal-700 font-medium"
//                 >
//                   Go to Homepage
//                 </a>
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }