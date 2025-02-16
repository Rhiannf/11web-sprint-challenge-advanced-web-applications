// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import Spinner  from './Spinner'
import { render, screen } from '@testing-library/react';
import React from 'react';

test('sanity', () => {
  expect(true).toBe(true)
})

test('Spinner prop test', async () =>{
  render(<Spinner />)
  expect(screen.queryByText('Please wait...')).toBeInTheDocument
})