import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document, DocumentVersion } from "@/types";
import { formatDistance } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SemanticComparisonResult {
  overview: {
    similarityScore: number;
    addedSections: number;
    removedSections: number;
    modifiedSections: number;
  };
  changes: Array<{
    type: 'addition' | 'removal' | 'modification';
    location: string;
    path: string[];
    sourceContent?: string;
    targetContent?: string;
    severity: 'critical' | 'major' | 'minor' | 'info';
    impact: 'high' | 'medium' | 'low';
    category: string;
    description: string;
    contextBefore?: string;
    contextAfter?: string;
  }>;
  semanticAnalysis: {
    obligations: Array<{
      type: 'obligation';
      subject: string;
      action: string;
      object?: string;
      condition?: string;
      sourceLocation?: string;
      targetLocation?: string;
      changeType?: 'added' | 'removed' | 'modified';
      description: string;
    }>;
    rights: any[];
    permissions: any[];
    prohibitions: any[];
    definitions: Array<{
      term: string;
      sourceDefinition?: string;
      targetDefinition?: string;
      changeType: 'added' | 'removed' | 'modified';
      similarityScore?: number;
    }>;
    references: Array<{
      sourceRef?: string;
      targetRef?: string;
      changeType: 'added' | 'removed' | 'modified' | 'broken';
      description: string;
    }>;
  };
  metadata: {
    sourceId: number;
    targetId: number;
    sourceVersion: string;
    targetVersion: string;
    comparisonDate: string;
  };
}

