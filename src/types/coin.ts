export enum CoinType {
  NORMAL = 'NORMAL',
  DEPENDENT = 'DEPENDENT',
  MULTIVARIANT = 'MULTIVARIANT',
  DEPENDENTMULTIVARIANT = 'DEPENDENTMULTIVARIANT'
}

export enum VariantType {
  VARIANT = 'VARIANT',
  DEPENDENTVARIANT = 'DEPENDENTVARIANT'
}

export interface Sample<T> {
  readonly count: number;
  readonly value: T;
}

interface Behavior {
  readonly dependentBehaviorToExpressOn: boolean;
  readonly behaviorToExpress: boolean;
}

export interface Dependent {
  behavior: Behavior;
  readonly priority: number;
  readonly name: String;
}

export interface Variant {
  readonly name: String;
  readonly probability: number;
  readonly type: VariantType;
}

export interface DependentVariant extends Variant {
  readonly dependsOn: Array<Dependent>;
}

export interface Coin {
  active?: boolean;
  metadata?: Map<String, any>;
  readonly name: String;
  readonly type: CoinType;
}

export interface NormalCoin extends Coin {
  readonly probability: number;
}

export interface MultiVariantCoin extends Coin {
  activeVariant?: String;
  readonly variants: Array<Variant>;
}

export interface DependentCoin extends Coin {
  readonly probability: number;
  readonly dependsOn: Array<Dependent>;
}

export interface DependentMultiVariantCoin extends Coin {
  activeVariant?: Variant;
  readonly variants: Array<Variant | DependentVariant>;
}
