'use client'
import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext'
import Image from 'next/image'
import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

function OrderPlacedContent() {
  const { router, products } = useAppContext();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Parse order details from query
      const items = JSON.parse(searchParams.get('items') || '[]');
      const address = JSON.parse(searchParams.get('address') || '{}');

      // Build order summary text
      let message = `Order Placed!\n\nItems:\n`;
      items.forEach(item => {
        // Find product name from products context
        const product = products.find(p => p._id === item.product);
        message += `• ${product ? product.name : 'Product'} x${item.quantity}\n`;
      });
      message += `\nDelivery Address:\n${address.fullName}, ${address.area}, ${address.city}, ${address.state}`;

      // WhatsApp number (your business number)
      const phone = '2349016242310'; // Replace with your WhatsApp number (country code + number, no + or spaces)
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      // Redirect to WhatsApp
      window.location.href = waUrl;
    }, 5000);

    return () => clearTimeout(timer);
  }, [router, searchParams, products]);

  return (
    <div className='h-screen flex flex-col justify-center items-center gap-5'>
      <div className="flex justify-center items-center relative">
        <Image className="absolute p-5" src={assets.checkmark} alt='' />
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
      </div>
      <div className="text-center text-2xl font-semibold">Order Placed Successfully</div>
      <div className="text-center text-gray-500 text-sm">You will be redirected to WhatsApp shortly...</div>
    </div>
  )
}

export default function OrderPlaced() {
  return (
    <Suspense>
      <OrderPlacedContent />
    </Suspense>
  );
}