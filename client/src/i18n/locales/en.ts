export default {
  // Application Name
  "appName": "Jurisdiction",
  
  // Common actions
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "edit": "Edit",
    "delete": "Delete",
    "create": "Create",
    "upload": "Upload",
    "download": "Download",
    "search": "Search",
    "filter": "Filter",
    "sortBy": "Sort by",
    "apply": "Apply",
    "confirm": "Confirm",
    "submit": "Submit",
    "back": "Back",
    "next": "Next",
    "finish": "Finish",
    "view": "View",
    "duplicate": "Duplicate",
    "archive": "Archive"
  },
  
  // Navigation
  "nav": {
    "home": "Home",
    "dashboard": "Dashboard",
    "documents": "Documents",
    "versions": "Versions",
    "knowledgeGraph": "Knowledge Graph",
    "verification": "Verification",
    "terminology": "Terminology",
    "agents": "Agents",
    "settings": "Settings",
    "help": "Help",
    "logout": "Logout"
  },
  
  // Dashboard
  "dashboard": {
    "title": "Dashboard",
    "welcome": "Welcome to Jurisdiction",
    "subtitle": "Legislative document management system",
    "summary": "Summary",
    "recentActivity": "Recent Activity",
    "quickAccess": "Quick Access",
    "statistics": "Statistics",
    "seeAll": "See all",
    "documentStats": "Document Statistics",
    "statsTotal": "Total Documents",
    "statsActive": "Active Documents",
    "statsDraft": "Drafts",
    "statsReview": "In Review"
  },
  
  // Documents
  "documents": {
    "title": "Documents",
    "subtitle": "Manage and collaborate on your legislative documents",
    "createNew": "Create New Document",
    "createDescription": "Start drafting a new legislative document",
    "noDocuments": "No documents found",
    "searchPlaceholder": "Search documents...",
    "filters": {
      "allStatuses": "All Statuses",
      "draft": "Draft",
      "review": "In Review",
      "active": "Active",
      "archived": "Archived"
    },
    "sort": {
      "date": "Last Updated",
      "title": "Title",
      "status": "Status"
    },
    "properties": {
      "title": "Title",
      "description": "Description",
      "status": "Status",
      "version": "Version",
      "updated": "Updated",
      "created": "Created",
      "author": "Author",
      "collaborators": "Collaborators"
    },
    "status": {
      "active": "Active",
      "draft": "Draft",
      "review": "In Review",
      "archived": "Archived"
    },
    "actions": {
      "newDocument": "New Document",
      "editDocument": "Edit Document",
      "deleteDocument": "Delete Document",
      "duplicateDocument": "Duplicate Document",
      "archiveDocument": "Archive Document"
    },
    "prompts": {
      "noDescription": "No description provided.",
      "featureComingSoon": "Feature Coming Soon",
      "duplicatePrompt": "Document duplication will be available in a future update",
      "archivePrompt": "Document archiving will be available in a future update",
      "deletePrompt": "Document deletion will be available in a future update",
      "titleRequired": "Document title is required",
      "createSuccess": "Document created successfully",
      "createError": "Failed to create document"
    }
  },
  
  // Document Editor
  "editor": {
    "title": "Document Editor",
    "save": "Save Changes",
    "discard": "Discard Changes",
    "lastSaved": "Last saved",
    "autoSaving": "Auto-saving...",
    "sections": {
      "content": "Content",
      "properties": "Properties",
      "history": "History",
      "comments": "Comments",
      "verification": "Verification"
    },
    "version": {
      "currentVersion": "Current Version",
      "viewVersion": "View Version",
      "compareVersions": "Compare Versions",
      "restoreVersion": "Restore This Version",
      "versionHistory": "Version History",
      "createdBy": "Created by",
      "on": "on",
      "changesSummary": "Changes Summary"
    },
    "toolbar": {
      "heading": "Heading",
      "paragraph": "Paragraph",
      "bold": "Bold",
      "italic": "Italic",
      "underline": "Underline",
      "bulletList": "Bullet List",
      "numberedList": "Numbered List",
      "quote": "Quote",
      "code": "Code",
      "link": "Link"
    }
  },
  
  // Knowledge Graph
  "knowledgeGraph": {
    "title": "Knowledge Graph",
    "subtitle": "Visualize relationships between documents and legal concepts",
    "noData": "No graph data available",
    "nodes": "Nodes",
    "edges": "Edges",
    "zoomIn": "Zoom In",
    "zoomOut": "Zoom Out",
    "resetView": "Reset View",
    "filters": "Filters",
    "search": "Search in graph",
    "details": "Entity Details",
    "relatedDocuments": "Related Documents",
    "nodeTypes": {
      "document": "Document",
      "term": "Legal Term",
      "entity": "Entity",
      "obligation": "Obligation",
      "right": "Right",
      "court": "Court",
      "case": "Case"
    },
    "statistics": {
      "graphStatistics": "Graph Statistics",
      "documentCount": "Documents",
      "termCount": "Legal Terms",
      "entityCount": "Entities",
      "connectionCount": "Connections",
      "densityScore": "Graph Density",
      "centralDocuments": "Central Documents"
    }
  },
  
  // Verification
  "verification": {
    "title": "Verification",
    "subtitle": "Validate document compliance and consistency",
    "runVerification": "Run Verification",
    "lastRun": "Last verification ran",
    "noIssues": "No issues found",
    "issuesFound": "Issues Found",
    "status": {
      "passed": "Passed",
      "failed": "Failed",
      "warning": "Warning",
      "inProgress": "In Progress",
      "notRun": "Not Run"
    },
    "severity": {
      "critical": "Critical",
      "high": "High",
      "medium": "Medium",
      "low": "Low",
      "info": "Info"
    },
    "categories": {
      "consistency": "Consistency",
      "compliance": "Compliance",
      "formatting": "Formatting",
      "terminology": "Terminology",
      "logic": "Logical Analysis"
    },
    "issueActions": {
      "resolve": "Mark as Resolved",
      "ignore": "Ignore",
      "viewDetails": "View Details",
      "view": "View in Context"
    }
  },
  
  // Agents
  "agents": {
    "title": "Agents",
    "subtitle": "Monitor and manage microservice agents",
    "overview": "Agent Overview",
    "status": {
      "active": "Active",
      "inactive": "Inactive",
      "error": "Error",
      "starting": "Starting",
      "stopping": "Stopping"
    },
    "controls": {
      "start": "Start Agent",
      "stop": "Stop Agent",
      "restart": "Restart Agent",
      "configure": "Configure"
    },
    "metrics": {
      "uptime": "Uptime",
      "memory": "Memory Usage",
      "cpu": "CPU Usage",
      "requests": "Requests Processed",
      "errors": "Errors"
    },
    "types": {
      "docParser": "Document Parser",
      "verifier": "Verifier",
      "vectorizer": "Vectorizer",
      "termAlign": "Term Alignment",
      "graphBuilder": "Graph Builder",
      "searchIndex": "Search Indexer",
      "llmProxy": "LLM Proxy"
    },
    "actions": {
      "createAgent": "Create New Agent",
      "editAgent": "Edit Agent",
      "deleteAgent": "Delete Agent",
      "viewLogs": "View Logs"
    }
  },
  
  // Terminology
  "terminology": {
    "title": "Terminology",
    "subtitle": "Manage legal terms and definitions",
    "searchPlaceholder": "Search terms...",
    "addTerm": "Add Term",
    "importTerms": "Import Terms",
    "exportTerms": "Export Terms",
    "termDetails": "Term Details",
    "noTerms": "No terms found",
    "properties": {
      "term": "Term",
      "definition": "Definition",
      "source": "Source",
      "category": "Category",
      "relatedTerms": "Related Terms",
      "usageContext": "Usage Context",
      "examples": "Examples"
    }
  },
  
  // Settings
  "settings": {
    "title": "Settings",
    "subtitle": "Configure application preferences and account settings",
    "saveChanges": "Save Changes",
    "tabs": {
      "profile": "Profile",
      "appearance": "Appearance",
      "notifications": "Notifications",
      "language": "Language",
      "security": "Security",
      "advanced": "Advanced"
    },
    "profile": {
      "title": "My Account",
      "personalInfo": "Personal Information",
      "name": "Name",
      "email": "Email Address",
      "position": "Position",
      "department": "Department",
      "avatar": "Profile Picture",
      "changeAvatar": "Change Profile Picture"
    },
    "appearance": {
      "theme": "Theme",
      "themes": {
        "light": "Light",
        "dark": "Dark",
        "system": "System Default"
      },
      "fontSize": "Font Size",
      "fontSizes": {
        "small": "Small",
        "medium": "Medium",
        "large": "Large"
      },
      "density": "Interface Density",
      "densities": {
        "compact": "Compact",
        "comfortable": "Comfortable",
        "spacious": "Spacious"
      }
    },
    "language": {
      "selectLanguage": "Select Language",
      "languages": {
        "en": "English",
        "ru": "Russian",
        "kk": "Kazakh"
      }
    },
    "notifications": {
      "emailNotifications": "Email Notifications",
      "pushNotifications": "Push Notifications",
      "notifyOn": {
        "documentChanges": "Document Changes",
        "mentions": "Mentions",
        "comments": "Comments",
        "verificationResults": "Verification Results",
        "systemUpdates": "System Updates"
      }
    },
    "security": {
      "password": "Password",
      "changePassword": "Change Password",
      "twoFactor": "Two-Factor Authentication",
      "enableTwoFactor": "Enable Two-Factor Authentication",
      "loginHistory": "Login History",
      "sessionManagement": "Session Management"
    }
  },
  
  // Error messages
  "errors": {
    "genericError": "An error occurred",
    "connectionError": "Connection error",
    "notFound": "Not found",
    "unauthorized": "Unauthorized",
    "forbidden": "Forbidden",
    "serverError": "Server error",
    "validationError": "Validation error",
    "requiredField": "This field is required",
    "invalidInput": "Invalid input"
  },
  
  // Success messages
  "success": {
    "changesSaved": "Changes saved successfully",
    "itemCreated": "Item created successfully",
    "itemUpdated": "Item updated successfully",
    "itemDeleted": "Item deleted successfully"
  },
  
  // Time-related terms
  "time": {
    "now": "Just now",
    "minutesAgo": "{{count}} minute ago",
    "minutesAgo_plural": "{{count}} minutes ago",
    "hoursAgo": "{{count}} hour ago",
    "hoursAgo_plural": "{{count}} hours ago",
    "daysAgo": "{{count}} day ago",
    "daysAgo_plural": "{{count}} days ago",
    "weeksAgo": "{{count}} week ago",
    "weeksAgo_plural": "{{count}} weeks ago",
    "monthsAgo": "{{count}} month ago",
    "monthsAgo_plural": "{{count}} months ago",
    "yesterday": "Yesterday",
    "today": "Today"
  }
};