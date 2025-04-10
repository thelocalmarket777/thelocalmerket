import React from 'react'
import MainLayout from '../layout/MainLayout';

import { Link } from 'react-router-dom';
import { Button } from './button';

function Nothing({title,content}) {
    return (
        <MainLayout>
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <p className="mb-6">{content}</p>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </MainLayout>
      );
}

export default Nothing
