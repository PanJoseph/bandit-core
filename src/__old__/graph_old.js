/*
  eslint no-param-reassign: [
    "error",
    {
      "props": true,
      "ignorePropertyModificationsFor": ["details", "nodes", "stack", "visited"]
    }
  ]
*/
import assign from 'object-assign';

function hasNode(nodes, node) {
  return Object.keys(nodes).indexOf(node) > -1;
}

function addNode(nodes, details, node, detail = {}) {
  if (!hasNode(nodes, node)) {
    nodes[node] = [];
    details[node] = detail;
  }

  return null;
}

function hasEdgeTo(nodes, node1, node2) {
  return nodes[node1].indexOf(node2) > -1;
}

function addEdge(nodes, node1, node2) {
  if (hasNode(nodes, node1) && hasNode(nodes, node2) && !hasEdgeTo(nodes, node1, node2)) {
    nodes[node1].push(node2);
  }

  return null;
}

function isCircular(nodes) {
  const visited = {};
  const stack = [];

  for (let node in nodes) {
    const connectedNodes = {};

    if (visited[node] == null) {
      stack.push(node);
    }

    while (stack.length != 0) {
      const node = stack.pop();

      if (connectedNodes[node] != null) {
        return { isCircular: true, node };
      }

      visited[node] = true;
      connectedNodes[node] = true;

      for (let child of nodes[node]) {
        stack.push(child);
      }
    }

    return { isCircular: false, node: null };
  }
}

function Graph() {
  const properties = {
    nodes: {},
    details: {}
  };

  const funcs = {
    hasNode: node => hasNode(properties.nodes, node),
    addNode: (node, details) => addNode(properties.nodes, properties.details, node, details),
    hasEdgeTo: (node1, node2) => hasEdgeTo(properties.nodes, node1, node2),
    addEdge: (node1, node2) => addEdge(properties.nodes, node1, node2),
    isCircular: () => isCircular(properties.nodes)
  };

  return assign({}, properties, funcs);
}

export default Graph;
