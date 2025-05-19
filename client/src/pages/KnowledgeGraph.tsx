import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document, KnowledgeGraph as KnowledgeGraphType } from "@/types";

const KnowledgeGraph: React.FC = () => {
  const graphContainer = useRef<HTMLDivElement>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [graphView, setGraphView] = useState<"full" | "document">("full");
  const [zoomLevel, setZoomLevel] = useState([50]); // Default zoom level
  const [graphStats, setGraphStats] = useState({
    nodeCount: 0,
    edgeCount: 0,
    documentCount: 0,
    termCount: 0,
    entityCount: 0,
  });

  const { data: documents } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const { data: graph, isLoading } = useQuery<KnowledgeGraphType>({
    queryKey: ["/api/graph"],
  });

  const { data: documentGraph } = useQuery<KnowledgeGraphType>({
    queryKey: [`/api/documents/${selectedDocumentId}/graph`],
    enabled: !!selectedDocumentId && graphView === "document",
  });

  const activeGraph = graphView === "full" ? graph : documentGraph;

  useEffect(() => {
    if (activeGraph && graphContainer.current) {
      // In a real implementation, this would use D3.js or Cytoscape.js to render the graph
      // For now, just update the stats
      setGraphStats({
        nodeCount: activeGraph.nodes?.length || 0,
        edgeCount: activeGraph.edges?.length || 0,
        documentCount: activeGraph.nodes?.filter(n => n.type === "document")?.length || 0,
        termCount: activeGraph.nodes?.filter(n => n.type === "term")?.length || 0,
        entityCount: activeGraph.nodes?.filter(n => n.type === "entity" || n.type === "article")?.length || 0,
      });
    }
  }, [activeGraph, graphContainer]);

  const handleDocumentSelect = (value: string) => {
    setSelectedDocumentId(parseInt(value));
    setGraphView("document");
  };

  const handleViewToggle = (view: "full" | "document") => {
    setGraphView(view);
    if (view === "full") {
      setSelectedDocumentId(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Knowledge Graph</h1>
        <div className="flex space-x-4">
          <Select
            value={selectedDocumentId?.toString() || ""}
            onValueChange={handleDocumentSelect}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filter by document" />
            </SelectTrigger>
            <SelectContent>
              {documents?.map((document) => (
                <SelectItem key={document.id} value={document.id.toString()}>
                  {document.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={graphView === "full" ? "default" : "outline"}
            onClick={() => handleViewToggle("full")}
          >
            <i className="fas fa-diagram-project mr-2"></i>
            Full Graph
          </Button>
          <Button
            variant={graphView === "document" ? "default" : "outline"}
            onClick={() => handleViewToggle("document")}
            disabled={!selectedDocumentId}
          >
            <i className="fas fa-file-lines mr-2"></i>
            Document View
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Card className="h-[calc(100vh-16rem)]">
            <CardHeader className="border-b p-4">
              <div className="flex justify-between items-center">
                <CardTitle>
                  {graphView === "document" && selectedDocumentId
                    ? documents?.find(d => d.id === selectedDocumentId)?.title
                    : "Full Legislative Knowledge Graph"}
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="zoom" className="text-sm">Zoom:</Label>
                    <Slider
                      id="zoom"
                      className="w-32"
                      value={zoomLevel}
                      onValueChange={setZoomLevel}
                      min={10}
                      max={100}
                      step={1}
                    />
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <i className="fas fa-plus"></i>
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <i className="fas fa-minus"></i>
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <i className="fas fa-expand"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden h-full">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4">
                      <i className="fas fa-spinner fa-spin text-4xl text-primary"></i>
                    </div>
                    <p>Loading knowledge graph data...</p>
                  </div>
                </div>
              ) : (
                <div
                  ref={graphContainer}
                  className="w-full h-full bg-neutral-50 relative"
                >
                  {/* This would be replaced with a proper D3.js or Cytoscape.js graph */}
                  <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                    <div>
                      <h3 className="text-xl font-medium text-neutral-500 mb-2">Knowledge Graph Visualization</h3>
                      <p className="text-neutral-400 mb-4">
                        This interactive graph shows relationships between {graphStats.documentCount} documents, {graphStats.termCount} legal terms,
                        and {graphStats.entityCount} entities with {graphStats.edgeCount} connections.
                      </p>
                      <div className="p-4 bg-white rounded-lg shadow-lg inline-block mb-6">
                        <div className="flex space-x-4 mb-4">
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-primary rounded-full mr-2"></div>
                            <span className="text-sm">Document</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-secondary rounded-full mr-2"></div>
                            <span className="text-sm">Term</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-accent rounded-full mr-2"></div>
                            <span className="text-sm">Entity</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <i className="fas fa-diagram-project text-6xl text-neutral-200"></i>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-400">
                        Graph visualization would be implemented with D3.js or Cytoscape.js<br />
                        in a real application to show interactive network relationships.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader className="border-b p-4 pb-3">
              <CardTitle>Graph Statistics</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Documents:</span>
                  <span className="font-semibold">{graphStats.documentCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Legal Terms:</span>
                  <span className="font-semibold">{graphStats.termCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Legal Entities:</span>
                  <span className="font-semibold">{graphStats.entityCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Nodes:</span>
                  <span className="font-semibold">{graphStats.nodeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Connections:</span>
                  <span className="font-semibold">{graphStats.edgeCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="border-b p-4 pb-3">
              <CardTitle>Entity Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Tabs defaultValue="entities">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="entities">Entities</TabsTrigger>
                  <TabsTrigger value="terms">Terms</TabsTrigger>
                  <TabsTrigger value="relations">Relations</TabsTrigger>
                </TabsList>
                <TabsContent value="entities" className="mt-4">
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    <div className="p-3 border rounded-md">
                      <div className="font-medium">Digital Asset</div>
                      <div className="text-sm text-neutral-500">Referenced in 3 documents</div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="font-medium">Blockchain</div>
                      <div className="text-sm text-neutral-500">Referenced in 5 documents</div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="font-medium">Smart Contract</div>
                      <div className="text-sm text-neutral-500">Referenced in 2 documents</div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="terms" className="mt-4">
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    <div className="p-3 border rounded-md">
                      <div className="font-medium">Digital Financial Assets</div>
                      <div className="text-sm text-neutral-500">Legal term with 2 definitions</div>
                      <div className="text-xs text-red-500 mt-1">Conflict detected</div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="font-medium">Digital Utility Assets</div>
                      <div className="text-sm text-neutral-500">Legal term with 1 definition</div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="relations" className="mt-4">
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    <div className="p-3 border rounded-md">
                      <div className="font-medium">Banking Law → Digital Assets Law</div>
                      <div className="text-sm text-neutral-500">Referenced by Article 15.3</div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="font-medium">Smart Contract → Civil Code</div>
                      <div className="text-sm text-neutral-500">Referenced by Article 47</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default KnowledgeGraph;
