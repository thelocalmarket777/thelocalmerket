import { Package, Truck } from 'lucide-react'
import React from 'react'

function Shippinginfo() {
  return (
    <div className="border-t border-gray-200 pt-6 space-y-4">
    <div className="flex items-start gap-3">
      <Truck className="text-gray-400 mt-0.5" size={20} />
      <div>
        <h4 className="font-medium text-gray-900">Free Shipping</h4>
        <p className="text-sm text-gray-500">On orders over Rs 500. Otherwise RS 80.</p>
      </div>
    </div>
    <div className="flex items-start gap-3">
      <Package className="text-gray-400 mt-0.5" size={20} />
      <div>
        <h4 className="font-medium text-gray-900">Easy Returns</h4>
        <p className="text-sm text-gray-500">30 day return policy. Return for any reason.</p>
      </div>
    </div>
  </div>
  )
}

export default Shippinginfo
