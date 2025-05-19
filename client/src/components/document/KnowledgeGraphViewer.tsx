import React, { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { KnowledgeGraph } from "@/types";

interface KnowledgeGraphViewerProps {
  documentId: number;
}

const KnowledgeGraphViewer: React.FC<KnowledgeGraphViewerProps> = ({ documentId }) => {
  const graphContainer = useRef<HTMLDivElement>(null);
  
  const { data: graph, isLoading } = useQuery<KnowledgeGraph>({
    queryKey: [`/api/documents/${documentId}/graph`],
  });

  useEffect(() => {
    if (graph && graphContainer.current) {
      // In a real implementation, this would use D3.js or Cytoscape.js to render the graph
      // For now, we'll just render a placeholder
    }
  }, [graph, graphContainer]);

  return (
    <Card>
      <CardHeader className="border-b p-4 flex justify-between items-center">
        <CardTitle className="text-lg font-semibold">Knowledge Graph</CardTitle>
        <Link href="/knowledge-graph">
          <Button variant="link" size="sm" className="text-sm text-primary">
            Expand View
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-4 h-64 bg-neutral-50 flex items-center justify-center">
        {isLoading ? (
          <Skeleton className="w-full h-full rounded-md" />
        ) : (
          <div ref={graphContainer} className="w-full h-full relative">
            {/* This would be replaced with a proper D3.js or Cytoscape.js graph */}
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div>
                <p className="text-lg font-medium text-neutral-500">Interactive Knowledge Graph</p>
                <p className="text-sm text-neutral-400">Showing relationships between legislative entities</p>
                <Link href={`/knowledge-graph/${documentId}`}>
                  <Button className="mt-3 bg-primary text-white">
                    Explore Connections
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KnowledgeGraphViewer;
