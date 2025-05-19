export default {
  common: {
    appName: "Jurisdiction",
    loading: "Loading...",
    error: "An error occurred",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    create: "Create",
    update: "Update",
    submit: "Submit",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    upload: "Upload",
    download: "Download",
    noResults: "No results found",
    back: "Back",
    next: "Next",
    confirm: "Confirm",
    actions: "Actions",
    status: {
      draft: "Draft",
      pending: "Pending",
      review: "In Review",
      approved: "Approved",
      published: "Published",
      rejected: "Rejected",
      archived: "Archived",
      all: "All Statuses"
    },
    dateFormat: {
      short: "MM/DD/YYYY",
      long: "MMMM D, YYYY",
      time: "h:mm A"
    }
  },
  auth: {
    signIn: "Sign In",
    signOut: "Sign Out",
    profile: "Profile",
    settings: "Settings"
  },
  navigation: {
    dashboard: "Dashboard",
    documents: "Documents",
    verification: "Verification",
    knowledgeGraph: "Knowledge Graph",
    agents: "Agents",
    settings: "Settings",
    analytics: "Analytics",
    help: "Help"
  },
  dashboard: {
    title: "Dashboard",
    subtitle: "Overview of your legislative system",
    welcome: "Welcome back",
    cards: {
      documents: {
        title: "Documents",
        subtitle: "Manage your legislative documents"
      },
      activity: {
        title: "Recent Activity",
        subtitle: "Latest activities in the system",
        noActivity: "No recent activity"
      },
      verification: {
        title: "Verification Issues",
        subtitle: "Documents requiring review",
        noIssues: "No verification issues found"
      },
      knowledge: {
        title: "Knowledge Graph",
        subtitle: "Explore document relationships",
      },
      agents: {
        title: "Active Agents",
        subtitle: "AI agents performing tasks",
        noAgents: "No active agents found"
      }
    }
  },
  documents: {
    title: "Documents",
    subtitle: "Manage and collaborate on your legislative documents",
    actions: {
      newDocument: "New Document",
      uploadDocument: "Upload Document",
      searchDocuments: "Search documents...",
      filterByStatus: "Filter by status"
    },
    table: {
      title: "Title",
      status: "Status",
      created: "Created",
      modified: "Last Modified",
      author: "Author",
      version: "Version"
    },
    form: {
      title: "Title",
      titlePlaceholder: "Enter document title",
      description: "Description",
      descriptionPlaceholder: "Enter document description",
      status: "Status",
      submit: "Create Document",
      cancel: "Cancel"
    },
    details: {
      title: "Document Details",
      versions: "Versions",
      metadata: "Metadata",
      relatedDocuments: "Related Documents",
      verification: "Verification Status"
    },
    editor: {
      title: "Document Editor",
      save: "Save Changes",
      history: "Version History",
      compare: "Compare Versions",
      preview: "Preview",
      comments: "Comments"
    },
    messages: {
      createSuccess: "Document created successfully",
      updateSuccess: "Document updated successfully",
      deleteSuccess: "Document deleted successfully",
      createError: "Failed to create document",
      updateError: "Failed to update document",
      deleteError: "Failed to delete document"
    },
    noDocuments: "No documents found",
    emptyState: {
      title: "No documents yet",
      description: "Create your first document to get started",
      action: "Create Document"
    },
    upload: {
      title: "Upload Document",
      instructions: "Drag and drop a file or click to browse",
      supportedFormats: "Supported formats: .docx, .pdf, .xml",
      uploading: "Uploading...",
      success: "Upload successful",
      error: "Upload failed",
      retry: "Retry Upload"
    }
  },
  verification: {
    title: "Verification",
    subtitle: "Verify legislative documents for consistency and compliance",
    filters: {
      all: "All Issues",
      critical: "Critical",
      major: "Major",
      minor: "Minor",
      resolved: "Resolved"
    },
    table: {
      document: "Document",
      issue: "Issue",
      severity: "Severity",
      status: "Status",
      location: "Location",
      detected: "Detected"
    },
    details: {
      title: "Issue Details",
      description: "Description",
      context: "Context",
      conflictingReference: "Conflicting Reference",
      resolution: "Resolution",
      actions: {
        markAsResolved: "Mark as Resolved",
        reopenIssue: "Reopen Issue",
        assignTo: "Assign To"
      }
    },
    noIssues: "No verification issues found",
    emptyState: {
      title: "No verification issues",
      description: "All documents have passed verification",
      action: "Verify Documents"
    }
  },
  knowledgeGraph: {
    title: "Knowledge Graph",
    subtitle: "Explore relationships between legislative documents",
    actions: {
      zoom: "Zoom",
      filter: "Filter Graph",
      layout: "Change Layout",
      export: "Export Graph",
      search: "Search Entities",
      focus: "Focus on Selection"
    },
    legend: {
      title: "Legend",
      document: "Document",
      term: "Legal Term",
      concept: "Concept",
      entity: "Entity",
      relation: "Relation"
    },
    details: {
      title: "Entity Details",
      type: "Type",
      connections: "Connections",
      documents: "Referenced Documents"
    },
    stats: {
      title: "Graph Statistics",
      nodes: "Total Nodes",
      edges: "Total Connections",
      clusters: "Clusters",
      density: "Graph Density"
    },
    search: {
      placeholder: "Search entities...",
      noResults: "No entities found"
    },
    emptyState: {
      title: "Knowledge graph is empty",
      description: "Add documents to populate the knowledge graph",
      action: "Add Documents"
    }
  },
  agents: {
    title: "Agents",
    subtitle: "Manage AI agents analyzing your legislative documents",
    list: {
      name: "Name",
      status: "Status",
      type: "Type",
      lastActive: "Last Active",
      documents: "Documents",
      tasks: "Tasks"
    },
    status: {
      active: "Active",
      idle: "Idle",
      processing: "Processing",
      error: "Error",
      offline: "Offline"
    },
    details: {
      title: "Agent Details",
      description: "Description",
      capabilities: "Capabilities",
      metrics: "Performance Metrics",
      logs: "Activity Logs",
      configuration: "Configuration"
    },
    actions: {
      start: "Start Agent",
      stop: "Stop Agent",
      restart: "Restart Agent",
      configure: "Configure Agent",
      viewLogs: "View Logs"
    },
    types: {
      parser: "Document Parser",
      validator: "Validator",
      analyzer: "Semantic Analyzer",
      classifier: "Document Classifier",
      extractor: "Entity Extractor",
      comparator: "Document Comparator",
      termAlignment: "Term Alignment"
    },
    noAgents: "No agents found",
    emptyState: {
      title: "No agents configured",
      description: "Configure agents to analyze documents",
      action: "Configure Agents"
    }
  },
  settings: {
    title: "Settings",
    subtitle: "Configure your application preferences",
    sections: {
      general: "General",
      account: "Account",
      notifications: "Notifications",
      system: "System",
      integrations: "Integrations",
      appearance: "Appearance",
      advanced: "Advanced"
    },
    language: {
      title: "Language",
      description: "Change the language of the application interface",
      languages: {
        en: "English",
        ru: "Русский",
        kk: "Қазақша"
      }
    },
    theme: {
      title: "Theme",
      description: "Choose your preferred color theme",
      options: {
        light: "Light",
        dark: "Dark",
        system: "System"
      }
    },
    account: {
      title: "Account Information",
      email: "Email",
      name: "Name",
      role: "Role",
      organization: "Organization",
      changePassword: "Change Password"
    },
    notifications: {
      title: "Notification Preferences",
      email: "Email Notifications",
      push: "Push Notifications",
      digest: "Daily Digest",
      mentions: "Mentions and Comments"
    },
    system: {
      title: "System Settings",
      dateFormat: "Date Format",
      timeZone: "Time Zone",
      accessibility: "Accessibility Options"
    },
    integrations: {
      title: "Integrations",
      connectedServices: "Connected Services",
      apiKeys: "API Keys",
      webhooks: "Webhooks"
    },
    save: "Save Settings",
    cancel: "Cancel Changes",
    messages: {
      saveSuccess: "Settings saved successfully",
      saveError: "Failed to save settings"
    }
  }
};