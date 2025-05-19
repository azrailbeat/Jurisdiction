import React, { useRef, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import * as d3 from 'd3';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

// Mock data for the knowledge graph
const MOCK_NODES = [
  { id: 'doc1', label: 'Civil Code of Kazakhstan', type: 'document' },
  { id: 'doc2', label: 'Criminal Code of Kazakhstan', type: 'document' },
  { id: 'term1', label: 'Digital Financial Assets', type: 'term' },
  { id: 'term2', label: 'Digital Utility Assets', type: 'term' },
  { id: 'entity1', label: 'National Bank', type: 'entity' },
  { id: 'entity2', label: 'Ministry of Finance', type: 'entity' },
];

const MOCK_EDGES = [
  { id: 'e1', source: 'doc1', target: 'term1', label: 'defines' },
  { id: 'e2', source: 'doc1', target: 'term2', label: 'references' },
  { id: 'e3', source: 'doc2', target: 'term1', label: 'references' },
  { id: 'e4', source: 'entity1', target: 'term1', label: 'regulates' },
  { id: 'e5', source: 'entity2', target: 'doc1', label: 'administers' },
  { id: 'e6', source: 'entity2', target: 'doc2', label: 'administers' },
];

// Node type colors
const NODE_COLORS = {
  document: '#3B82F6',  // blue
  term: '#F59E0B',     // amber
  entity: '#10B981',   // green
};

interface Node {
  id: string;
  label: string;
  type: string;
  properties?: Record<string, any>;
  x?: number;
  y?: number;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  label: string;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

interface Connection {
  direction: 'incoming' | 'outgoing';
  source: string;
  target: string;
  relation: string;
  nodeId: string;
  nodeLabel: string;
  nodeType: string;
}

const KnowledgeGraphPage: React.FC = () => {
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [, navigate] = useLocation();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'full' | 'document'>('full');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeConnections, setNodeConnections] = useState<Connection[]>([]);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  
  // Fetch graph data
  const { data: apiGraphData, isLoading: isLoadingGraph } = useQuery<GraphData>({
    queryKey: viewMode === 'full' 
      ? ['/api/graph'] 
      : ['/api/documents', selectedDocumentId, 'graph'],
    enabled: viewMode === 'full' || selectedDocumentId !== 'all',
  });

  // Fetch documents for the dropdown
  const { data: documents, isLoading: isLoadingDocuments } = useQuery<any[]>({
    queryKey: ['/api/documents'],
  });

  // Update graph data when the API response or mock data changes
  useEffect(() => {
    if (apiGraphData && apiGraphData.nodes.length > 0) {
      setGraphData(apiGraphData);
    } else {
      // Use mock data if the API doesn't return anything
      setGraphData({
        nodes: MOCK_NODES,
        edges: MOCK_EDGES
      });
    }
  }, [apiGraphData]);

  // Handle document selection change
  const handleDocumentChange = (docId: string) => {
    setSelectedDocumentId(docId);
    if (docId !== 'all') {
      setViewMode('document');
    } else {
      setViewMode('full');
    }
  };

  // Handle node click
  const handleNodeClick = (node: Node | null) => {
    setSelectedNode(node);
    
    if (node) {
      // Find all connections for this node
      const connections: Connection[] = [];
      
      // Outgoing connections
      graphData.edges
        .filter(edge => edge.source === node.id)
        .forEach(edge => {
          const targetNode = graphData.nodes.find(n => n.id === edge.target);
          if (targetNode) {
            connections.push({
              direction: 'outgoing',
              source: edge.source,
              target: edge.target,
              relation: edge.label,
              nodeId: targetNode.id,
              nodeLabel: targetNode.label,
              nodeType: targetNode.type,
            });
          }
        });
      
      // Incoming connections
      graphData.edges
        .filter(edge => edge.target === node.id)
        .forEach(edge => {
          const sourceNode = graphData.nodes.find(n => n.id === edge.source);
          if (sourceNode) {
            connections.push({
              direction: 'incoming',
              source: edge.source,
              target: edge.target,
              relation: edge.label,
              nodeId: sourceNode.id,
              nodeLabel: sourceNode.label,
              nodeType: sourceNode.type,
            });
          }
        });
      
      setNodeConnections(connections);
    } else {
      setNodeConnections([]);
    }
  };

  // Navigate to document page
  const navigateToDocument = (node: Node) => {
    if (node.type === 'document') {
      navigate(`/documents/${node.id}`);
    }
  };

  // Reset the view
  const resetView = () => {
    if (svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(750)
        .call(
          d3.zoom().transform as any,
          d3.zoomIdentity
        );
    }
    setZoomLevel(1);
  };

  // D3 force simulation
  useEffect(() => {
    if (!svgRef.current || !graphContainerRef.current || graphData.nodes.length === 0) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    const width = graphContainerRef.current.clientWidth;
    const height = graphContainerRef.current.clientHeight;
    
    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    const svg = d3.select(svgRef.current)
      .call(zoom as any);
    
    const g = svg.append('g');
    svg.call((zoom as any).transform, d3.zoomIdentity.scale(zoomLevel));

    // Create links
    const links = g.append('g')
      .attr('class', 'links')
      .selectAll('g')
      .data(graphData.edges)
      .enter()
      .append('g');
    
    // Draw link lines
    links.append('line')
      .attr('stroke', '#CCCCCC')
      .attr('stroke-width', 1.5);

    // Add link labels
    links.append('text')
      .attr('font-size', '10px')
      .attr('text-anchor', 'middle')
      .attr('dy', '-5')
      .attr('fill', '#666666')
      .text(d => d.label);
    
    // Create nodes
    const nodes = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graphData.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        handleNodeClick(d);
      });

    // Add node circles
    nodes.append('circle')
      .attr('r', 20)
      .attr('fill', (d: Node) => NODE_COLORS[d.type as keyof typeof NODE_COLORS] || '#999999')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2);

    // Add node icons
    nodes.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('font-family', 'FontAwesome')
      .text((d: Node) => {
        switch (d.type) {
          case 'document': return '\uf15c'; // file icon
          case 'term': return '\uf02d'; // book icon
          case 'entity': return '\uf1ad'; // building icon
          default: return '\uf111'; // circle icon
        }
      });

    // Add node labels
    nodes.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 35)
      .attr('fill', '#333333')
      .attr('font-size', '12px')
      .text((d: Node) => d.label.length > 20 ? d.label.substring(0, 20) + '...' : d.label);

    // Setup force simulation
    const simulation = d3.forceSimulation(graphData.nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(graphData.edges)
        .id((d: any) => d.id)
        .distance(150))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Update positions on each tick
    simulation.on('tick', () => {
      links.selectAll('line')
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
        
      links.selectAll('text')
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

      nodes.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
    });

    // Drag behavior
    const drag = d3.drag<SVGGElement, Node>()
      .on('start', (event, d: any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d: any) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d: any) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodes.call(drag as any);

    return () => {
      simulation.stop();
    };
  }, [graphData, zoomLevel]);

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Graph</h1>
          <p className="text-neutral-500 mt-1">
            Visualize relationships between documents, terms, and entities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={selectedDocumentId}
            onValueChange={handleDocumentChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Documents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Documents</SelectItem>
              {documents && documents.map((doc: any) => (
                <SelectItem key={doc.id} value={doc.id.toString()}>{doc.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            size="sm" 
            className={viewMode === 'full' ? 'bg-neutral-100' : ''}
            onClick={() => setViewMode('full')}
          >
            <i className="fas fa-project-diagram mr-2"></i>
            Full Graph
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={viewMode === 'document' ? 'bg-neutral-100' : ''}
            disabled={selectedDocumentId === 'all'}
            onClick={() => setViewMode('document')}
          >
            <i className="fas fa-file-lines mr-2"></i>
            Document View
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Graph visualization */}
        <div className="flex-1 bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden h-full">
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold">Knowledge Graph Visualization</h2>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-neutral-500">Zoom:</span>
              <div className="w-32">
                <Slider
                  value={[zoomLevel * 100]}
                  min={10}
                  max={200}
                  step={10}
                  onValueChange={(value) => setZoomLevel(value[0] / 100)}
                />
              </div>
              <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 2))} disabled={zoomLevel >= 2}>
                <i className="fas fa-plus text-xs"></i>
              </Button>
              <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.1))} disabled={zoomLevel <= 0.1}>
                <i className="fas fa-minus text-xs"></i>
              </Button>
              <Button variant="outline" size="icon" onClick={resetView}>
                <i className="fas fa-maximize text-xs"></i>
              </Button>
            </div>
          </div>
          
          <div 
            ref={graphContainerRef} 
            className="w-full h-[calc(100%-60px)] overflow-hidden relative"
          >
            <svg ref={svgRef} width="100%" height="100%"></svg>
            
            {graphData.nodes.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
                <i className="fas fa-project-diagram text-5xl mb-4"></i>
                <p className="text-lg font-medium mb-2">No graph data available</p>
                <p className="text-sm text-center max-w-md">
                  Add documents and terms to build the knowledge graph
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Details panel */}
        <div className="w-80 h-full space-y-4 flex flex-col">
          {/* Graph Statistics */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle>Graph Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Documents:</span>
                <span className="font-medium">{graphData.nodes.filter(n => n.type === 'document').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Legal Terms:</span>
                <span className="font-medium">{graphData.nodes.filter(n => n.type === 'term').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Legal Entities:</span>
                <span className="font-medium">{graphData.nodes.filter(n => n.type === 'entity').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Total Nodes:</span>
                <span className="font-medium">{graphData.nodes.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Total Connections:</span>
                <span className="font-medium">{graphData.edges.length}</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Entity Information */}
          <Card className="flex-1">
            <CardHeader className="py-3">
              <CardTitle>Entity Information</CardTitle>
              {!selectedNode ? (
                <CardDescription>
                  Select an entity in the graph to view details
                </CardDescription>
              ) : (
                <CardDescription>
                  Details for <span className="font-medium">{selectedNode.label}</span>
                </CardDescription>
              )}
            </CardHeader>
            
            <CardContent className="pb-4 pt-0">
              {selectedNode ? (
                <div className="space-y-4">
                  {/* Node type */}
                  <div>
                    <h3 className="text-sm font-medium mb-1">Type</h3>
                    <div className="flex items-center">
                      <Badge 
                        className={
                          selectedNode.type === 'document' ? 'bg-blue-500' : 
                          selectedNode.type === 'term' ? 'bg-amber-500' : 
                          selectedNode.type === 'entity' ? 'bg-emerald-500' : 
                          'bg-neutral-500'
                        }
                      >
                        {selectedNode.type === 'document' ? 'Document' : 
                         selectedNode.type === 'term' ? 'Legal Term' : 
                         selectedNode.type === 'entity' ? 'Entity' : 
                         selectedNode.type}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Properties */}
                  {selectedNode.properties && Object.keys(selectedNode.properties).length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-1">Properties</h3>
                      <div className="space-y-2">
                        {Object.entries(selectedNode.properties).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-sm text-neutral-500">{key}</span>
                            <span className="text-sm font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Node connections */}
                  <div>
                    <h3 className="text-sm font-medium mb-1">Connections</h3>
                    <div className="space-y-2">
                      {nodeConnections.map((conn, i) => (
                        <div 
                          key={i} 
                          className="text-sm p-2 rounded bg-neutral-50 hover:bg-neutral-100 cursor-pointer"
                          onClick={() => handleNodeClick(
                            graphData.nodes.find(n => n.id === (conn.direction === 'outgoing' ? conn.target : conn.source)) || null
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">
                              {conn.direction === 'outgoing' ? 'To' : 'From'}: {conn.nodeLabel}
                            </span>
                            <Badge variant="outline" className="text-xs h-5">
                              {conn.nodeType}
                            </Badge>
                          </div>
                          <div className="text-neutral-500 flex items-center">
                            <i className={`fas fa-${conn.direction === 'outgoing' ? 'arrow-right' : 'arrow-left'} mr-1 text-xs`}></i>
                            {conn.relation}
                          </div>
                        </div>
                      ))}
                      
                      {nodeConnections.length === 0 && (
                        <div className="text-sm text-neutral-500 italic">No connections found</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  {selectedNode.type === 'document' && (
                    <div className="pt-2">
                      <Button className="w-full" onClick={() => navigateToDocument(selectedNode)}>
                        <i className="fas fa-file-lines mr-2"></i>
                        View Document
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-neutral-400">
                  <i className="fas fa-circle-info text-4xl mb-4"></i>
                  <p className="text-center">
                    Select an entity in the graph to view its details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Network Analysis */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle>Network Analysis</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-3">
              <Tabs defaultValue="entities">
                <TabsList className="w-full mb-3">
                  <TabsTrigger value="entities" className="flex-1">Entities</TabsTrigger>
                  <TabsTrigger value="terms" className="flex-1">Terms</TabsTrigger>
                  <TabsTrigger value="relations" className="flex-1">Relations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="entities" className="space-y-3">
                  {graphData.nodes.filter(n => n.type === 'entity').length > 0 ? 
                    graphData.nodes
                      .filter(n => n.type === 'entity')
                      .slice(0, 5)
                      .map(entity => (
                        <div 
                          key={entity.id} 
                          className="text-sm p-2 rounded bg-neutral-50 hover:bg-neutral-100 cursor-pointer"
                          onClick={() => handleNodeClick(entity)}
                        >
                          <div className="font-medium">{entity.label}</div>
                        </div>
                      ))
                    : 
                    <div className="text-sm text-neutral-500 italic text-center py-2">
                      No entities found
                    </div>
                  }
                </TabsContent>
                
                <TabsContent value="terms" className="space-y-3">
                  {graphData.nodes.filter(n => n.type === 'term').length > 0 ? 
                    graphData.nodes
                      .filter(n => n.type === 'term')
                      .slice(0, 5)
                      .map(term => (
                        <div 
                          key={term.id} 
                          className="text-sm p-2 rounded bg-neutral-50 hover:bg-neutral-100 cursor-pointer"
                          onClick={() => handleNodeClick(term)}
                        >
                          <div className="font-medium">{term.label}</div>
                        </div>
                      ))
                    : 
                    <div className="text-sm text-neutral-500 italic text-center py-2">
                      No legal terms found
                    </div>
                  }
                </TabsContent>
                
                <TabsContent value="relations" className="space-y-3">
                  {graphData.edges.length > 0 ? 
                    Array.from(new Set(graphData.edges.map(e => e.label)))
                      .slice(0, 5)
                      .map((relation, idx) => (
                        <div key={idx} className="text-sm p-2 rounded bg-neutral-50">
                          <div className="font-medium">{relation}</div>
                          <div className="text-xs text-neutral-500 mt-1">
                            {graphData.edges.filter(e => e.label === relation).length} connections
                          </div>
                        </div>
                      ))
                    : 
                    <div className="text-sm text-neutral-500 italic text-center py-2">
                      No relations found
                    </div>
                  }
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraphPage;