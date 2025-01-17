import Image from "next/image";
import { useState } from "react";

export default function Home() {

  const [mortgageAmount, setMortgageAmount] = useState<string | null>(null);
  const [mortgageTerm, setMortgageTerm] = useState<number | null>(null);
  const [interestRate, setInterestRate] = useState<string | null>(null);
  const [repaymentType, setRepaymentType] = useState<string>("repayment");


  const [monthlyPayment, setMonthlyPayment] = useState<string | null>(null);
  const [interestOnlyPayment, setInterestOnlyPayment] = useState<string | null>(null);
  const [totalPayment, setTotalPayment] = useState<string | null>(null);

  const [showOption, setShowOption] = useState<boolean>(false);
  const [selectedKurs, setSelectedKurs] = useState<string | null>('dollar');
  const [symbolKurs, setSymbolKurs] = useState<string | null>('$');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const currencyFormat = (value: string | number) => {
    // Remove any non-digit characters except decimal point  
    const cleanValue = value.toString().replace(/[^\d.]/g, "");  
   
    // Split number into integer and decimal parts  
    const [integerPart, decimalPart] = cleanValue.split(".");  
    
    // Add thousand separator to integer part  
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");  
    
    // Combine with decimal part if it exists  
    return decimalPart !== undefined   
      ? `${formattedInteger}.${decimalPart}`  
      : formattedInteger;  
  };

  const kursDisplay = (value: string | null) => {
    switch (value) {
      case "idr":
        return "IDR - Indonesia";
      case "dollar":
        return "DOLLAR - US";
      case "pound":
        return "POUNDSTERLING - UK";
      default:
        return "Select Kurs";
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!mortgageAmount || isNaN(Number(mortgageAmount.replace(/,/g, ''))) || Number(mortgageAmount.replace(/,/g, '')) <= 0) {
      newErrors.mortgageAmount = "Please enter a valid mortgage amount.";
    }
    if (!mortgageTerm || isNaN(Number(mortgageTerm)) || Number(mortgageTerm) <= 0) {
      newErrors.mortgageTerm = "Please enter a valid mortgage term.";
    }
    if (!interestRate || isNaN(Number(interestRate.replace(/,/g, ''))) || Number(interestRate.replace(/,/g, '')) <= 0 || Number(interestRate.replace(/,/g, '')) > 100) {
      newErrors.interestRate = "Please enter a valid interest rate.";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateForm();
  };

  const repayment = () => {
    const P = mortgageAmount ? Number(mortgageAmount.replace(/,/g, '')) : 0;
    const r = interestRate ? Number(interestRate.replace(/,/g, '')) / 100 / 12 : 0;
    const n = mortgageTerm ? Number(mortgageTerm) * 12 : 0;
    const monthlyPayment = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);

    return monthlyPayment;
  }

  const interestOnly = () => {
    const P = mortgageAmount ? Number(mortgageAmount.replace(/,/g, '')) : 0;
    const r = interestRate ? Number(interestRate.replace(/,/g, '')) / 100 / 12 : 0;
    const n = mortgageTerm ? Number(mortgageTerm) * 12 : 0;

    const monthlyPayment = (P * r * n);

    console.log(monthlyPayment);

    return monthlyPayment;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Perform calculation
      if (repaymentType === "repayment") {
        setMonthlyPayment(currencyFormat(repayment().toFixed(2)));
      }

      if (repaymentType === "interest-only") {
        setInterestOnlyPayment(currencyFormat(interestOnly().toFixed(2)));
      }

      setTotalPayment(
        currencyFormat((Number(repayment().toFixed(2)) * (mortgageTerm ? Number(mortgageTerm) * 12 : 0)).toFixed(2))
      )
    }
  };

  const clearAll = () => {
    setInterestOnlyPayment(null);
    setInterestRate(null);
    setMonthlyPayment(null);
    setTotalPayment(null);
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen py-2 bg-slate-100`}>
      <div className="w-5/6 lg:w-4/6 flex flex-col gap-4 py-8 sm:py-0">
        <div className="w-full sm:w-1/3 relative">
          <div className="selected-input bg-white h-12 rounded-xl overflow-hidden">
            <span className="absolute left-0 flex items-center justify-center top-1/2 w-14 text-lg font-bold transform -translate-y-1/2 bg-slate-300 text-white h-full">Kurs</span>
            <input 
              type="text" 
              title="selected-kurs" 
              name="selected-kurs" 
              placeholder="Select Kurs" 
              value={kursDisplay(selectedKurs)}
              onClick={() => setShowOption(!showOption)}
              className="flex flex-row items-center text-xl indent-20 outline-none w-full h-full cursor-pointer rounded-xl" readOnly />

              { showOption ? 
                <div className="absolute top-14 left-0 right-0 bottom-0 w-full h-fit min-h-10 bg-white z-20 shadow-lg rounded-xl overflow-hidden">
                  <a className="flex flex-row items-center gap-4 p-4 hover:bg-lime cursor-pointer" onClick={() => { setSelectedKurs("idr"); setSymbolKurs("Rp."); setShowOption(false); }}>IDR - Indonesia</a>
                  <a className="flex flex-row items-center gap-4 p-4 hover:bg-lime cursor-pointer" onClick={() => { setSelectedKurs("dollar"); setSymbolKurs("$"); setShowOption(false); }}>DOLLAR - US</a>
                  <a className="flex flex-row items-center gap-4 p-4 hover:bg-lime cursor-pointer" onClick={() => { setSelectedKurs("pound"); setSymbolKurs("£");  setShowOption(false); }}>POUNDSTERLING - UK</a>
                </div>
                : '' 
              }
          </div>
        </div>

        <div className={`flex flex-col gap-8 relative z-10 w-full bg-white rounded-3xl shadow-lg p-4 min-h-card overflow-hidden lg:x-[block]`}>
          <div className={`w-full lg:w-1/2 py-4 px-4 sm:px-8 flex flex-col gap-4`}>
            <div className={`header-card w-full flex flex-row justify-between items-center`}>
              <h4 className={`text-lg lg:text-2xl font-bold text-slate-900`}>Mortgage Calculator</h4>
              <a onClick={() => clearAll()} className={`cursor-pointer`}>
                <span className={`text-sm lg:text-lg text-slate-600`}>Clear All</span>
              </a>
            </div>

            <form action="" className={`flex flex-col gap-4 w-full`} onSubmit={handleSubmit}>
              <div className="input-group flex flex-col gap-2 relative">
                <label htmlFor="mortgage-amount">Mortgage Amount</label>
                <div className="relative border-2 border-slate-500 rounded-lg overflow-hidden">
                  <span className="absolute left-0 flex items-center justify-center top-1/2 w-14 text-lg font-bold transform -translate-y-1/2 bg-slate-300 text-white h-full">{symbolKurs}</span>
                  <input 
                    className={`w-full h-14 indent-20 focus:outline-none`} id="mortgage-amount" 
                    value={mortgageAmount ?? ''}
                    onChange={(e) => setMortgageAmount(currencyFormat(e.target.value))}
                    onBlur={() => handleBlur('mortgageAmount')}
                  />
                </div>
                {touched.mortgageAmount && errors.mortgageAmount && <span className="text-red-500">{errors.mortgageAmount}</span>}
              </div>

              <div className="w-full flex flex-col sm:flex-row justify-between gap-4 mb-2">
                <div className="input-group flex flex-col gap-2 w-full sm:w-1/2 relative">
                  <label htmlFor="mortgage-term">Mortgage Term</label>
                  <div className="relative border-2 border-slate-500 rounded-lg overflow-hidden">
                    <input 
                      className={`w-full h-14 indent-4 focus:outline-none`} 
                      type="number"
                      id="mortgage-term" 
                      value={mortgageTerm ?? ''}
                      onChange={(e) => setMortgageTerm(Number(e.target.value))}
                      onBlur={() => handleBlur('mortgageTerm')}
                    />
                    <span className="absolute right-0 top-1/2 h-full m-auto w-16 transform -translate-y-1/2 bg-slate-300 text-white flex items-center justify-center font-bold">years</span>
                  </div>
                  {touched.mortgageTerm && errors.mortgageTerm && <span className="text-red-500">{errors.mortgageTerm}</span>}
                </div>
                <div className="input-group flex flex-col gap-2 w-full sm:w-1/2 relative">
                  <label htmlFor="interest-rate">Interest Rate</label>
                  <div className="relative border-2 border-slate-500 rounded-lg overflow-hidden">
                    <input 
                      id="interest-rate" 
                      className={`w-full h-14 indent-4 focus:outline-none`} 
                      value={interestRate ?? ''}
                      onChange={(e) => setInterestRate(currencyFormat(e.target.value))}
                      onBlur={() => handleBlur('interestRate')}
                    />
                    <span className="absolute right-0 top-1/2 h-full m-auto w-12 transform -translate-y-1/2 bg-slate-300 text-white flex items-center justify-center font-bold">%</span>
                  </div>
                  {touched.interestRate && errors.interestRate && <span className="text-red-500">{errors.interestRate}</span>}
                </div>
              </div>

              <div className="input-group">
                <div className="text-lg mb-2">Mortgage Type</div>
                <div className="flex flex-col gap-2">
                  <a className={`flex flex-row gap-4 border-2 border-lime p-4 rounded-lg cursor-pointer w-full hover:bg-lime ${repaymentType && repaymentType === 'repayment' ? 'bg-lime' : ''}`} onClick={() => setRepaymentType("repayment")}>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="repayment-type" 
                        value="repayment" 
                        className="border-2 border-slate-500" 
                        checked={repaymentType === "repayment"}
                        onChange={() => setRepaymentType("repayment")}
                      />
                      Repayment
                    </label>
                  </a>

                  <a className={`flex flex-row gap-4 border-2 border-lime p-4 rounded-lg cursor-pointer w-full hover:bg-lime ${repaymentType && repaymentType === 'interest-only' ? 'bg-lime' : ''}`} onClick={() => setRepaymentType("interest-only")}>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="interest-only" 
                        value="interest-only" 
                        className="border-2 border-slate-500" 
                        checked={repaymentType === "interest-only"}
                        onChange={() => setRepaymentType("interest-only")}
                      />
                      Interest only
                    </label>
                  </a>
                </div>
              </div>

              <button type="submit" className="btn py-4 bg-lime rounded-5xl w-full sm:w-2/3 px-18 flex flex-row justify-center items-center gap-4 mt-4">
                <img src="/images/icon-calculator.svg" alt="icon-calculator-button" className="px-4" />
                Calculate Repayments
              </button>
            </form>
          </div>


          <div className={`relative bg-slate-900 w-auto h-full rounded-bl-2xl lg:rounded-bl-5xl lg:absolute top-0 bottom-0 right-0 lg:w-1/2 -m-4 lg:m-0 p-8`}>
            {(monthlyPayment || interestOnlyPayment) ? (  
              <div className="flex flex-col justify-center gap-4">
                <h4 className="text-2xl font-bold text-white">Your Results</h4>
                <p className="text-slate-400 text-lg">Your results are shown below based on the information you provided. To adjust the results, edit the form and click “calculate repayments” again.</p>
                <div className="w-full min-h-120 flex flex-col gap-10 rounded-2xl border-t-8 border-lime p-8 bg-black bg-opacity-25 pt-10">
                  {(repaymentType === 'repayment') ? 
                    <div className="flex flex-col gap-4">
                      <div className="text-lg text-slate-400">Your monthly repayments</div>
                      <div className="text-4xl sm:text-6xl text-lime font-bold">{symbolKurs} { monthlyPayment }</div>
                    </div>
                  : 
                    <div className="flex flex-col gap-4">
                      <div className="text-lg text-slate-400">Just interest only</div>
                      <div className="text-6xl text-lime font-bold">{symbolKurs} { interestOnlyPayment }</div>
                    </div>
                  }


                  <div className="bg-slate-400 w-full h-0.5"></div>

                  <div className="flex flex-col gap-4">
                    <div className="text-lg text-slate-400">Total you'll repay over the term</div>
                    <div className="text-2xl text-lime font-bold">{symbolKurs} { totalPayment }</div>
                  </div>
                </div>
              </div>
            ) : (  
              <div className="flex flex-col justify-center items-center gap-4 h-full">
                <Image src="/images/illustration-empty.svg" alt="calculator-icon" width={250} height={250} />
                <div className={`text-white text-4xl font-bold`}>Result shown here</div>
                <div className={`w-full sm:w-5/6 break-words sm:text-center text-slate-300`}>
                  Complete the form and click “calculate repayments” to see what your monthly repayments would be.  
                </div>
              </div>
            )} 
          </div>
        </div>
      </div>

    </div>
  );
}
