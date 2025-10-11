// 'use client';

// import { Suspense, lazy } from 'react';

// // Lazy load Spline to avoid bundle size issues
// const SplineComponent = lazy(() => 
//   import('@splinetool/react-spline').then(module => ({
//     default: module.default
//   }))
// );

// export default function Spline() {
//   return (
//     <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50" />}>
//       <SplineComponent
//         scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
//         className="w-full h-full"
//       />
//     </Suspense>
//   );
// }


