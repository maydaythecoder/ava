'use client';
import Spline from '@splinetool/react-spline';

const SplineComponent = () => {
  return (
    <main className='fixed inset-0 w-full h-[110vh] z-0'>
      <Spline
        scene="https://prod.spline.design/w0Bh6v-nKPBHO2hH/scene.splinecode" 
      />
    </main>
  )
}

export default SplineComponent