const Versions: React.FC = () => {
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState<{
    source: string;
    target: string;
  }>({
    source: "",
    target: "",
  });
  const [comparisonResult, setComparisonResult] = useState<SemanticComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonError, setComparisonError] = useState<string | null>(null);

  const { data: documents, isLoading: isLoadingDocuments } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const { data: versions, isLoading: isLoadingVersions } = useQuery<DocumentVersion[]>({
    queryKey: [`/api/documents/${selectedDocumentId}/versions`],
    enabled: !!selectedDocumentId,
  });

  const selectedDocument = selectedDocumentId
    ? documents?.find((doc) => doc.id === selectedDocumentId)
    : null;

  const handleDocumentSelect = (value: string) => {
    setSelectedDocumentId(parseInt(value));
    setCompareMode(false);
    setCompareVersions({ source: "", target: "" });
    setComparisonResult(null);
    setComparisonError(null);
  };

  const formatDate = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };

  const handleCompare = async () => {
    if (!selectedDocumentId || !compareVersions.source || !compareVersions.target) {
      return;
    }

    setIsComparing(true);
    setComparisonError(null);
    
    try {
      const response = await axios.post(`/api/documents/${selectedDocumentId}/versions/semantic-compare`, {
        versionA: compareVersions.source,
        versionB: compareVersions.target
      });
      
      setComparisonResult(response.data);
    } catch (error) {
      console.error("Error comparing versions:", error);
      setComparisonError("Failed to perform semantic comparison. Please try again.");
      setComparisonResult(null);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Version Control</h1>
        <Button
          variant="outline"
          className="border-primary text-primary"
          onClick={() => setCompareMode(!compareMode)}
        >
          <i className={`fas fa-${compareMode ? 'timeline' : 'code-compare'} mr-2`}></i>
          {compareMode ? "View Timeline" : "Compare Versions"}
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select onValueChange={handleDocumentSelect}>
              <SelectTrigger className="w-[350px]">
                <SelectValue placeholder="Select a document to view versions" />
              </SelectTrigger>
              <SelectContent>
                {documents?.map((document) => (
                  <SelectItem key={document.id} value={document.id.toString()}>
                    {document.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDocument && (
              <Badge className="bg-secondary text-white">
                Current: v{selectedDocument.currentVersion}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedDocumentId && (
        <>
          {compareMode ? (
            <Card>
              <CardHeader>
                <CardTitle>Compare Versions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-4">
                    <div className="w-5/12">
                      <label className="block text-sm font-medium mb-2">Source Version</label>
                      <Select
                        value={compareVersions.source}
                        onValueChange={(value) => setCompareVersions({ ...compareVersions, source: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select source version" />
                        </SelectTrigger>
                        <SelectContent>
                          {versions?.map((version) => (
                            <SelectItem key={`source-${version.id}`} value={version.version}>
                              v{version.version} ({version.isCurrent ? "Current" : formatDate(version.createdAt)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-center w-2/12">
                      <i className="fas fa-arrow-right text-xl text-neutral-500"></i>
                    </div>
                    <div className="w-5/12">
                      <label className="block text-sm font-medium mb-2">Target Version</label>
                      <Select
                        value={compareVersions.target}
                        onValueChange={(value) => setCompareVersions({ ...compareVersions, target: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select target version" />
                        </SelectTrigger>
                        <SelectContent>
                          {versions?.map((version) => (
                            <SelectItem key={`target-${version.id}`} value={version.version}>
                              v{version.version} ({version.isCurrent ? "Current" : formatDate(version.createdAt)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleCompare}
                      disabled={!compareVersions.source || !compareVersions.target}
                    >
                      Compare Versions
                    </Button>
                  </div>

                  {compareVersions.source && compareVersions.target ? (
                    <>
                      {isComparing ? (
                        <div className="p-12 flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                          <p className="text-neutral-600">Analyzing semantic differences...</p>
                        </div>
                      ) : comparisonError ? (
                        <Alert variant="destructive" className="mb-4">
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{comparisonError}</AlertDescription>
                        </Alert>
                      ) : (
                        <Tabs defaultValue="standard">
                          <TabsList className="grid w-full max-w-xl grid-cols-5">
                            <TabsTrigger value="standard">Standard</TabsTrigger>
                            <TabsTrigger value="semantic">Semantic</TabsTrigger>
                            <TabsTrigger value="deontic">Deontic Logic</TabsTrigger>
                            <TabsTrigger value="definitions">Definitions</TabsTrigger>
                            <TabsTrigger value="references">References</TabsTrigger>
                          </TabsList>
                          
                          {/* Standard diff visualization */}
                          <TabsContent value="standard" className="mt-4">
                            <Tabs defaultValue="side-by-side">
                              <TabsList className="grid w-full max-w-md grid-cols-3">
                                <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
                                <TabsTrigger value="inline">Inline Changes</TabsTrigger>
                                <TabsTrigger value="structured">Structured</TabsTrigger>
                              </TabsList>
                              <TabsContent value="side-by-side" className="mt-4">
                                <div className="flex space-x-4">
                                  <div className="w-1/2 border rounded-md p-4">
                                    <div className="font-medium mb-2">v{compareVersions.source}</div>
                                    <div className="bg-neutral-50 p-4 rounded text-sm font-mono overflow-x-auto">
                                      <p>Article 2. Basic Concepts</p>
                                      <p className="mt-2 bg-green-100">Digital asset - a set of digital data recorded in a distributed ledger technology (blockchain) system that has value and can be transferred between parties.</p>
                                      <p className="mt-2">Blockchain - a type of distributed ledger technology where data is structured in the form of sequentially linked blocks.</p>
                                    </div>
                                  </div>
                                  <div className="w-1/2 border rounded-md p-4">
                                    <div className="font-medium mb-2">v{compareVersions.target}</div>
                                    <div className="bg-neutral-50 p-4 rounded text-sm font-mono overflow-x-auto">
                                      <p>Article 2. Basic Concepts</p>
                                      <p className="mt-2 bg-red-100">Digital asset - electronic monetary values recorded in a distributed ledger that represent ownership rights and can be transferred between parties.</p>
                                      <p className="mt-2">Blockchain - a type of distributed ledger technology where data is structured in the form of sequentially linked blocks.</p>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="inline" className="mt-4">
                                <div className="border rounded-md p-4">
                                  <div className="bg-neutral-50 p-4 rounded text-sm font-mono">
                                    <p>Article 2. Basic Concepts</p>
                                    <p className="mt-2">
                                      Digital asset - <span className="bg-red-100 line-through">a set of digital data recorded in a distributed ledger technology (blockchain) system that has value</span> <span className="bg-green-100">electronic monetary values recorded in a distributed ledger that represent ownership rights</span> and can be transferred between parties.
                                    </p>
                                    <p className="mt-2">Blockchain - a type of distributed ledger technology where data is structured in the form of sequentially linked blocks.</p>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="structured" className="mt-4">
                                <div className="border rounded-md p-4">
                                  <div className="bg-neutral-50 p-4 rounded">
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="border-b">
                                          <th className="text-left py-2">Element</th>
                                          <th className="text-left py-2">v{compareVersions.source}</th>
                                          <th className="text-left py-2">v{compareVersions.target}</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="border-b">
                                          <td className="py-2 font-medium">Digital asset (definition)</td>
                                          <td className="py-2 bg-red-50">a set of digital data recorded in a distributed ledger technology (blockchain) system that has value</td>
                                          <td className="py-2 bg-green-50">electronic monetary values recorded in a distributed ledger that represent ownership rights</td>
                                        </tr>
                                        <tr className="border-b">
                                          <td className="py-2 font-medium">Blockchain (definition)</td>
                                          <td className="py-2">a type of distributed ledger technology where data is structured in the form of sequentially linked blocks</td>
                                          <td className="py-2">a type of distributed ledger technology where data is structured in the form of sequentially linked blocks</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </TabsContent>
                          
                          {/* Semantic diff visualization */}
                          <TabsContent value="semantic" className="mt-4">
                            {comparisonResult ? (
                              <div className="space-y-6">
                                {/* Overview section */}
                                <div className="bg-white p-4 rounded-lg border mb-4">
                                  <h3 className="text-lg font-semibold mb-3">Semantic Analysis Overview</h3>
                                  <div className="grid grid-cols-4 gap-4">
                                    <div className="bg-blue-50 p-3 rounded-md">
                                      <div className="text-sm text-blue-700 mb-1">Similarity Score</div>
                                      <div className="text-2xl font-bold">
                                        {Math.round(comparisonResult.overview.similarityScore * 100)}%
                                      </div>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-md">
                                      <div className="text-sm text-green-700 mb-1">Added Sections</div>
                                      <div className="text-2xl font-bold">
                                        {comparisonResult.overview.addedSections}
                                      </div>
                                    </div>
                                    <div className="bg-red-50 p-3 rounded-md">
                                      <div className="text-sm text-red-700 mb-1">Removed Sections</div>
                                      <div className="text-2xl font-bold">
                                        {comparisonResult.overview.removedSections}
                                      </div>
                                    </div>
                                    <div className="bg-amber-50 p-3 rounded-md">
                                      <div className="text-sm text-amber-700 mb-1">Modified Sections</div>
                                      <div className="text-2xl font-bold">
                                        {comparisonResult.overview.modifiedSections}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Changes list */}
                                <div className="bg-white rounded-lg border">
                                  <div className="p-4 border-b">
                                    <h3 className="text-lg font-semibold">Semantic Changes</h3>
                                    <p className="text-sm text-neutral-500">
                                      Showing detailed semantic changes between versions
                                    </p>
                                  </div>
                                  
                                  <div className="divide-y">
                                    {comparisonResult.changes.map((change, index) => (
                                      <div key={index} className="p-4 hover:bg-neutral-50">
                                        <div className="flex items-center mb-2">
                                          <span className={`w-2 h-2 rounded-full mr-2 ${
                                            change.type === 'addition' ? 'bg-green-500' :
                                            change.type === 'removal' ? 'bg-red-500' : 'bg-amber-500'
                                          }`}></span>
                                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                            change.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                            change.severity === 'major' ? 'bg-amber-100 text-amber-800' :
                                            change.severity === 'minor' ? 'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'
                                          }`}>
                                            {change.severity.toUpperCase()}
                                          </span>
                                          <span className="text-xs font-medium ml-2 px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                                            {change.category}
                                          </span>
                                          <span className="text-xs text-neutral-500 ml-auto">
                                            {change.location}
                                          </span>
                                        </div>
                                        
                                        <h4 className="font-medium mb-2">{change.description}</h4>
                                        
                                        {change.type === 'modification' && (
                                          <div className="grid grid-cols-2 gap-4 mt-3">
                                            <div className="bg-red-50 p-3 rounded text-sm">
                                              <div className="text-red-700 text-xs mb-1">Source Version:</div>
                                              {change.sourceContent}
                                            </div>
                                            <div className="bg-green-50 p-3 rounded text-sm">
                                              <div className="text-green-700 text-xs mb-1">Target Version:</div>
                                              {change.targetContent}
                                            </div>
                                          </div>
                                        )}
                                        
                                        {change.type === 'addition' && change.targetContent && (
                                          <div className="bg-green-50 p-3 rounded text-sm mt-3">
                                            <div className="text-green-700 text-xs mb-1">Added Content:</div>
                                            {change.targetContent}
                                          </div>
                                        )}
                                        
                                        {change.type === 'removal' && change.sourceContent && (
                                          <div className="bg-red-50 p-3 rounded text-sm mt-3">
                                            <div className="text-red-700 text-xs mb-1">Removed Content:</div>
                                            {change.sourceContent}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                    
                                    {comparisonResult.changes.length === 0 && (
                                      <div className="p-8 text-center text-neutral-500">
                                        No semantic changes detected
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="p-8 text-center text-neutral-500 border border-dashed rounded-md">
                                Click "Compare Versions" to perform semantic analysis
                              </div>
                            )}
                          </TabsContent>
                          
                          {/* Deontic Logic Analysis */}
                          <TabsContent value="deontic" className="mt-4">
                            {comparisonResult ? (
                              <div className="space-y-4">
                                <div className="grid grid-cols-4 gap-4 mb-6">
                                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <h4 className="font-medium text-blue-800 mb-2">Obligations</h4>
                                    <div className="text-2xl font-bold text-blue-700">
                                      {comparisonResult.semanticAnalysis.obligations.length}
                                    </div>
                                  </div>
                                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                    <h4 className="font-medium text-green-800 mb-2">Rights</h4>
                                    <div className="text-2xl font-bold text-green-700">
                                      {comparisonResult.semanticAnalysis.rights.length}
                                    </div>
                                  </div>
                                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                    <h4 className="font-medium text-amber-800 mb-2">Permissions</h4>
                                    <div className="text-2xl font-bold text-amber-700">
                                      {comparisonResult.semanticAnalysis.permissions.length}
                                    </div>
                                  </div>
                                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                    <h4 className="font-medium text-red-800 mb-2">Prohibitions</h4>
                                    <div className="text-2xl font-bold text-red-700">
                                      {comparisonResult.semanticAnalysis.prohibitions.length}
                                    </div>
                                  </div>
                                </div>
                                
                                <Tabs defaultValue="obligations">
                                  <TabsList>
                                    <TabsTrigger value="obligations">Obligations</TabsTrigger>
                                    <TabsTrigger value="rights">Rights</TabsTrigger>
                                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                                    <TabsTrigger value="prohibitions">Prohibitions</TabsTrigger>
                                  </TabsList>
                                  
                                  <TabsContent value="obligations" className="mt-4">
                                    <div className="bg-white rounded-lg border">
                                      {comparisonResult.semanticAnalysis.obligations.length > 0 ? (
                                        <div className="divide-y">
                                          {comparisonResult.semanticAnalysis.obligations.map((item, index) => (
                                            <div key={index} className={`p-4 ${
                                              item.changeType === 'added' ? 'bg-green-50' :
                                              item.changeType === 'removed' ? 'bg-red-50' :
                                              item.changeType === 'modified' ? 'bg-amber-50' : ''
                                            }`}>
                                              <div className="flex items-center mb-2">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                                  item.changeType === 'added' ? 'bg-green-100 text-green-800' :
                                                  item.changeType === 'removed' ? 'bg-red-100 text-red-800' :
                                                  item.changeType === 'modified' ? 'bg-amber-100 text-amber-800' :
                                                  'bg-blue-100 text-blue-800'
                                                }`}>
                                                  {item.changeType || 'UNCHANGED'}
                                                </span>
                                              </div>
                                              <p className="font-medium mb-1">
                                                {item.subject} <span className="text-blue-600">must</span> {item.action}
                                                {item.object && <> <span className="text-neutral-500">{item.object}</span></>}
                                              </p>
                                              {item.condition && (
                                                <p className="text-sm text-neutral-600 mb-2">
                                                  Condition: <span className="italic">{item.condition}</span>
                                                </p>
                                              )}
                                              <div className="text-sm mt-2 text-neutral-700 bg-white p-2 rounded border">
                                                {item.description}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="p-8 text-center text-neutral-500">
                                          No obligations found in either version
                                        </div>
                                      )}
                                    </div>
                                  </TabsContent>
                                  
                                  <TabsContent value="rights" className="mt-4">
                                    <div className="p-8 text-center text-neutral-500 border rounded-lg">
                                      {comparisonResult.semanticAnalysis.rights.length === 0 
                                        ? "No rights found in either version" 
                                        : "Rights analysis available"}
                                    </div>
                                  </TabsContent>
                                  
                                  <TabsContent value="permissions" className="mt-4">
                                    <div className="p-8 text-center text-neutral-500 border rounded-lg">
                                      {comparisonResult.semanticAnalysis.permissions.length === 0 
                                        ? "No permissions found in either version" 
                                        : "Permissions analysis available"}
                                    </div>
                                  </TabsContent>
                                  
                                  <TabsContent value="prohibitions" className="mt-4">
                                    <div className="p-8 text-center text-neutral-500 border rounded-lg">
                                      {comparisonResult.semanticAnalysis.prohibitions.length === 0 
                                        ? "No prohibitions found in either version" 
                                        : "Prohibitions analysis available"}
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              </div>
                            ) : (
                              <div className="p-8 text-center text-neutral-500 border border-dashed rounded-md">
                                Click "Compare Versions" to analyze deontic modality changes
                              </div>
                            )}
                          </TabsContent>
                          
                          {/* Definitions Changes */}
                          <TabsContent value="definitions" className="mt-4">
                            {comparisonResult && comparisonResult.semanticAnalysis.definitions.length > 0 ? (
                              <div className="bg-white rounded-lg border">
                                <div className="p-4 border-b">
                                  <h3 className="text-lg font-semibold">Term Definitions</h3>
                                  <p className="text-sm text-neutral-500">Changes in legal terms and their definitions</p>
                                </div>
                                <div className="overflow-x-auto">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="bg-neutral-50">
                                        <th className="p-3 text-left font-semibold text-sm">Term</th>
                                        <th className="p-3 text-left font-semibold text-sm">Source Definition</th>
                                        <th className="p-3 text-left font-semibold text-sm">Target Definition</th>
                                        <th className="p-3 text-left font-semibold text-sm">Change</th>
                                        <th className="p-3 text-left font-semibold text-sm">Similarity</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                      {comparisonResult.semanticAnalysis.definitions.map((def, index) => (
                                        <tr key={index} className={
                                          def.changeType === 'added' ? 'bg-green-50' :
                                          def.changeType === 'removed' ? 'bg-red-50' :
                                          def.changeType === 'modified' ? 'bg-amber-50' : ''
                                        }>
                                          <td className="p-3 font-medium">{def.term}</td>
                                          <td className="p-3 text-sm text-neutral-700">
                                            {def.sourceDefinition || "-"}
                                          </td>
                                          <td className="p-3 text-sm text-neutral-700">
                                            {def.targetDefinition || "-"}
                                          </td>
                                          <td className="p-3">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                              def.changeType === 'added' ? 'bg-green-100 text-green-800' :
                                              def.changeType === 'removed' ? 'bg-red-100 text-red-800' :
                                              'bg-amber-100 text-amber-800'
                                            }`}>
                                              {def.changeType.toUpperCase()}
                                            </span>
                                          </td>
                                          <td className="p-3">
                                            {def.similarityScore !== undefined 
                                              ? `${Math.round(def.similarityScore * 100)}%` 
                                              : "-"}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ) : (
                              <div className="p-8 text-center text-neutral-500 border border-dashed rounded-md">
                                {comparisonResult 
                                  ? "No definition changes detected" 
                                  : "Click \"Compare Versions\" to analyze term definitions"}
                              </div>
                            )}
                          </TabsContent>
                          
                          {/* References Changes */}
                          <TabsContent value="references" className="mt-4">
                            {comparisonResult && comparisonResult.semanticAnalysis.references.length > 0 ? (
                              <div className="bg-white rounded-lg border">
                                <div className="p-4 border-b">
                                  <h3 className="text-lg font-semibold">Legislative References</h3>
                                  <p className="text-sm text-neutral-500">Changes in references to other legislation</p>
                                </div>
                                <div className="divide-y">
                                  {comparisonResult.semanticAnalysis.references.map((ref, index) => (
                                    <div key={index} className={`p-4 ${
                                      ref.changeType === 'added' ? 'bg-green-50' :
                                      ref.changeType === 'removed' ? 'bg-red-50' :
                                      ref.changeType === 'modified' ? 'bg-amber-50' :
                                      ref.changeType === 'broken' ? 'bg-red-50' : ''
                                    }`}>
                                      <div className="flex justify-between items-center mb-2">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                          ref.changeType === 'added' ? 'bg-green-100 text-green-800' :
                                          ref.changeType === 'removed' ? 'bg-red-100 text-red-800' :
                                          ref.changeType === 'modified' ? 'bg-amber-100 text-amber-800' :
                                          ref.changeType === 'broken' ? 'bg-red-100 text-red-800' :
                                          'bg-blue-100 text-blue-800'
                                        }`}>
                                          {ref.changeType.toUpperCase()}
                                        </span>
                                      </div>
                                      
                                      <p className="mb-2">{ref.description}</p>
                                      
                                      {ref.sourceRef && (
                                        <div className="text-sm bg-white p-2 rounded border mb-2">
                                          <span className="font-medium">Source:</span> {ref.sourceRef}
                                        </div>
                                      )}
                                      
                                      {ref.targetRef && (
                                        <div className="text-sm bg-white p-2 rounded border">
                                          <span className="font-medium">Target:</span> {ref.targetRef}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="p-8 text-center text-neutral-500 border border-dashed rounded-md">
                                {comparisonResult 
                                  ? "No reference changes detected" 
                                  : "Click \"Compare Versions\" to analyze references"}
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      )}
                    </>
                  ) : (
                    <div className="p-12 text-center text-neutral-400 border border-dashed rounded-md">
                      Select both versions to view differences
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Version History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-neutral-200"></div>
                  
                  {isLoadingVersions ? (
                    <div className="flex flex-col space-y-8 pl-16">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-5 bg-neutral-200 rounded w-1/4 mb-2"></div>
                          <div className="h-4 bg-neutral-200 rounded w-1/3 mb-2"></div>
                          <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {versions?.map((version) => (
                        <div key={version.id} className="flex mb-8">
                          <div className="mr-8 relative">
                            <div
                              className={`h-16 w-16 rounded-full border-4 ${
                                version.isCurrent ? "border-primary" : "border-neutral-300"
                              } bg-white flex items-center justify-center z-10`}
                            >
                              <span className="font-bold">{version.version}</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-medium mr-3">Version {version.version}</h3>
                              {version.isCurrent && (
                                <Badge className="bg-primary text-white">Current</Badge>
                              )}
                            </div>
                            <p className="text-neutral-500 mb-1">
                              {formatDate(version.createdAt)} by {version.createdBy?.name || "Unknown"}
                            </p>
                            <p className="mb-3">{version.description}</p>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <i className="fas fa-eye mr-2"></i>
                                View Content
                              </Button>
                              {!version.isCurrent && (
                                <Button size="sm" variant="outline">
                                  <i className="fas fa-code-compare mr-2"></i>
                                  Compare with Current
                                </Button>
                              )}
                              {!version.isCurrent && (
                                <Button size="sm" variant="outline" className="border-secondary text-secondary">
                                  <i className="fas fa-clock-rotate-left mr-2"></i>
                                  Revert to This Version
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {versions?.length === 0 && (
                        <div className="p-12 text-center text-neutral-400">
                          No version history available for this document
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!selectedDocumentId && (
        <div className="p-16 text-center text-neutral-400 border border-dashed rounded-md">
          Select a document to view its version history
        </div>
      )}
    </>
  );
};

export default Versions;
