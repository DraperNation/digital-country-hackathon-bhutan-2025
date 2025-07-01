import { Greeks } from './greeks.model';
import { PriceBand } from './price-band.model';
import { Quotes } from './quotes.model';

export class SimpleTicker {
  symbol!: string;
  contract_type!: string;
  strike_price!: number;
  best_ask!: number | null;
  best_bid!: number | null;
  spot_price!: number;
  expiry_date!: Date;

  constructor(ticker: OptionsTicker) {
    let split_symbol: string[] = ticker.symbol.split('-');
    this.symbol = split_symbol.at(1)!;
    this.contract_type = ticker.contract_type;
    this.strike_price = parseInt(ticker.strike_price);
    this.best_ask = parseFloat(ticker.quotes?.best_ask!);
    this.best_bid = parseFloat(ticker.quotes?.best_bid!);
    this.spot_price = parseFloat(ticker.spot_price);

    const day = parseInt(split_symbol.at(3)!.slice(0, 2));
    const month = parseInt(split_symbol.at(3)!.slice(2, 4)) - 1; // Months are 0-based in JavaScript
    const year = 2000 + parseInt(split_symbol.at(3)!.slice(4, 6));
    this.expiry_date = new Date(year, month, day);
  }
}

export interface Ticker {
  oi_value_usd: string;
  turnover_symbol: string;
  tick_size: string;
  size: number;
  initial_margin: string;
  symbol: string;
  timestamp: number;
  volume: number;
  open: number;
  close: number;
  type: string;
  spot_price: string;
  high: number;
  turnover: number;
  oi_contracts: string;
  low: number;
  quotes: Quotes | null;
  description: string;
  turnover_usd: number;
  tags: string[];
  contract_type: string;
  mark_change_24h: string;
  price_band: PriceBand;
  mark_price: string;
  oi_value_symbol: string;
  product_id: number;
  oi: string;
  underlying_asset_symbol: string;
  oi_value: string;
  oi_change_usd_6h: string;
}

export interface OptionsTicker extends Ticker {
  strike_price: string;
  greeks: Greeks | null;
  quotes: Quotes | null;
  contract_type: 'put_options' | 'call_options';
}

export interface FuturesTicker extends Ticker {
  mark_basis: string;
  funding_rate: string;
  quotes: Quotes | null;
  greeks: null;
  contract_type: 'perpetual_futures';
}
