// English translations
export default {
  // App-wide shared strings
  "app": {
    "title": "Legislative Document Manager",
    "language": "Language",
    "search": "Search",
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "actions": "Actions",
    "status": "Status"
  },
  
  // Navigation
  "nav": {
    "home": "Home",
    "documents": "Documents",
    "versions": "Versions",
    "knowledgeGraph": "Knowledge Graph",
    "verification": "Verification",
    "agents": "Agents",
    "analytics": "Analytics",
    "settings": "Settings",
    "logout": "Logout",
    "login": "Login"
  },
  
  // Document management
  "documents": {
    "title": "Document Repository",
    "newDocument": "New Document",
    "upload": "Upload Document",
    "compare": "Compare Documents",
    "search": "Search Documents",
    "filters": "Filters",
    "status": {
      "draft": "Draft",
      "review": "Under Review",
      "approved": "Approved",
      "published": "Published",
      "archived": "Archived"
    },
    "fields": {
      "title": "Title",
      "createdBy": "Created By",
      "createdAt": "Created At",
      "updatedAt": "Updated At",
      "status": "Status",
      "type": "Document Type",
      "category": "Category",
      "description": "Description"
    },
    "uploadInstructions": "Drag and drop your document here, or click to select",
    "supportedFormats": "Supported formats: DOCX, PDF, TXT"
  },
  
  // Version control
  "versions": {
    "title": "Version History",
    "current": "Current Version",
    "compare": "Compare with Current",
    "revert": "Revert to this Version",
    "created": "Created on {{date}}",
    "by": "by {{name}}",
    "changes": "Changes",
    "added": "Added",
    "removed": "Removed",
    "modified": "Modified"
  },
  
  // Knowledge graph
  "knowledgeGraph": {
    "title": "Knowledge Graph",
    "nodes": "Nodes",
    "edges": "Edges",
    "entityTypes": "Entity Types",
    "relationTypes": "Relation Types",
    "filters": "Filters",
    "search": "Search in Graph",
    "details": "Entity Details",
    "statistics": "Graph Statistics",
    "export": "Export Graph",
    "relatedDocuments": "Related Documents",
    "pathAnalysis": "Path Analysis"
  },
  
  // Verification and compliance
  "verification": {
    "title": "Verification & Compliance",
    "issues": "Detected Issues",
    "runVerification": "Run Verification",
    "complianceReport": "Compliance Report",
    "relatedLegislation": "Related Legislation",
    "severity": {
      "critical": "Critical",
      "high": "High",
      "medium": "Medium",
      "low": "Low",
      "info": "Information"
    },
    "status": {
      "open": "Open",
      "inProgress": "In Progress",
      "resolved": "Resolved",
      "closed": "Closed",
      "wontFix": "Won't Fix"
    }
  },
  
  // Agents
  "agents": {
    "title": "Agent Management",
    "createAgent": "Create Agent",
    "runningAgents": "Running Agents",
    "allAgents": "All Agents",
    "status": {
      "idle": "Idle",
      "running": "Running",
      "paused": "Paused",
      "completed": "Completed",
      "failed": "Failed"
    },
    "types": {
      "parser": "Parser Agent",
      "vectorizer": "Vectorizer Agent",
      "verification": "Verification Agent",
      "analysis": "Analysis Agent",
      "termAlignment": "Term Alignment Agent"
    },
    "actions": {
      "start": "Start",
      "pause": "Pause",
      "resume": "Resume",
      "stop": "Stop",
      "restart": "Restart",
      "configure": "Configure"
    }
  },
  
  // Analytics
  "analytics": {
    "title": "Analytics Dashboard",
    "documentStatistics": "Document Statistics",
    "userActivity": "User Activity",
    "topDocuments": "Top Documents",
    "complianceRate": "Compliance Rate",
    "issuesByCategory": "Issues by Category",
    "timeRange": "Time Range",
    "export": "Export Data"
  },
  
  // Settings
  "settings": {
    "title": "Settings",
    "tabs": {
      "profile": "Profile",
      "account": "Account",
      "notifications": "Notifications",
      "system": "System",
      "aiModels": "AI & Models"
    },
    "profile": {
      "title": "Profile Settings",
      "subtitle": "Manage your personal information",
      "fullName": "Full Name",
      "email": "Email Address",
      "bio": "Biography",
      "avatar": "Profile Image",
      "change": "Change",
      "saveProfile": "Save Profile"
    },
    "account": {
      "title": "Account Settings",
      "subtitle": "Manage your account preferences",
      "username": "Username",
      "language": "Interface Language",
      "theme": "Interface Theme",
      "themes": {
        "light": "Light",
        "dark": "Dark",
        "system": "System Default"
      },
      "security": "Security",
      "changePassword": "Change Password",
      "enableTwoFactor": "Enable Two-Factor Authentication",
      "saveAccount": "Save Account Settings"
    },
    "notifications": {
      "title": "Notification Settings",
      "subtitle": "Control how you receive notifications",
      "emailNotifications": "Email Notifications",
      "emailNotificationsDesc": "Receive notifications via email",
      "documentUpdates": "Document Updates",
      "documentUpdatesDesc": "Notifications when documents you follow are updated",
      "verificationAlerts": "Verification Alerts",
      "verificationAlertsDesc": "Receive alerts about verification issues",
      "weeklyDigest": "Weekly Digest",
      "weeklyDigestDesc": "Receive a weekly summary of system activity",
      "saveNotifications": "Save Notification Settings"
    },
    "system": {
      "title": "System Settings",
      "subtitle": "Configure system-wide settings",
      "apiEndpoint": "API Endpoint",
      "defaultXmlFormat": "Default XML Format",
      "maxVersions": "Max Versions to Keep",
      "experimental": "Enable Experimental Features",
      "maintenance": "System Maintenance",
      "rebuildGraph": "Rebuild Knowledge Graph",
      "rescanDocuments": "Rescan Documents",
      "clearCache": "Clear Cache",
      "saveSystem": "Save System Settings"
    },
    "aiModels": {
      "title": "AI & Models",
      "subtitle": "Configure AI models and settings",
      "apiKey": "AI Model API Key",
      "model": "Default Model",
      "maxTokens": "Max Tokens",
      "semanticAnalysis": "Enable Semantic Analysis",
      "automatedVerification": "Enable Automated Verification",
      "saveAI": "Save AI Settings"
    }
  },
  
  // Error messages
  "errors": {
    "general": "An error occurred. Please try again.",
    "notFound": "The requested resource was not found.",
    "unauthorized": "You are not authorized to perform this action.",
    "serverError": "Server error occurred. Please try again later.",
    "validation": "Please check your input and try again.",
    "fileUpload": "File upload failed. Please try again."
  }
};