import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

const MortgageCalculator = () => {
  const { control, getValues, setValue } = useForm();
  const [totalMonthlyPayment, setTotalMonthlyPayment] = useState(0);
  const [monthlyLoanAmount, setMonthlyLoanAmount] = useState(0);
  const [taxAndFees, setTaxAndFees] = useState(0);
  const [downPaymentError, setDownPaymentError] = useState('');

  const calculatePayment = () => {
    const homePrice = parseFloat(getValues('homePrice')) || 0;
    const downPayment = parseFloat(getValues('downPayment')) || 0;
    const loanTerm = parseFloat(getValues('loanTerm')) || 0;
    const interestRate = parseFloat(getValues('interestRate')) || 0;
    const propertyTax = parseFloat(getValues('propertyTax')) / 12 || 0;
    const homeInsurance = parseFloat(getValues('homeInsurance')) / 12 || 0;

    if (homePrice < downPayment) {
      setDownPaymentError('Down Payment cannot be greater than Home Price');
    } else {
      setDownPaymentError('');
      const loanAmount = homePrice - downPayment;
      const monthlyInterestRate = (interestRate / 100) / 12;
      const numberOfPayments = loanTerm * 12;
      const monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
      const totalMonthlyPayment = monthlyPayment + propertyTax + homeInsurance;

      setMonthlyLoanAmount(monthlyPayment);
      setTaxAndFees(propertyTax + homeInsurance);
      setTotalMonthlyPayment(totalMonthlyPayment);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Mortgage Calculator</h2>
      <form>
        <div style={{ marginBottom: '10px' }}>
          <label>Home Price</label>
          <Controller
            control={control}
            name="homePrice"
            render={({ field }) => (
              <input
                type="number"
                {...field}
                placeholder="Enter Home Price"
                onChange={(e) => { field.onChange(e); calculatePayment(); }}
                style={{ width: '100%', padding: '8px' }}
              />
            )}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Down Payment</label>
          <Controller
            control={control}
            name="downPayment"
            render={({ field }) => (
              <input
                type="number"
                {...field}
                placeholder="Enter Down Payment"
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  field.onChange(value);
                  const homePrice = parseFloat(getValues('homePrice')) || 0;
                  const percentage = (value / homePrice) * 100;
                  setValue('downPaymentPerc', percentage.toFixed(2));
                  calculatePayment();
                }}
                style={{ width: '100%', padding: '8px' }}
              />
            )}
          />
        </div>
        {downPaymentError && (
          <div style={{ color: 'red', marginBottom: '10px' }}>
            {downPaymentError}
          </div>
        )}
        <div style={{ marginBottom: '10px' }}>
          <label>Down Payment Percentage (%)</label>
          <Controller
            control={control}
            name="downPaymentPerc"
            render={({ field }) => (
              <input
                type="number"
                {...field}
                placeholder="Enter Down Payment Percentage"
                onChange={(e) => {
                  const percentage = parseFloat(e.target.value) || 0;
                  field.onChange(percentage);
                  const homePrice = parseFloat(getValues('homePrice')) || 0;
                  const downPayment = (percentage / 100) * homePrice;
                  setValue('downPayment', downPayment.toFixed(2));
                  calculatePayment();
                }}
                style={{ width: '100%', padding: '8px' }}
              />
            )}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Loan Term (Years)</label>
          <Controller
            control={control}
            name="loanTerm"
            render={({ field }) => (
              <input
                type="number"
                {...field}
                placeholder="Enter Loan Term"
                onChange={(e) => { field.onChange(e); calculatePayment(); }}
                style={{ width: '100%', padding: '8px' }}
              />
            )}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Interest Rate (%)</label>
          <Controller
            control={control}
            name="interestRate"
            render={({ field }) => (
              <input
                type="number"
                {...field}
                placeholder="Enter Interest Rate"
                onChange={(e) => { field.onChange(e); calculatePayment(); }}
                style={{ width: '100%', padding: '8px' }}
              />
            )}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Property Tax (Yearly)</label>
          <Controller
            control={control}
            name="propertyTax"
            render={({ field }) => (
              <input
                type="number"
                {...field}
                placeholder="Enter Property Tax"
                onChange={(e) => { field.onChange(e); calculatePayment(); }}
                style={{ width: '100%', padding: '8px' }}
              />
            )}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Home Insurance (Yearly)</label>
          <Controller
            control={control}
            name="homeInsurance"
            render={({ field }) => (
              <input
                type="number"
                {...field}
                placeholder="Enter Home Insurance"
                onChange={(e) => { field.onChange(e); calculatePayment(); }}
                style={{ width: '100%', padding: '8px' }}
              />
            )}
          />
        </div>
      </form>
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Total Monthly Payment</h3>
        <p>${totalMonthlyPayment.toFixed(2)}</p>
        <h4>Breakdown</h4>
        <p>Loan Amount: ${monthlyLoanAmount.toFixed(2)}</p>
        <p>Taxes & Fees: ${taxAndFees.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default MortgageCalculator;
