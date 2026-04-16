export interface CircularResult<T> {
  isCircular: boolean;
  node: T | null;
}

export interface DependencyGraph<T> {
  nodes: Map<String, Set<T>>;
  addEdge(src: T, dst: T): void;
  addNode(node: T): void;
  hasEdgeTo(src: T, dst: T): void;
  hasCircularDependency(): CircularResult<T>;
}
