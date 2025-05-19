import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LegalTerm } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

const Terminology: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [newTerm, setNewTerm] = useState({
    term: "",
    definition: "",
    source: "",
    category: "",
  });

  const { data: terms, isLoading } = useQuery<LegalTerm[]>({
    queryKey: ["/api/terms"],
  });

  const filteredTerms = terms
    ?.filter((term) => {
      // Filter by search query
      if (
        searchQuery &&
        !term.term.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !term.definition.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      
      // Filter by category
      if (activeCategory !== "all" && term.category !== activeCategory) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => a.term.localeCompare(b.term));

  const categories = terms
    ? Array.from(new Set(terms.map((term) => term.category).filter(Boolean)))
    : [];

  const handleCreateTerm = async () => {
    try {
      await apiRequest("POST", "/api/terms", newTerm);
      
      // Reset form and close dialog
      setNewTerm({
        term: "",
        definition: "",
        source: "",
        category: "",
      });
      setIsCreateDialogOpen(false);

      // Refresh terms list
      queryClient.invalidateQueries({ queryKey: ["/api/terms"] });
    } catch (error) {
      console.error("Failed to create term:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the filteredTerms logic
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Legal Terminology</h1>
        <Button
          className="bg-primary text-white"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <i className="fas fa-plus mr-2"></i>
          Add New Term
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div
                  className={`px-3 py-2 rounded-md cursor-pointer ${
                    activeCategory === "all"
                      ? "bg-primary text-white"
                      : "hover:bg-neutral-100"
                  }`}
                  onClick={() => setActiveCategory("all")}
                >
                  All Terms
                </div>
                {categories.map((category) => (
                  <div
                    key={category}
                    className={`px-3 py-2 rounded-md cursor-pointer ${
                      activeCategory === category
                        ? "bg-primary text-white"
                        : "hover:bg-neutral-100"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <CardTitle>Legal Terms</CardTitle>
                <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                  <Input
                    type="text"
                    placeholder="Search terms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                  <i className="fas fa-search absolute left-3 top-2.5 text-neutral-400"></i>
                </form>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="table">
                <TabsList className="mb-4">
                  <TabsTrigger value="table">Table View</TabsTrigger>
                  <TabsTrigger value="glossary">Glossary</TabsTrigger>
                </TabsList>
                
                <TabsContent value="table">
                  {isLoading ? (
                    <div className="py-8 text-center">
                      <i className="fas fa-spinner fa-spin text-primary text-2xl mb-4"></i>
                      <p>Loading terminology...</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Term</TableHead>
                            <TableHead>Definition</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Source</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTerms?.length ? (
                            filteredTerms.map((term) => (
                              <TableRow key={term.id}>
                                <TableCell className="font-medium">{term.term}</TableCell>
                                <TableCell>{term.definition}</TableCell>
                                <TableCell>{term.category}</TableCell>
                                <TableCell>{term.source}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className="h-24 text-center text-neutral-500"
                              >
                                {searchQuery
                                  ? "No terms found matching your search"
                                  : "No terms defined yet"}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="glossary">
                  {isLoading ? (
                    <div className="py-8 text-center">
                      <i className="fas fa-spinner fa-spin text-primary text-2xl mb-4"></i>
                      <p>Loading terminology...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredTerms?.length ? (
                        filteredTerms.map((term) => (
                          <div key={term.id} className="border-b pb-4">
                            <div className="flex items-start justify-between">
                              <h3 className="text-lg font-bold">{term.term}</h3>
                              <div className="text-sm text-neutral-500">
                                {term.category}
                              </div>
                            </div>
                            <p className="mt-2">{term.definition}</p>
                            {term.source && (
                              <p className="mt-2 text-sm text-neutral-500">
                                Source: {term.source}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-neutral-500">
                          {searchQuery
                            ? "No terms found matching your search"
                            : "No terms defined yet"}
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Term Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Legal Term</DialogTitle>
            <DialogDescription>
              Enter the details of the legal term to add to the terminology database.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="term" className="text-right">
                Term
              </Label>
              <Input
                id="term"
                value={newTerm.term}
                onChange={(e) => setNewTerm({ ...newTerm, term: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="definition" className="text-right">
                Definition
              </Label>
              <Textarea
                id="definition"
                value={newTerm.definition}
                onChange={(e) => setNewTerm({ ...newTerm, definition: e.target.value })}
                className="col-span-3"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={newTerm.category}
                onValueChange={(value) => setNewTerm({ ...newTerm, category: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Digital Assets">Digital Assets</SelectItem>
                  <SelectItem value="Constitutional">Constitutional</SelectItem>
                  <SelectItem value="Criminal">Criminal</SelectItem>
                  <SelectItem value="Civil">Civil</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="source" className="text-right">
                Source
              </Label>
              <Input
                id="source"
                value={newTerm.source}
                onChange={(e) => setNewTerm({ ...newTerm, source: e.target.value })}
                className="col-span-3"
                placeholder="e.g. Banking Law Article 15.3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTerm}>Add Term</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Terminology;
