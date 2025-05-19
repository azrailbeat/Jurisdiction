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
  };

  const formatDate = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };

  const handleCompare = () => {
    // In a real implementation, this would fetch a comparison
    console.log("Comparing versions:", compareVersions);
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
