import { CircularResult, DependencyGraph } from './types/dependencygraph';

function addNode(nodes: Map<String, Set<String>>, node: String): void {
  if (!nodes.has(node)) {
    nodes.set(node, new Set());
  }
}

function hasEdgeTo(nodes: Map<String, Set<String>>, src: String, dst: String): boolean {
  const node = nodes.get(src)?.has(dst);
  return node !== undefined && node;
}

function addEdge(nodes: Map<String, Set<String>>, src: String, dst: String): void {
  if (nodes.has(src) && nodes.has(dst)) {
    nodes.get(src)?.add(dst);
  }
}

function hasCircularDependency(nodes: Map<String, Set<String>>): CircularResult<String> {
  const visitedNodes: Set<String> = new Set();
  const stack: Array<String> = [];

  for (let [node, _] of nodes) {
    const connectedNodes: Set<String> = new Set();

    if (!visitedNodes.has(node)) {
      stack.push(node);
    }

    while (stack.length > 0) {
      const stackNode = stack.pop();

      if (stackNode) {
        if (connectedNodes.has(stackNode)) {
          return { isCircular: true, node: stackNode };
        }

        visitedNodes.add(stackNode);
        connectedNodes.add(stackNode);

        nodes.get(stackNode)?.forEach(child => stack.push(child));
      }
    }
  }

  return { isCircular: false, node: null };
}

export default function newDependencyGraph(): DependencyGraph<String> {
  const nodes: Map<String, Set<String>> = new Map();
  const properties = {
    nodes
  };

  const funcs = {
    addNode: (node: String) => addNode(properties.nodes, node),
    hasEdgeTo: (src: String, dst: String) => hasEdgeTo(properties.nodes, src, dst),
    addEdge: (src: String, dst: String) => addEdge(properties.nodes, src, dst),
    hasCircularDependency: () => hasCircularDependency(properties.nodes)
  };

  return Object.assign({}, properties, funcs);
}
