import React from 'react';

function Shimmer({ className = '' }) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 rounded-xl ${className}`}
      style={{
        backgroundImage: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
      }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-3 space-y-3 border border-gray-100 shadow-sm">
      <Shimmer className="w-full aspect-square rounded-2xl" />
      <div className="space-y-2 px-1">
        <Shimmer className="h-3 w-1/3 rounded-lg" />
        <Shimmer className="h-4 w-4/5 rounded-lg" />
        <Shimmer className="h-3 w-1/2 rounded-lg" />
        <div className="flex justify-between items-center pt-1">
          <Shimmer className="h-5 w-1/3 rounded-lg" />
          <Shimmer className="h-8 w-8 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Shimmer className={`h-4 rounded-lg ${i === 0 ? 'w-8' : i === cols - 1 ? 'w-16' : 'w-full'}`} />
        </td>
      ))}
    </tr>
  );
}

export function CardSkeleton({ className = '' }) {
  return <Shimmer className={`rounded-2xl ${className}`} />;
}
