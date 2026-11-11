import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

async function fillForm(user, address2 = '') {
  await user.type(screen.getByLabelText('Email'), 'Pritesh.patel2@georgebrown.ca');
  await user.type(screen.getByLabelText('Name'), 'Pritesh Patel');
  await user.type(screen.getByLabelText('Address', { exact: true }), '160 Kendal Ave');
  if (address2) await user.type(screen.getByLabelText('Address 2'), address2);
  await user.type(screen.getByLabelText('City'), 'Toronto');
  await user.selectOptions(screen.getByLabelText('Province'), 'Ontario');
  await user.type(screen.getByLabelText('Postal Code'), 'M5R 1M3');
}

test('shows all entered information only after submission, and updates on resubmission', async () => {
  const user = userEvent.setup();
  render(<App />);
  expect(screen.queryByRole('region')).not.toBeInTheDocument();
  await fillForm(user, 'Apartment 5');
  await user.click(screen.getByRole('checkbox'));
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  const result = within(screen.getByRole('region', { name: 'Submitted information' }));
  for (const value of ['Pritesh.patel2@georgebrown.ca', 'Pritesh Patel', '160 Kendal Ave',
    'Apartment 5', 'Toronto', 'Ontario', 'M5R 1M3', 'Yes']) {
    expect(result.getByText(value)).toBeInTheDocument();
  }
  await user.clear(screen.getByLabelText('City'));
  await user.type(screen.getByLabelText('City'), 'Ottawa');
  expect(result.getByText('Toronto')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  expect(result.getByText('Ottawa')).toBeInTheDocument();
  expect(result.queryByText('Toronto')).not.toBeInTheDocument();
});

test('requires valid email, required fields and consent, while allowing empty Address 2', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  expect(screen.queryByRole('region')).not.toBeInTheDocument();
  await fillForm(user);
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  expect(screen.queryByRole('region')).not.toBeInTheDocument();
  await user.click(screen.getByRole('checkbox'));
  await user.clear(screen.getByLabelText('Email'));
  await user.type(screen.getByLabelText('Email'), 'invalid-email');
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  expect(screen.queryByRole('region')).not.toBeInTheDocument();
  await user.clear(screen.getByLabelText('Email'));
  await user.type(screen.getByLabelText('Email'), 'student@example.com');
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  expect(screen.getByRole('region')).toHaveTextContent('student@example.com');
  expect(within(screen.getByRole('region')).queryByText('Address 2:')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Province').options).toHaveLength(11);
});
