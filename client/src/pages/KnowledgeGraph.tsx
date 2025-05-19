import React, { useRef, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import * as d3 from 'd3';

// UI Components
import {
  Card,
  CardContent,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

// Sample term definitions
const TERM_DEFINITIONS = {
  'Digital Financial Assets': 'Digital assets that represent monetary value and can be traded, including cryptocurrencies and tokenized securities.',
  'Digital Utility Assets': 'Digital assets that provide access to goods or services but are not designed primarily as investments.'
};

// Node type colors
const NODE_COLORS = {
  document: '#3B82F6',  // blue
  term: '#10B981',  // green
  entity: '#8B5CF6',  // purple
};

interface Node {
  id: string;
  label: string;
  type: string;
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

const KnowledgeGraphPage: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [, navigate] = useLocation();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'full' | 'document'>('full');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [selectedEntity, setSelectedEntity] = useState<Node | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch graph data
  const { data, isLoading: isLoadingGraph } = useQuery<GraphData>({
    queryKey: viewMode === 'full' ? ['/api/graph'] : [`/api/documents/${selectedDocumentId}/graph`],
    enabled: viewMode === 'full' || !!selectedDocumentId,
  });

  // Fetch documents for the dropdown
  const { data: documents, isLoading: isLoadingDocuments } = useQuery<any[]>({
    queryKey: ['/api/documents'],
  });

  // Update graph data when the API response or mock data changes
  useEffect(() => {
    if (data) {
      setGraphData(data);
    } else {
      // Use mock data if the API doesn't return anything
      setGraphData({
        nodes: MOCK_NODES,
        edges: MOCK_EDGES
      });
    }
  }, [data]);

  // Filter graph based on search query
  useEffect(() => {
    if (searchQuery && graphData.nodes.length > 0) {
      const lowerQuery = searchQuery.toLowerCase();
      const filteredNodes = MOCK_NODES.filter(node => 
        node.label.toLowerCase().includes(lowerQuery)
      );
      
      const nodeIds = new Set(filteredNodes.map(node => node.id));
      
      const filteredEdges = MOCK_EDGES.filter(edge => 
        nodeIds.has(edge.source) && nodeIds.has(edge.target)
      );
      
      setGraphData({
        nodes: filteredNodes,
        edges: filteredEdges
      });
    } else {
      // If no search query, use original data
      if (data) {
        setGraphData(data);
      } else {
        setGraphData({
          nodes: MOCK_NODES,
          edges: MOCK_EDGES
        });
      }
    }
  }, [searchQuery, data]);

  // D3 force simulation
  useEffect(() => {
    if (!svgRef.current || graphData.nodes.length === 0) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    const svg = d3.select(svgRef.current)
      .call(zoom as any);
    
    const g = svg.append('g');

    // Apply zoom level
    const zoomScale = zoomLevel / 100;
    svg.call((zoom as any).scaleTo, zoomScale);
    
    // Create links
    const links = g.selectAll('.link')
      .data(graphData.edges)
      .enter()
      .append('g')
      .attr('class', 'link');
    
    // Draw link lines
    links.append('line')
      .attr('stroke', '#CCCCCC')
      .attr('stroke-width', 1);
      
    // Add link labels
    links.append('text')
      .attr('font-size', '10px')
      .attr('text-anchor', 'middle')
      .attr('dy', '-5')
      .attr('fill', '#666666')
      .text(d => d.label);
      
    // Create nodes
    const nodes = g.selectAll('.node')
      .data(graphData.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedEntity(d);
      });

    // Add node circles
    nodes.append('circle')
      .attr('r', 25)
      .attr('fill', (d: Node) => NODE_COLORS[d.type as keyof typeof NODE_COLORS] || '#999999')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2);

    // Add node icons
    nodes.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', 'white')
      .attr('font-size', '14px')
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
      .attr('y', 40)
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
      .force('collision', d3.forceCollide().radius(60));

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

  // Handle document selection change
  const handleDocumentChange = (docId: string) => {
    setSelectedDocumentId(docId);
    if (docId) {
      setViewMode('document');
    }
  };

  // Calculate graph statistics
  const graphStats = {
    documents: graphData.nodes.filter(n => n.type === 'document').length,
    terms: graphData.nodes.filter(n => n.type === 'term').length,
    entities: graphData.nodes.filter(n => n.type === 'entity').length,
    totalNodes: graphData.nodes.length,
    totalConnections: graphData.edges.length,
  };

  // Get entity information for the info panel
  const getEntityConnections = (nodeId: string) => {
    return graphData.edges.filter(e => e.source === nodeId || e.target === nodeId);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Graph</h1>
          <p className="text-neutral-500 mt-1">
            Visualize relationships between documents, terms, and entities
          </p>
        </div>

        <div className="flex gap-2">
          <Select
            value={selectedDocumentId}
            onValueChange={handleDocumentChange}
          >
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder="Criminal Code of Kazakhstan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Documents</SelectItem>
              {documents && documents.map(doc => (
                <SelectItem key={doc.id} value={doc.id.toString()}>{doc.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
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
              disabled={!selectedDocumentId}
              onClick={() => setViewMode('document')}
            >
              <i className="fas fa-file-lines mr-2"></i>
              Document View
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Graph visualization */}
        <Card className="flex-1 overflow-hidden">
          <CardHeader className="pb-2 border-b">
            <div className="flex flex-wrap justify-between items-center">
              <CardTitle>{viewMode === 'document' && selectedDocumentId ? documents?.find(d => d.id.toString() === selectedDocumentId)?.title || 'Document View' : 'Knowledge Graph Visualization'}</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500">Zoom:</span>
                  <Slider
                    value={[zoomLevel]}
                    min={10}
                    max={200}
                    step={10}
                    className="w-32"
                    onValueChange={(value) => setZoomLevel(value[0])}
                  />
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.min(zoomLevel + 10, 200))}>
                    <i className="fas fa-plus"></i>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.max(zoomLevel - 10, 10))}>
                    <i className="fas fa-minus"></i>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setZoomLevel(100)}>
                    <i className="fas fa-expand"></i>
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-57px)] relative">
            {isLoadingGraph ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : graphData.nodes.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
                <div className="text-5xl mb-4">
                  <i className="fas fa-diagram-project"></i>
                </div>
                <p className="text-lg">No graph data available</p>
                <p className="text-sm mt-2">
                  {searchQuery ? 'Try adjusting your search query' : 'Add documents and terms to build the knowledge graph'}
                </p>
              </div>
            ) : (
              <>
                <svg ref={svgRef} width="100%" height="100%"></svg>
                <div className="absolute bottom-4 left-4 flex gap-3">
                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: NODE_COLORS.document }}></div>
                    <span className="text-xs">Document</span>
                  </div>
                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: NODE_COLORS.term }}></div>
                    <span className="text-xs">Term</span>
                  </div>
                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: NODE_COLORS.entity }}></div>
                    <span className="text-xs">Entity</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Right sidebar with graph stats and entity info */}
        <div className="w-80 flex flex-col gap-4 overflow-auto">
          {/* Stats card */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Graph Statistics</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Documents:</span>
                  <span className="font-medium">{graphStats.documents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Legal Terms:</span>
                  <span className="font-medium">{graphStats.terms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Legal Entities:</span>
                  <span className="font-medium">{graphStats.entities}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total Nodes:</span>
                  <span className="font-medium">{graphStats.totalNodes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total Connections:</span>
                  <span className="font-medium">{graphStats.totalConnections}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Entity information */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Entity Information</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              {selectedEntity ? (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-3" style={{ backgroundColor: NODE_COLORS[selectedEntity.type as keyof typeof NODE_COLORS] }}>
                      <i className={`fas ${
                        selectedEntity.type === 'document' ? 'fa-file-lines' : 
                        selectedEntity.type === 'term' ? 'fa-book' : 
                        'fa-building'
                      }`}></i>
                    </div>
                    <div>
                      <div className="font-medium">{selectedEntity.label}</div>
                      <div className="text-xs text-neutral-500 capitalize">{selectedEntity.type}</div>
                    </div>
                  </div>

                  {selectedEntity.type === 'term' && TERM_DEFINITIONS[selectedEntity.label as keyof typeof TERM_DEFINITIONS] && (
                    <div className="bg-neutral-50 p-3 rounded-md text-sm">
                      <span className="font-medium">Definition: </span>
                      {TERM_DEFINITIONS[selectedEntity.label as keyof typeof TERM_DEFINITIONS]}
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium mb-2">Relationships</h4>
                    <div className="space-y-2">
                      {getEntityConnections(selectedEntity.id).map(edge => {
                        const isSource = edge.source === selectedEntity.id;
                        const connectedNodeId = isSource ? edge.target : edge.source;
                        const connectedNode = graphData.nodes.find(n => n.id === connectedNodeId);
                        
                        return connectedNode ? (
                          <div key={edge.id} className="flex items-center text-sm">
                            {!isSource && (
                              <>
                                <Badge variant="outline" className="mr-2">{connectedNode.label}</Badge>
                                <span className="text-neutral-500 mx-1">{edge.label}</span>
                                <i className="fas fa-arrow-right mx-1 text-neutral-400"></i>
                              </>
                            )}
                            {isSource && (
                              <>
                                <i className="fas fa-arrow-right mx-1 text-neutral-400"></i>
                                <span className="text-neutral-500 mx-1">{edge.label}</span>
                                <Badge variant="outline" className="ml-2">{connectedNode.label}</Badge>
                              </>
                            )}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-neutral-400">
                  <i className="fas fa-info-circle text-3xl mb-2"></i>
                  <p className="text-center">Select an entity in the graph to view details</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Terms table */}
          <Card>
            <Tabs defaultValue="entities">
              <CardHeader className="py-3 pb-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Network Analysis</CardTitle>
                  <TabsList>
                    <TabsTrigger value="entities">Entities</TabsTrigger>
                    <TabsTrigger value="terms">Terms</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pb-4">
                <TabsContent value="terms" className="mt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Terms</TableHead>
                        <TableHead>Relations</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {graphData.nodes
                        .filter(node => node.type === 'term')
                        .map(term => (
                          <TableRow 
                            key={term.id} 
                            className="cursor-pointer hover:bg-neutral-50"
                            onClick={() => setSelectedEntity(term)}
                          >
                            <TableCell className="font-medium">{term.label}</TableCell>
                            <TableCell>
                              {getEntityConnections(term.id).length}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="entities" className="mt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Entities</TableHead>
                        <TableHead>Relations</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {graphData.nodes
                        .filter(node => node.type === 'entity')
                        .map(entity => (
                          <TableRow 
                            key={entity.id} 
                            className="cursor-pointer hover:bg-neutral-50"
                            onClick={() => setSelectedEntity(entity)}
                          >
                            <TableCell className="font-medium">{entity.label}</TableCell>
                            <TableCell>
                              {getEntityConnections(entity.id).length}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraphPage;