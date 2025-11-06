// src/components/CheckoutSteps.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { name: 'Sign In', path: '/login', active: step1 },
    { name: 'Shipping', path: '/shipping', active: step2 },
    { name: 'Payment', path: '/payment', active: step3 },
    { name: 'Place Order', path: '/placeorder', active: step4 },
  ];

  return (
    <nav className="flex justify-center mb-8" aria-label="Checkout progress">
      <ol className="flex items-center space-x-2 sm:space-x-4">
        {steps.map((step, index) => (
          <li key={step.name} className="flex items-center">
            {step.active ? (
              <Link to={step.path} className="text-primary hover:text-primary/80 font-semibold text-sm sm:text-base">
                {step.name}
              </Link>
            ) : (
              <span className="text-muted-foreground text-sm sm:text-base cursor-default">
                {step.name}
              </span>
            )}
            {index < steps.length - 1 && (
              <svg className={`ml-2 sm:ml-4 h-4 w-4 ${step.active ? 'text-primary' : 'text-muted-foreground'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default CheckoutSteps;