import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VerificationIssue } from "@/types";

interface VerificationModalProps {
  issue?: VerificationIssue;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (issueId: number) => void;
  onIgnore: (issueId: number) => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  issue,
  isOpen,
  onClose,
  onResolve,
  onIgnore
}) => {
  if (!issue) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Verification Results</DialogTitle>
          <DialogDescription>
            Review and resolve conflicts detected in the document
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="font-medium text-lg mb-3">Conflict Details</h3>
          <div className={`bg-${issue.severity}-bg-opacity-10 border border-${issue.severity} rounded-md p-4 mb-4`}>
            <div className="flex items-start">
              <div className={`flex-shrink-0 w-10 h-10 bg-${issue.severity} bg-opacity-20 rounded-full flex items-center justify-center mr-4`}>
                <i className={`fas fa-${issue.severity === 'warning' ? 'exclamation-triangle' : 'circle-exclamation'} text-${issue.severity}`}></i>
              </div>
              <div>
                <h4 className="font-medium">{issue.title}</h4>
                <p className="text-sm mb-3">{issue.description}</p>
                
                {issue.conflictingReferenceContent && (
                  <div className="flex mb-3">
                    <div className="w-1/2 p-3 bg-neutral-100 text-sm border-r">
                      <div className="font-medium mb-1">Current Document</div>
                      <p className="text-neutral-500">{issue.location}</p>
                    </div>
                    <div className="w-1/2 p-3 bg-neutral-100 text-sm">
                      <div className="font-medium mb-1">{issue.conflictingReferenceTitle}</div>
                      <p className="text-neutral-500">{issue.conflictingReferenceContent}</p>
                    </div>
                  </div>
                )}
                
                <div className="bg-neutral-100 p-3 rounded text-sm mb-3">
                  <div className="font-medium mb-1">AI Analysis</div>
                  <p className="text-neutral-500">
                    {issue.severity === 'warning' 
                      ? "The definitions have semantic overlap but differ in scope. This may create regulatory confusion."
                      : "Critical conflict detected that could result in legal contradictions. Immediate attention required."}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    className={`bg-${issue.severity} text-white hover:bg-${issue.severity}/80`}
                    onClick={() => onResolve(issue.id)}
                  >
                    Resolve Conflict
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => onIgnore(issue.id)}
                  >
                    Ignore
                  </Button>
                  <Button variant="outline">
                    Add Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="py-4">
          <h3 className="font-medium text-lg mb-3">Recommended Actions</h3>
          <div className="space-y-3">
            <div className="p-3 border rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-secondary bg-opacity-20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <i className="fas fa-lightbulb text-secondary text-xs"></i>
                </div>
                <div>
                  <p className="font-medium">Harmonize definitions across both laws</p>
                  <p className="text-sm text-neutral-500">Modify Article 3.1(1) to include key elements from Banking Law while maintaining clarity.</p>
                </div>
              </div>
            </div>
            <div className="p-3 border rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-secondary bg-opacity-20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <i className="fas fa-lightbulb text-secondary text-xs"></i>
                </div>
                <div>
                  <p className="font-medium">Add cross-reference to Banking Law</p>
                  <p className="text-sm text-neutral-500">Include explicit references to Banking Law Article 15.3 to acknowledge relationship.</p>
                </div>
              </div>
            </div>
            <div className="p-3 border rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-secondary bg-opacity-20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <i className="fas fa-lightbulb text-secondary text-xs"></i>
                </div>
                <div>
                  <p className="font-medium">Draft amendment to Banking Law</p>
                  <p className="text-sm text-neutral-500">Consider updating Banking Law to align with new Digital Assets framework.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-primary text-white">
            Save & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationModal;
