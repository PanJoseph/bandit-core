import { DependencyGraph } from '../types/dependencygraph';
import newDependencyGraph from '../dependencygraph';

describe('Graph tests', () => {
  let testGraph: DependencyGraph<String>;

  describe('addNode method tests', () => {
    beforeEach(() => {
      testGraph = newDependencyGraph();
    });

    it('add a node and sets it value to an empty set', () => {
      testGraph.addNode('a');

      expect(testGraph.nodes.get('a')).toEqual(new Set());
    });

    it('ignores adding node that exist', () => {
      testGraph.addNode('a');

      expect(testGraph.nodes.get('a')).toEqual(new Set());

      testGraph.addNode('b');
      testGraph.addNode('c');
      testGraph.addNode('d');

      testGraph.addEdge('a', 'b');
      testGraph.addEdge('a', 'c');
      testGraph.addEdge('a', 'd');

      expect(testGraph.nodes.get('a')).toEqual(new Set(['b', 'c', 'd']));

      testGraph.addNode('a');

      expect(testGraph.nodes.get('a')).toEqual(new Set(['b', 'c', 'd']));
    });
  });

  describe('hasEdgeTo method tests', () => {
    beforeEach(() => {
      testGraph = newDependencyGraph();
    });

    it('returns true when an edge exists to another node', () => {
      testGraph.addNode('a');
      testGraph.addNode('b');
      testGraph.addEdge('a', 'b');

      expect(testGraph.hasEdgeTo('a', 'b')).toBeTruthy();
    });

    it('return false when an edge does not exists to another node', () => {
      testGraph.addNode('a');
      testGraph.addNode('b');

      expect(testGraph.hasEdgeTo('a', 'b')).toBeFalsy();
    });
  });

  describe('addEdge method tests', () => {
    beforeEach(() => {
      testGraph = newDependencyGraph();
    });

    it('adds an edge between nodes correctly & unidirectionally', () => {
      testGraph.addNode('a');
      testGraph.addNode('b');
      testGraph.addEdge('a', 'b');

      expect(testGraph.nodes.get('a')).toEqual(new Set(['b']));
      expect(testGraph.nodes.get('b')).toEqual(new Set());
    });

    it('does not an an edge to a non-existent node', () => {
      testGraph.addNode('a');

      testGraph.addEdge('a', 'b');

      expect(testGraph.nodes.get('a')).toEqual(new Set());
    });

    it('does not re-add edges', () => {
      testGraph.addNode('a');
      testGraph.addNode('b');
      testGraph.addEdge('a', 'b');

      expect(testGraph.nodes.get('a')).toEqual(new Set(['b']));
      expect(testGraph.nodes.get('b')).toEqual(new Set());

      testGraph.addEdge('a', 'b');

      expect(testGraph.nodes.get('a')).toEqual(new Set(['b']));
      expect(testGraph.nodes.get('b')).toEqual(new Set());
    });
  });

  describe('hasCircularDependency method tests', () => {
    beforeEach(() => {
      testGraph = newDependencyGraph();
    });

    it('finds circles where nodes reference themselves', () => {
      testGraph.addNode('a');
      testGraph.addEdge('a', 'a');

      const circleCheck = testGraph.hasCircularDependency();

      expect(circleCheck.isCircular).toBeTruthy();
      expect(circleCheck.node).toEqual('a');
    });

    it('finds circles one node away', () => {
      testGraph.addNode('a');
      testGraph.addNode('b');
      testGraph.addEdge('a', 'b');
      testGraph.addEdge('b', 'a');

      const circleCheck = testGraph.hasCircularDependency();

      expect(circleCheck.isCircular).toBeTruthy();
      expect(circleCheck.node).toEqual('a');
    });

    it('finds circles multiple nodes away', () => {
      testGraph.addNode('a');
      testGraph.addNode('b');
      testGraph.addNode('c');
      testGraph.addNode('d');
      testGraph.addEdge('a', 'b');
      testGraph.addEdge('b', 'c');
      testGraph.addEdge('c', 'd');
      testGraph.addEdge('d', 'a');

      const circleCheck = testGraph.hasCircularDependency();

      expect(circleCheck.isCircular).toBeTruthy();
      expect(circleCheck.node).toEqual('a');
    });

    it('does not find false positives', () => {
      testGraph.addNode('a');
      testGraph.addNode('b');
      testGraph.addNode('c');
      testGraph.addEdge('a', 'b');
      testGraph.addEdge('c', 'a');

      const circleCheck = testGraph.hasCircularDependency();

      expect(circleCheck.isCircular).toBeFalsy();
    });
  });
});
