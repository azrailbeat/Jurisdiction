export default {
  // Common
  common: {
    loading: "Loading...",
    noResults: "No results found",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    download: "Download",
    upload: "Upload",
    search: "Search",
    creating: "Creating...",
    saving: "Saving...",
    deleting: "Deleting...",
    close: "Close",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",
    sort: "Sort",
    status: {
      all: "All statuses",
      draft: "Draft",
      review: "In Review",
      approved: "Approved",
      active: "Active",
      archived: "Archived",
      rejected: "Rejected"
    }
  },

  // Navigation
  nav: {
    home: "Home",
    documents: "Documents",
    versions: "Versions",
    knowledgeGraph: "Knowledge Graph",
    verification: "Verification",
    settings: "Settings",
    agents: "Agents",
    terminology: "Terminology",
    terminologyDescription: "Manage legal terms glossary",
    logout: "Log Out"
  },

  // App
  app: {
    title: "Jurisdiction",
    search: "Search...",
    welcome: "Welcome to Jurisdiction",
    description: "Legal document management platform"
  },

  // Home
  home: {
    title: "Dashboard",
    recentDocuments: "Recent Documents",
    recentActivity: "Recent Activity",
    quickAccess: "Quick Access",
    statistics: "Statistics",
    viewAll: "View All",
    welcomeMessage: "Welcome back, {{name}}!",
    overviewTitle: "Your Documents Overview",
    totalDocuments: "Total Documents",
    documentsInReview: "In Review",
    approvedDocuments: "Approved Documents",
    documentsWithIssues: "Documents With Issues"
  },

  // Documents
  documents: {
    title: "Documents",
    subtitle: "Manage legislative documents",
    searchPlaceholder: "Search documents...",
    filterByStatus: "Filter by status",
    filterByDate: "Filter by date",
    sortBy: "Sort by",
    view: {
      list: "List view",
      grid: "Grid view"
    },
    columns: {
      title: "Title",
      status: "Status",
      date: "Date Created",
      version: "Version",
      actions: "Actions"
    },
    table: {
      title: "Title",
      status: "Status",
      modified: "Last Modified"
    },
    actions: {
      searchDocuments: "Search documents",
      newDocument: "Create New Document",
      upload: "Upload Document",
      export: "Export",
      compare: "Compare",
      archive: "Archive"
    },
    form: {
      title: "Title",
      titlePlaceholder: "e.g., Civil Code Amendment 2025",
      description: "Description",
      descriptionPlaceholder: "Briefly describe the purpose of this document...",
      status: "Status",
      submit: "Create Document",
      update: "Update Document"
    },
    noDocuments: "No documents found",
    emptyState: {
      title: "No documents found",
      description: "Create your first document to get started"
    },
    deleteConfirm: "Are you sure you want to delete this document? This action cannot be undone."
  },

  // Document Editor
  editor: {
    title: "Document Editor",
    save: "Save Changes",
    saveAndPublish: "Save & Publish",
    publish: "Publish",
    discard: "Discard Changes",
    preview: "Preview",
    history: "History",
    versions: "Versions",
    comments: "Comments",
    formatting: "Formatting",
    addComment: "Add Comment",
    resolveComment: "Resolve",
    autoSaved: "Auto-saved at {{time}}",
    unsavedChanges: "You have unsaved changes",
    versionCreated: "Version {{number}} created",
    sections: {
      add: "Add Section",
      edit: "Edit Section",
      delete: "Delete Section"
    }
  },

  // Verification
  verification: {
    title: "Verification",
    runVerification: "Run Verification",
    lastRun: "Last run: {{date}}",
    status: {
      passed: "Passed",
      failed: "Failed",
      warning: "Warning",
      running: "Running",
      pending: "Pending"
    },
    issues: {
      critical: "Critical Issues",
      major: "Major Issues",
      minor: "Minor Issues",
      info: "Information"
    },
    filters: {
      all: "All Issues",
      open: "Open Issues",
      resolved: "Resolved Issues"
    },
    noIssues: "No issues found",
    resolveIssue: "Mark as Resolved",
    reopenIssue: "Reopen Issue"
  },
  
  // Knowledge Graph
  knowledgeGraph: {
    title: "Knowledge Graph",
    nodeTypes: "Node Types",
    edgeTypes: "Edge Types",
    findConnections: "Find Connections",
    exportGraph: "Export Graph",
    focusNode: "Focus on Node",
    expand: "Expand Node",
    collapse: "Collapse Node",
    showDetails: "Show Details",
    hideDetails: "Hide Details",
    statistics: {
      title: "Graph Statistics",
      nodes: "Total Nodes",
      edges: "Total Edges",
      documents: "Documents",
      terms: "Legal Terms",
      entities: "Entities"
    },
    search: {
      placeholder: "Search the graph...",
      results: "{{count}} results found",
      noResults: "No results found"
    },
    filters: {
      title: "Filters",
      showNodes: "Show Nodes",
      showEdges: "Show Edges",
      reset: "Reset Filters"
    }
  },

  // Settings
  settings: {
    title: "Settings",
    profile: {
      title: "Profile",
      name: "Name",
      email: "Email",
      position: "Position",
      department: "Department",
      save: "Save Changes"
    },
    tabs: {
      profile: "Profile",
      notifications: "Notifications",
      appearance: "Appearance",
      security: "Security",
      language: "Language",
      advanced: "Advanced",
      account: "Account",
      system: "System",
      aiModels: "AI Models"
    },
    account: {
      title: "Account Management",
      subtitle: "Manage your account settings",
      username: "Username",
      language: "Interface Language",
      theme: "Theme",
      themes: {
        light: "Light",
        dark: "Dark",
        system: "System"
      }
    },
    language: {
      title: "Language",
      select: "Select Language",
      options: {
        en: "English",
        ru: "Russian",
        kk: "Kazakh"
      }
    },
    notifications: {
      title: "Notifications",
      emailNotifications: "Email Notifications",
      documentUpdates: "Document Updates",
      commentNotifications: "Comment Notifications",
      systemNotifications: "System Notifications"
    },
    theme: {
      title: "Theme",
      light: "Light",
      dark: "Dark",
      system: "System Default"
    }
  },
  
  // Agents
  agents: {
    title: "Agents",
    search: "Search agents...",
    status: {
      title: "Status",
      active: "Active",
      idle: "Idle",
      busy: "Busy",
      error: "Error",
      offline: "Offline"
    },
    actions: {
      start: "Start Agent",
      stop: "Stop Agent",
      restart: "Restart Agent",
      configure: "Configure"
    },
    details: {
      title: "Agent Details",
      description: "Description",
      status: "Current Status",
      lastActive: "Last Active",
      tasks: "Tasks Completed",
      uptime: "Uptime",
      logs: "Logs"
    },
    types: {
      documentParser: "Document Parser",
      termExtractor: "Term Extractor",
      knowledgeGraphBuilder: "Knowledge Graph Builder",
      semanticVerifier: "Semantic Verifier",
      consistencyChecker: "Consistency Checker",
      referenceResolver: "Reference Resolver"
    },
    monitoring: {
      title: "Agent Monitoring",
      performance: "Performance",
      memory: "Memory Usage",
      cpu: "CPU Usage",
      queue: "Task Queue"
    },
    noAgents: "No agents found"
  },
  
  // Versions
  versions: {
    title: "Version History",
    current: "Current Version",
    previous: "Previous Versions",
    created: "Created {{date}}",
    createdBy: "Created by {{email}}",
    compare: "Compare Versions",
    restore: "Restore This Version",
    difference: "Difference from Current",
    noVersions: "No previous versions found",
    selectDocument: "Select Document",
    selectDocumentPlaceholder: "Select a document to view versions",
    viewTimeline: "View Timeline",
    compareVersions: "Compare Versions",
    sourceVersion: "Source Version",
    targetVersion: "Target Version",
    selectSourceVersion: "Select source version",
    selectTargetVersion: "Select target version",
    selectBothVersions: "Select both versions to view differences",
    semantic: {
      analyzing: "Analyzing semantic differences...",
      error: "Error performing semantic comparison",
      tabs: {
        standard: "Standard",
        semantic: "Semantic",
        deontic: "Deontic Logic",
        definitions: "Definitions",
        references: "References"
      },
      overview: {
        title: "Semantic Analysis Overview",
        similarityScore: "Similarity Score",
        addedSections: "Added Sections",
        removedSections: "Removed Sections",
        modifiedSections: "Modified Sections"
      },
      changes: {
        title: "Semantic Changes",
        description: "Showing detailed semantic changes between versions",
        noChanges: "No semantic changes detected",
        type: {
          addition: "ADDED",
          removal: "REMOVED",
          modification: "MODIFIED"
        },
        severity: {
          critical: "CRITICAL",
          major: "MAJOR",
          minor: "MINOR",
          info: "INFO"
        },
        sourceVersion: "Source Version:",
        targetVersion: "Target Version:",
        addedContent: "Added Content:",
        removedContent: "Removed Content:"
      },
      deontic: {
        title: "Deontic Logic Analysis",
        obligations: "Obligations",
        rights: "Rights",
        permissions: "Permissions",
        prohibitions: "Prohibitions",
        noObligations: "No obligations found in either version",
        noRights: "No rights found in either version",
        noPermissions: "No permissions found in either version",
        noProhibitions: "No prohibitions found in either version",
        condition: "Condition:",
        unchanged: "UNCHANGED"
      },
      definitions: {
        title: "Term Definitions",
        description: "Changes in legal terms and their definitions",
        noDefinitions: "No definition changes detected",
        term: "Term",
        sourceDefinition: "Source Definition",
        targetDefinition: "Target Definition",
        change: "Change",
        similarity: "Similarity"
      },
      references: {
        title: "Legislative References",
        description: "Changes in references to other legislation",
        noReferences: "No reference changes detected",
        source: "Source:",
        target: "Target:"
      },
      comparison: {
        title: "Version Comparison",
        sideBy: "Side by Side",
        inline: "Inline Changes",
        structured: "Structured",
        element: "Element"
      }
    }
  },
  
  // Analytics
  analytics: {
    title: "Analytics",
    documentAnalytics: "Document Analytics",
    userActivity: "User Activity",
    systemPerformance: "System Performance",
    period: {
      day: "24 Hours",
      week: "7 Days",
      month: "30 Days",
      quarter: "3 Months",
      year: "12 Months"
    },
    metrics: {
      documentsCreated: "Documents Created",
      documentEdits: "Document Edits",
      verificationRuns: "Verification Runs",
      issuesFound: "Issues Found",
      issuesResolved: "Issues Resolved"
    }
  },
  
  // Errors
  errors: {
    general: "An error occurred",
    notFound: "Resource not found",
    unauthorized: "Unauthorized access",
    serverError: "Server error",
    networkError: "Network error",
    retry: "Retry",
    fileNotFound: "File not found",
    fileUploadFailed: "File upload failed",
    invalidForm: "Please check the form for errors"
  }
};