import { Coin } from './coin';

export type CurrencyConverter = (coin: Coin) => Coin;
