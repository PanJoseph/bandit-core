import { Coin } from './coin';
import { DependencyGraph } from './dependencygraph';

export interface Chest {
  coins: Array<Coin>;
  dependencyGraph: DependencyGraph<String>;
}
