export default {
  // Common
  common: {
    loading: "Жүктелуде...",
    noResults: "Нәтиже табылмады",
    cancel: "Болдырмау",
    save: "Сақтау",
    delete: "Жою",
    edit: "Өңдеу",
    view: "Қарау",
    download: "Жүктеп алу",
    upload: "Жүктеу",
    search: "Іздеу",
    creating: "Құрылуда...",
    saving: "Сақталуда...",
    deleting: "Жойылуда...",
    close: "Жабу",
    confirm: "Растау",
    yes: "Иә",
    no: "Жоқ",
    sort: "Сұрыптау",
    status: {
      all: "Барлық күйлер",
      draft: "Жоба",
      review: "Қаралуда",
      approved: "Бекітілген",
      active: "Белсенді",
      archived: "Мұрағатталған",
      rejected: "Қабылданбаған"
    }
  },

  // Navigation
  nav: {
    home: "Басты бет",
    documents: "Құжаттар",
    versions: "Нұсқалар",
    knowledgeGraph: "Білім базасы",
    verification: "Тексеру",
    settings: "Параметрлер",
    agents: "Агенттер",
    terminology: "Терминология",
    terminologyDescription: "Заңды терминдер глоссарийін басқару",
    logout: "Шығу"
  },

  // App
  app: {
    title: "Юрисдикция",
    search: "Іздеу...",
    welcome: "Юрисдикция жүйесіне қош келдіңіз",
    description: "Заңнамалық құжаттарды басқару платформасы"
  },

  // Home
  home: {
    title: "Басқару тақтасы",
    recentDocuments: "Соңғы құжаттар",
    recentActivity: "Соңғы әрекеттер",
    quickAccess: "Жылдам қол жетімділік",
    statistics: "Статистика",
    viewAll: "Барлығын қарау",
    welcomeMessage: "Қайта оралуыңызбен, {{name}}!",
    overviewTitle: "Құжаттар шолуы",
    totalDocuments: "Барлық құжаттар",
    documentsInReview: "Қаралуда",
    approvedDocuments: "Бекітілген құжаттар",
    documentsWithIssues: "Мәселелері бар құжаттар"
  },

  // Documents
  documents: {
    title: "Құжаттар",
    subtitle: "Заңнамалық құжаттарды басқару",
    searchPlaceholder: "Құжаттарды іздеу...",
    filterByStatus: "Күй бойынша сүзу",
    filterByDate: "Күні бойынша сүзу",
    sortBy: "Сұрыптау",
    view: {
      list: "Тізім көрінісі",
      grid: "Тор көрінісі"
    },
    columns: {
      title: "Атауы",
      status: "Күйі",
      date: "Құрылған күні",
      version: "Нұсқасы",
      actions: "Әрекеттер"
    },
    table: {
      title: "Атауы",
      status: "Күйі",
      modified: "Соңғы өзгеріс"
    },
    actions: {
      searchDocuments: "Құжаттарды іздеу",
      newDocument: "Жаңа құжат құру",
      upload: "Құжатты жүктеу",
      export: "Экспорттау",
      compare: "Салыстыру",
      archive: "Мұрағаттау"
    },
    form: {
      title: "Атауы",
      titlePlaceholder: "мысалы, Азаматтық кодекске 2025 жылғы өзгерістер",
      description: "Сипаттама",
      descriptionPlaceholder: "Бұл құжаттың мақсатын қысқаша сипаттаңыз...",
      status: "Күйі",
      submit: "Құжат құру",
      update: "Құжатты жаңарту"
    },
    noDocuments: "Құжаттар табылмады",
    emptyState: {
      title: "Құжаттар табылмады",
      description: "Жұмысты бастау үшін алғашқы құжатыңызды құрыңыз"
    },
    deleteConfirm: "Бұл құжатты шынымен жойғыңыз келе ме? Бұл әрекетті болдырмау мүмкін емес."
  },

  // Document Editor
  editor: {
    title: "Құжат редакторы",
    save: "Өзгерістерді сақтау",
    saveAndPublish: "Сақтау және жариялау",
    publish: "Жариялау",
    discard: "Өзгерістерден бас тарту",
    preview: "Алдын ала қарау",
    history: "Тарих",
    versions: "Нұсқалар",
    comments: "Пікірлер",
    formatting: "Пішімдеу",
    addComment: "Пікір қосу",
    resolveComment: "Шешу",
    autoSaved: "{{time}} автоматты түрде сақталды",
    unsavedChanges: "Сақталмаған өзгерістер бар",
    versionCreated: "{{number}} нұсқасы құрылды",
    sections: {
      add: "Бөлім қосу",
      edit: "Бөлімді өңдеу",
      delete: "Бөлімді жою"
    }
  },

  // Verification
  verification: {
    title: "Тексеру",
    runVerification: "Тексеруді іске қосу",
    lastRun: "Соңғы іске қосу: {{date}}",
    status: {
      passed: "Өтті",
      failed: "Сәтсіз",
      warning: "Ескерту",
      running: "Орындалуда",
      pending: "Күтілуде"
    },
    issues: {
      critical: "Маңызды мәселелер",
      major: "Елеулі мәселелер",
      minor: "Шағын мәселелер",
      info: "Ақпарат"
    },
    filters: {
      all: "Барлық мәселелер",
      open: "Ашық мәселелер",
      resolved: "Шешілген мәселелер"
    },
    noIssues: "Мәселелер табылмады",
    resolveIssue: "Шешілген деп белгілеу",
    reopenIssue: "Мәселені қайта ашу"
  },
  
  // Knowledge Graph
  knowledgeGraph: {
    title: "Білім базасы",
    nodeTypes: "Түйін түрлері",
    edgeTypes: "Байланыс түрлері",
    findConnections: "Байланыстарды табу",
    exportGraph: "Графті экспорттау",
    focusNode: "Түйінге назар аудару",
    expand: "Түйінді кеңейту",
    collapse: "Түйінді жию",
    showDetails: "Мәліметтерді көрсету",
    hideDetails: "Мәліметтерді жасыру",
    statistics: {
      title: "Граф статистикасы",
      nodes: "Барлық түйіндер",
      edges: "Барлық байланыстар",
      documents: "Құжаттар",
      terms: "Заңды терминдер",
      entities: "Нысандар"
    },
    search: {
      placeholder: "Графті іздеу...",
      results: "{{count}} нәтиже табылды",
      noResults: "Нәтиже табылмады"
    },
    filters: {
      title: "Сүзгілер",
      showNodes: "Түйіндерді көрсету",
      showEdges: "Байланыстарды көрсету",
      reset: "Сүзгілерді қалпына келтіру"
    }
  },

  // Settings
  settings: {
    title: "Параметрлер",
    profile: {
      title: "Профиль",
      name: "Аты",
      email: "Эл. пошта",
      position: "Лауазым",
      department: "Бөлім",
      save: "Өзгерістерді сақтау"
    },
    tabs: {
      profile: "Профиль",
      notifications: "Хабарландырулар",
      appearance: "Сыртқы көрініс",
      security: "Қауіпсіздік",
      language: "Тіл",
      advanced: "Кеңейтілген",
      account: "Аккаунт",
      system: "Жүйе",
      aiModels: "AI модельдері"
    },
    account: {
      title: "Аккаунтты басқару",
      subtitle: "Аккаунт параметрлерін басқару",
      username: "Пайдаланушы аты",
      language: "Интерфейс тілі",
      theme: "Тақырып",
      themes: {
        light: "Жарық",
        dark: "Қараңғы",
        system: "Жүйелік"
      }
    },
    language: {
      title: "Тіл",
      select: "Тілді таңдаңыз",
      options: {
        en: "Ағылшын",
        ru: "Орыс",
        kk: "Қазақ"
      }
    },
    notifications: {
      title: "Хабарландырулар",
      emailNotifications: "Эл. пошта хабарландырулары",
      documentUpdates: "Құжат жаңартулары",
      commentNotifications: "Пікір хабарландырулары",
      systemNotifications: "Жүйелік хабарландырулар"
    },
    theme: {
      title: "Тақырып",
      light: "Жарық",
      dark: "Қараңғы",
      system: "Жүйелік"
    }
  },
  
  // Agents
  agents: {
    title: "Агенттер",
    search: "Агенттерді іздеу...",
    status: {
      title: "Күйі",
      active: "Белсенді",
      idle: "Күту режимінде",
      busy: "Бос емес",
      error: "Қате",
      offline: "Желіден тыс"
    },
    actions: {
      start: "Агентті іске қосу",
      stop: "Агентті тоқтату",
      restart: "Агентті қайта іске қосу",
      configure: "Баптау"
    },
    details: {
      title: "Агент мәліметтері",
      description: "Сипаттама",
      status: "Ағымдағы күйі",
      lastActive: "Соңғы белсенділік",
      tasks: "Орындалған тапсырмалар",
      uptime: "Жұмыс уақыты",
      logs: "Журналдар"
    },
    types: {
      documentParser: "Құжат талдаушы",
      termExtractor: "Терминдерді шығару құралы",
      knowledgeGraphBuilder: "Білім базасы құрастырушы",
      semanticVerifier: "Семантикалық тексеруші",
      consistencyChecker: "Сәйкестік тексеруші",
      referenceResolver: "Сілтемелерді шешуші"
    },
    monitoring: {
      title: "Агенттерді бақылау",
      performance: "Өнімділік",
      memory: "Жад қолданысы",
      cpu: "Процессор қолданысы",
      queue: "Тапсырмалар кезегі"
    },
    noAgents: "Агенттер табылмады"
  },
  
  // Versions
  versions: {
    title: "Нұсқалар тарихы",
    current: "Ағымдағы нұсқа",
    previous: "Алдыңғы нұсқалар",
    created: "Құрылған күні {{date}}",
    createdBy: "{{email}} құрған",
    compare: "Нұсқаларды салыстыру",
    restore: "Осы нұсқаны қалпына келтіру",
    difference: "Ағымдағы нұсқадан айырмашылық",
    noVersions: "Алдыңғы нұсқалар табылмады",
    selectDocument: "Құжатты таңдау",
    selectDocumentPlaceholder: "Нұсқаларды көру үшін құжатты таңдаңыз",
    viewTimeline: "Хронологияны көру",
    compareVersions: "Нұсқаларды салыстыру",
    sourceVersion: "Бастапқы нұсқа",
    targetVersion: "Мақсатты нұсқа",
    selectSourceVersion: "Бастапқы нұсқаны таңдаңыз",
    selectTargetVersion: "Мақсатты нұсқаны таңдаңыз",
    selectBothVersions: "Айырмашылықтарды көру үшін екі нұсқаны таңдаңыз",
    semantic: {
      analyzing: "Семантикалық айырмашылықтарды талдау...",
      error: "Семантикалық салыстыруда қате орын алды",
      tabs: {
        standard: "Стандартты",
        semantic: "Семантикалық",
        deontic: "Деонтикалық логика",
        definitions: "Анықтамалар",
        references: "Сілтемелер"
      },
      overview: {
        title: "Семантикалық талдау шолуы",
        similarityScore: "Ұқсастық көрсеткіші",
        addedSections: "Қосылған бөлімдер",
        removedSections: "Жойылған бөлімдер",
        modifiedSections: "Өзгертілген бөлімдер"
      },
      changes: {
        title: "Семантикалық өзгерістер",
        description: "Нұсқалар арасындағы егжей-тегжейлі семантикалық өзгерістер",
        noChanges: "Семантикалық өзгерістер табылмады",
        type: {
          addition: "ҚОСЫЛҒАН",
          removal: "ЖОЙЫЛҒАН",
          modification: "ӨЗГЕРТІЛГЕН"
        },
        severity: {
          critical: "МАҢЫЗДЫ",
          major: "ЕЛЕУЛІ",
          minor: "ШАҒЫН",
          info: "АҚПАРАТ"
        },
        sourceVersion: "Бастапқы нұсқа:",
        targetVersion: "Мақсатты нұсқа:",
        addedContent: "Қосылған мазмұн:",
        removedContent: "Жойылған мазмұн:"
      },
      deontic: {
        title: "Деонтикалық логика талдауы",
        obligations: "Міндеттемелер",
        rights: "Құқықтар",
        permissions: "Рұқсаттар",
        prohibitions: "Тыйымдар",
        noObligations: "Міндеттемелер екі нұсқада да табылмады",
        noRights: "Құқықтар екі нұсқада да табылмады",
        noPermissions: "Рұқсаттар екі нұсқада да табылмады",
        noProhibitions: "Тыйымдар екі нұсқада да табылмады",
        condition: "Шарт:",
        unchanged: "ӨЗГЕРМЕГЕН"
      },
      definitions: {
        title: "Терминдер анықтамалары",
        description: "Заңды терминдер мен олардың анықтамаларындағы өзгерістер",
        noDefinitions: "Анықтамалардағы өзгерістер табылмады",
        term: "Термин",
        sourceDefinition: "Бастапқы анықтама",
        targetDefinition: "Мақсатты анықтама",
        change: "Өзгеріс",
        similarity: "Ұқсастық"
      },
      references: {
        title: "Заңнамалық сілтемелер",
        description: "Басқа заңнамалық актілерге сілтемелердегі өзгерістер",
        noReferences: "Сілтемелердегі өзгерістер табылмады",
        source: "Бастапқы:",
        target: "Мақсатты:"
      },
      comparison: {
        title: "Нұсқаларды салыстыру",
        sideBy: "Қатар көрініс",
        inline: "Енгізілген өзгерістер",
        structured: "Құрылымдық",
        element: "Элемент"
      }
    }
  },
  
  // Analytics
  analytics: {
    title: "Аналитика",
    documentAnalytics: "Құжаттар аналитикасы",
    userActivity: "Пайдаланушы белсенділігі",
    systemPerformance: "Жүйе өнімділігі",
    period: {
      day: "24 сағат",
      week: "7 күн",
      month: "30 күн",
      quarter: "3 ай",
      year: "12 ай"
    },
    metrics: {
      documentsCreated: "Құрылған құжаттар",
      documentEdits: "Құжат өңдеулері",
      verificationRuns: "Тексеру іске қосулары",
      issuesFound: "Табылған мәселелер",
      issuesResolved: "Шешілген мәселелер"
    }
  },
  
  // Errors
  errors: {
    general: "Қате орын алды",
    notFound: "Ресурс табылмады",
    unauthorized: "Рұқсатсыз қол жетімділік",
    serverError: "Сервер қатесі",
    networkError: "Желі қатесі",
    retry: "Қайталау",
    fileNotFound: "Файл табылмады",
    fileUploadFailed: "Файлды жүктеу сәтсіз аяқталды",
    invalidForm: "Формадағы қателерді тексеріңіз"
  }
};