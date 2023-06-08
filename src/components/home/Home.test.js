import React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { getOrdersMock } from '../../mocks/orders';
import { rest } from 'msw';
import {setupServer} from 'msw/node'
import Home from './Home';


const server = setupServer(
  rest.get('https://pizza-api-app.herokuapp.com/api/orders', (req,res,ctx) => {
    return res(
      ctx.json(getOrdersMock)
    )
  })
)

// Enable request interception.
beforeAll(() => server.listen())

// Reset handlers so that each test could alter them
// without affecting other, unrelated tests.
afterEach(() => server.resetHandlers())

// Don't forget to clean up afterwards.
afterAll(() => server.close())

test('renders home component ', () => {
  render(<Home />);
  const headerElement = screen.getByText("Your Orders");
  expect(headerElement).toBeInTheDocument();
});

test('order modal is launched on order button click', () => {
  render(<Home />);
  const orderButton = screen.getAllByRole("button",{name: /Create Order/});
  act(() => {
    fireEvent.click(orderButton[0])
  })
  const modalHeaderElement = screen.getByText("Customize Your Pizza");
  expect(modalHeaderElement).toBeInTheDocument();
});



/*****************************************
* Functionality to test
*
* # Create order modal is launched when button is pressed
* # Order modal submit is restricted with invalid inputs
* # Order modal close exits modal without submiting
* # Order modal submit updates list of orders and closes modal
* # Search box filters orders based on targeted field with string input
* # Search box clears orders when no string input
* # Remove Order button displays confirmation modal
* # Remove Order Modal removes item from order list once confirmed
* # On API calls banner is displayed at the top of page for 5 seconds with status
*
*
******************************************/