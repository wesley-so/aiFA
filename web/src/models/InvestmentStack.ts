import Investment from "./Investment";

interface InvestmentStack {
  username: string;
  portfolio: Array<Investment>;
  timestamp: number;
}

export default InvestmentStack;
