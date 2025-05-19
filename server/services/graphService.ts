import { storage } from "../storage";

class GraphService {
  async getFullGraph() {
    const nodes = await storage.getKnowledgeGraphNodes();
    const edges = await storage.getKnowledgeGraphEdges();
    
    return { nodes, edges };
  }
  
  async getDocumentSubgraph(documentId: number) {
    const allNodes = await storage.getKnowledgeGraphNodes();
    const allEdges = await storage.getKnowledgeGraphEdges();
    
    // Get document node
    const documentNode = allNodes.find(node => node.id === `doc_${documentId}`);
    
    if (!documentNode) {
      return { nodes: [], edges: [] };
    }
    
    // Find all nodes connected (directly or indirectly) to the document
    const connectedNodeIds = new Set<string>([documentNode.id]);
    const nodesToProcess = [documentNode.id];
    
    // Breadth-first traversal to find all connected nodes
    while (nodesToProcess.length > 0) {
      const nodeId = nodesToProcess.shift()!;
      
      // Find all edges connected to this node
      const connectedEdges = allEdges.filter(
        edge => edge.source === nodeId || edge.target === nodeId
      );
      
      for (const edge of connectedEdges) {
        const connectedNodeId = edge.source === nodeId ? edge.target : edge.source;
        
        // If we haven't processed this node yet, add it to the queue
        if (!connectedNodeIds.has(connectedNodeId)) {
          connectedNodeIds.add(connectedNodeId);
          nodesToProcess.push(connectedNodeId);
        }
      }
    }
    
    // Filter nodes and edges to only include those in the connected subgraph
    const nodes = allNodes.filter(node => connectedNodeIds.has(node.id));
    const edges = allEdges.filter(
      edge => connectedNodeIds.has(edge.source) && connectedNodeIds.has(edge.target)
    );
    
    return { nodes, edges };
  }
  
  async findPathBetweenDocuments(sourceId: number, targetId: number) {
    const allNodes = await storage.getKnowledgeGraphNodes();
    const allEdges = await storage.getKnowledgeGraphEdges();
    
    const sourceNodeId = `doc_${sourceId}`;
    const targetNodeId = `doc_${targetId}`;
    
    // Breadth-first search to find shortest path
    const queue = [{ id: sourceNodeId, path: [sourceNodeId] }];
    const visited = new Set<string>([sourceNodeId]);
    
    while (queue.length > 0) {
      const { id, path } = queue.shift()!;
      
      // If we've reached the target, return the path
      if (id === targetNodeId) {
        // Build result with full node and edge information
        const pathNodes = path.map(
          nodeId => allNodes.find(node => node.id === nodeId)!
        );
        
        const pathEdges = [];
        for (let i = 0; i < path.length - 1; i++) {
          const edge = allEdges.find(
            e => (e.source === path[i] && e.target === path[i+1]) ||
                 (e.source === path[i+1] && e.target === path[i])
          );
          
          if (edge) {
            pathEdges.push(edge);
          }
        }
        
        return { nodes: pathNodes, edges: pathEdges };
      }
      
      // Find all connected nodes
      const connectedEdges = allEdges.filter(
        edge => edge.source === id || edge.target === id
      );
      
      for (const edge of connectedEdges) {
        const nextId = edge.source === id ? edge.target : edge.source;
        
        if (!visited.has(nextId)) {
          visited.add(nextId);
          queue.push({ id: nextId, path: [...path, nextId] });
        }
      }
    }
    
    // No path found
    return { nodes: [], edges: [] };
  }
}

export const graphService = new GraphService();
