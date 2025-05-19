export default {
  common: {
    appName: "Юрисдикция",
    loading: "Жүктелуде...",
    error: "Қате орын алды",
    save: "Сақтау",
    cancel: "Болдырмау",
    delete: "Жою",
    edit: "Өңдеу",
    view: "Қарау",
    create: "Жасау",
    update: "Жаңарту",
    submit: "Жіберу",
    search: "Іздеу",
    filter: "Сүзгі",
    sort: "Сұрыптау",
    upload: "Жүктеу",
    download: "Жүктеп алу",
    noResults: "Нәтижелер табылмады",
    back: "Артқа",
    next: "Келесі",
    confirm: "Растау",
    actions: "Әрекеттер",
    status: {
      draft: "Жоба",
      pending: "Күтуде",
      review: "Қарастырылуда",
      approved: "Мақұлданды",
      published: "Жарияланды",
      rejected: "Қабылданбады",
      archived: "Мұрағатталған",
      all: "Барлық статустар"
    },
    dateFormat: {
      short: "DD.MM.YYYY",
      long: "YYYY 'ж.' D MMMM",
      time: "HH:mm"
    }
  },
  auth: {
    signIn: "Кіру",
    signOut: "Шығу",
    profile: "Профиль",
    settings: "Параметрлер"
  },
  navigation: {
    dashboard: "Басқару тақтасы",
    documents: "Құжаттар",
    verification: "Тексеру",
    knowledgeGraph: "Білім графигі",
    agents: "Агенттер",
    settings: "Параметрлер",
    analytics: "Талдау",
    help: "Көмек"
  },
  dashboard: {
    title: "Басқару тақтасы",
    subtitle: "Заңнамалық жүйеңіздің шолуы",
    welcome: "Қайта қош келдіңіз",
    cards: {
      documents: {
        title: "Құжаттар",
        subtitle: "Заңнамалық құжаттарды басқару"
      },
      activity: {
        title: "Соңғы әрекеттер",
        subtitle: "Жүйедегі соңғы әрекеттер",
        noActivity: "Жақында әрекеттер жоқ"
      },
      verification: {
        title: "Тексеру мәселелері",
        subtitle: "Тексеруді қажет ететін құжаттар",
        noIssues: "Тексеру мәселелері табылмады"
      },
      knowledge: {
        title: "Білім графигі",
        subtitle: "Құжаттар арасындағы байланыстарды зерттеу",
      },
      agents: {
        title: "Белсенді агенттер",
        subtitle: "Тапсырмаларды орындайтын ИИ агенттері",
        noAgents: "Белсенді агенттер табылмады"
      }
    }
  },
  documents: {
    title: "Құжаттар",
    subtitle: "Заңнамалық құжаттарды басқарыңыз және бірлесіп жұмыс істеңіз",
    actions: {
      newDocument: "Жаңа құжат",
      uploadDocument: "Құжат жүктеу",
      searchDocuments: "Құжаттарды іздеу...",
      filterByStatus: "Статус бойынша сүзу"
    },
    table: {
      title: "Атауы",
      status: "Статус",
      created: "Құрылған",
      modified: "Соңғы өзгерту",
      author: "Автор",
      version: "Нұсқа"
    },
    form: {
      title: "Атауы",
      titlePlaceholder: "Құжат атауын енгізіңіз",
      description: "Сипаттама",
      descriptionPlaceholder: "Құжат сипаттамасын енгізіңіз",
      status: "Статус",
      submit: "Құжат жасау",
      cancel: "Болдырмау"
    },
    details: {
      title: "Құжат мәліметтері",
      versions: "Нұсқалар",
      metadata: "Метадеректер",
      relatedDocuments: "Байланысты құжаттар",
      verification: "Тексеру күйі"
    },
    editor: {
      title: "Құжат редакторы",
      save: "Өзгерістерді сақтау",
      history: "Нұсқалар тарихы",
      compare: "Нұсқаларды салыстыру",
      preview: "Алдын ала қарау",
      comments: "Пікірлер"
    },
    messages: {
      createSuccess: "Құжат сәтті құрылды",
      updateSuccess: "Құжат сәтті жаңартылды",
      deleteSuccess: "Құжат сәтті жойылды",
      createError: "Құжатты жасау кезінде қате",
      updateError: "Құжатты жаңарту кезінде қате",
      deleteError: "Құжатты жою кезінде қате"
    },
    noDocuments: "Құжаттар табылмады",
    emptyState: {
      title: "Құжаттар әлі жоқ",
      description: "Бастау үшін алғашқы құжатыңызды жасаңыз",
      action: "Құжат жасау"
    },
    upload: {
      title: "Құжат жүктеу",
      instructions: "Файлды сүйреп әкеліңіз немесе шолу үшін басыңыз",
      supportedFormats: "Қолдау көрсетілетін форматтар: .docx, .pdf, .xml",
      uploading: "Жүктелуде...",
      success: "Жүктеу сәтті аяқталды",
      error: "Жүктеу сәтсіз аяқталды",
      retry: "Қайта жүктеу"
    }
  },
  verification: {
    title: "Тексеру",
    subtitle: "Заңнамалық құжаттарды үйлесімділік пен сәйкестікке тексеру",
    filters: {
      all: "Барлық мәселелер",
      critical: "Маңызды",
      major: "Негізгі",
      minor: "Елеусіз",
      resolved: "Шешілген"
    },
    table: {
      document: "Құжат",
      issue: "Мәселе",
      severity: "Маңыздылық",
      status: "Статус",
      location: "Орналасуы",
      detected: "Анықталған"
    },
    details: {
      title: "Мәселе мәліметтері",
      description: "Сипаттама",
      context: "Контекст",
      conflictingReference: "Қайшылықты сілтеме",
      resolution: "Шешім",
      actions: {
        markAsResolved: "Шешілген деп белгілеу",
        reopenIssue: "Мәселені қайта ашу",
        assignTo: "Тағайындау"
      }
    },
    noIssues: "Тексеру мәселелері табылмады",
    emptyState: {
      title: "Тексеру мәселелері жоқ",
      description: "Барлық құжаттар тексеруден өтті",
      action: "Құжаттарды тексеру"
    }
  },
  knowledgeGraph: {
    title: "Білім графигі",
    subtitle: "Заңнамалық құжаттар арасындағы байланыстарды зерттеу",
    actions: {
      zoom: "Масштаб",
      filter: "График сүзгісі",
      layout: "Орналасуды өзгерту",
      export: "Графикті экспорттау",
      search: "Объектілерді іздеу",
      focus: "Таңдалғанға назар аудару"
    },
    legend: {
      title: "Шартты белгілер",
      document: "Құжат",
      term: "Заңдық термин",
      concept: "Тұжырымдама",
      entity: "Объект",
      relation: "Қатынас"
    },
    details: {
      title: "Объект мәліметтері",
      type: "Түрі",
      connections: "Байланыстар",
      documents: "Сілтеме берілген құжаттар"
    },
    stats: {
      title: "График статистикасы",
      nodes: "Барлық түйіндер",
      edges: "Барлық байланыстар",
      clusters: "Кластерлер",
      density: "График тығыздығы"
    },
    search: {
      placeholder: "Объектілерді іздеу...",
      noResults: "Объектілер табылмады"
    },
    emptyState: {
      title: "Білім графигі бос",
      description: "Білім графигін толтыру үшін құжаттар қосыңыз",
      action: "Құжаттар қосу"
    }
  },
  agents: {
    title: "Агенттер",
    subtitle: "Заңнамалық құжаттарды талдайтын ИИ агенттерін басқару",
    list: {
      name: "Аты",
      status: "Күйі",
      type: "Түрі",
      lastActive: "Соңғы белсенділік",
      documents: "Құжаттар",
      tasks: "Тапсырмалар"
    },
    status: {
      active: "Белсенді",
      idle: "Бос",
      processing: "Өңделуде",
      error: "Қате",
      offline: "Желіден тыс"
    },
    details: {
      title: "Агент мәліметтері",
      description: "Сипаттама",
      capabilities: "Мүмкіндіктер",
      metrics: "Өнімділік көрсеткіштері",
      logs: "Әрекет журналдары",
      configuration: "Конфигурация"
    },
    actions: {
      start: "Агентті бастау",
      stop: "Агентті тоқтату",
      restart: "Агентті қайта бастау",
      configure: "Агентті конфигурациялау",
      viewLogs: "Журналдарды қарау"
    },
    types: {
      parser: "Құжат талдағышы",
      validator: "Тексеруші",
      analyzer: "Семантикалық талдағыш",
      classifier: "Құжат жіктеуіші",
      extractor: "Объект шығарғыш",
      comparator: "Құжат салыстырғыш",
      termAlignment: "Терминдерді түзету"
    },
    noAgents: "Агенттер табылмады",
    emptyState: {
      title: "Агенттер конфигурацияланбаған",
      description: "Құжаттарды талдау үшін агенттерді конфигурациялаңыз",
      action: "Агенттерді конфигурациялау"
    }
  },
  settings: {
    title: "Параметрлер",
    subtitle: "Қолданба параметрлерін конфигурациялау",
    sections: {
      general: "Жалпы",
      account: "Тіркелгі",
      notifications: "Хабарландырулар",
      system: "Жүйе",
      integrations: "Интеграциялар",
      appearance: "Сыртқы түрі",
      advanced: "Кеңейтілген"
    },
    language: {
      title: "Тіл",
      description: "Қолданба интерфейсінің тілін өзгерту",
      languages: {
        en: "English",
        ru: "Русский",
        kk: "Қазақша"
      }
    },
    theme: {
      title: "Тақырып",
      description: "Қалаған түс тақырыбын таңдаңыз",
      options: {
        light: "Жарық",
        dark: "Қараңғы",
        system: "Жүйелік"
      }
    },
    account: {
      title: "Тіркелгі ақпараты",
      email: "Эл. пошта",
      name: "Аты",
      role: "Рөл",
      organization: "Ұйым",
      changePassword: "Құпия сөзді өзгерту"
    },
    notifications: {
      title: "Хабарландыру параметрлері",
      email: "Эл. пошта хабарландырулары",
      push: "Push-хабарландырулар",
      digest: "Күнделікті дайджест",
      mentions: "Айтылымдар және пікірлер"
    },
    system: {
      title: "Жүйе параметрлері",
      dateFormat: "Күн форматы",
      timeZone: "Уақыт белдеуі",
      accessibility: "Қол жетімділік опциялары"
    },
    integrations: {
      title: "Интеграциялар",
      connectedServices: "Қосылған қызметтер",
      apiKeys: "API кілттері",
      webhooks: "Вебхуктар"
    },
    save: "Параметрлерді сақтау",
    cancel: "Өзгерістерден бас тарту",
    messages: {
      saveSuccess: "Параметрлер сәтті сақталды",
      saveError: "Параметрлерді сақтау кезінде қате"
    }
  }
};