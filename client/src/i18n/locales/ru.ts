export default {
  // Common
  common: {
    loading: "Загрузка...",
    noResults: "Результаты не найдены",
    cancel: "Отмена",
    save: "Сохранить",
    delete: "Удалить",
    edit: "Редактировать",
    view: "Просмотр",
    download: "Скачать",
    upload: "Загрузить",
    search: "Поиск",
    creating: "Создание...",
    saving: "Сохранение...",
    deleting: "Удаление...",
    close: "Закрыть",
    confirm: "Подтвердить",
    yes: "Да",
    no: "Нет",
    status: {
      draft: "Черновик",
      review: "На рассмотрении",
      approved: "Утверждено",
      active: "Активно",
      archived: "В архиве",
      rejected: "Отклонено"
    }
  },

  // Navigation
  nav: {
    home: "Главная",
    documents: "Документы",
    versions: "Версии",
    knowledgeGraph: "База знаний",
    verification: "Проверка",
    settings: "Настройки",
    agents: "Агенты",
    terminology: "Терминология",
    terminologyDescription: "Управление глоссарием юридических терминов",
    logout: "Выйти"
  },

  // App
  app: {
    title: "Юрисдикция",
    search: "Поиск...",
    welcome: "Добро пожаловать в Юрисдикцию",
    description: "Платформа управления юридическими документами"
  },

  // Home
  home: {
    title: "Панель управления",
    recentDocuments: "Недавние документы",
    recentActivity: "Недавняя активность",
    quickAccess: "Быстрый доступ",
    statistics: "Статистика",
    viewAll: "Просмотреть все",
    welcomeMessage: "С возвращением, {{name}}!",
    overviewTitle: "Обзор ваших документов",
    totalDocuments: "Всего документов",
    documentsInReview: "На рассмотрении",
    approvedDocuments: "Утвержденные документы",
    documentsWithIssues: "Документы с проблемами"
  },

  // Documents
  documents: {
    title: "Документы",
    searchPlaceholder: "Поиск документов...",
    filterByStatus: "Фильтр по статусу",
    filterByDate: "Фильтр по дате",
    sortBy: "Сортировать по",
    view: {
      list: "В виде списка",
      grid: "В виде сетки"
    },
    columns: {
      title: "Название",
      status: "Статус",
      date: "Дата создания",
      version: "Версия",
      actions: "Действия"
    },
    actions: {
      newDocument: "Создать новый документ",
      upload: "Загрузить документ",
      export: "Экспорт",
      compare: "Сравнить",
      archive: "Архивировать"
    },
    form: {
      title: "Название",
      titlePlaceholder: "например, Поправка к Гражданскому кодексу 2025",
      description: "Описание",
      descriptionPlaceholder: "Кратко опишите цель этого документа...",
      status: "Статус",
      submit: "Создать документ",
      update: "Обновить документ"
    },
    noDocuments: "Документы не найдены",
    emptyState: {
      title: "Документы не найдены",
      description: "Создайте ваш первый документ, чтобы начать работу"
    },
    deleteConfirm: "Вы уверены, что хотите удалить этот документ? Это действие нельзя будет отменить."
  },

  // Document Editor
  editor: {
    title: "Редактор документов",
    save: "Сохранить изменения",
    saveAndPublish: "Сохранить и опубликовать",
    publish: "Опубликовать",
    discard: "Отменить изменения",
    preview: "Предпросмотр",
    history: "История",
    versions: "Версии",
    comments: "Комментарии",
    formatting: "Форматирование",
    addComment: "Добавить комментарий",
    resolveComment: "Решить",
    autoSaved: "Автосохранение в {{time}}",
    unsavedChanges: "У вас есть несохраненные изменения",
    versionCreated: "Версия {{number}} создана",
    sections: {
      add: "Добавить раздел",
      edit: "Редактировать раздел",
      delete: "Удалить раздел"
    }
  },

  // Verification
  verification: {
    title: "Проверка",
    runVerification: "Запустить проверку",
    lastRun: "Последний запуск: {{date}}",
    status: {
      passed: "Пройдено",
      failed: "Не пройдено",
      warning: "Предупреждение",
      running: "В процессе",
      pending: "Ожидание"
    },
    issues: {
      critical: "Критические проблемы",
      major: "Серьезные проблемы",
      minor: "Незначительные проблемы",
      info: "Информация"
    },
    filters: {
      all: "Все проблемы",
      open: "Открытые проблемы",
      resolved: "Решенные проблемы"
    },
    noIssues: "Проблемы не найдены",
    resolveIssue: "Отметить как решенную",
    reopenIssue: "Переоткрыть проблему"
  },
  
  // Knowledge Graph
  knowledgeGraph: {
    title: "База знаний",
    nodeTypes: "Типы узлов",
    edgeTypes: "Типы связей",
    findConnections: "Найти связи",
    exportGraph: "Экспорт графа",
    focusNode: "Фокус на узле",
    expand: "Расширить узел",
    collapse: "Свернуть узел",
    showDetails: "Показать детали",
    hideDetails: "Скрыть детали",
    statistics: {
      title: "Статистика графа",
      nodes: "Всего узлов",
      edges: "Всего связей",
      documents: "Документы",
      terms: "Юридические термины",
      entities: "Сущности"
    },
    search: {
      placeholder: "Поиск по графу...",
      results: "Найдено {{count}} результатов",
      noResults: "Результаты не найдены"
    },
    filters: {
      title: "Фильтры",
      showNodes: "Показать узлы",
      showEdges: "Показать связи",
      reset: "Сбросить фильтры"
    }
  },

  // Settings
  settings: {
    title: "Настройки",
    profile: {
      title: "Профиль",
      name: "Имя",
      email: "Эл. почта",
      position: "Должность",
      department: "Отдел",
      save: "Сохранить изменения"
    },
    tabs: {
      profile: "Профиль",
      notifications: "Уведомления",
      appearance: "Внешний вид",
      security: "Безопасность",
      language: "Язык",
      advanced: "Расширенные"
    },
    language: {
      title: "Язык",
      select: "Выберите язык",
      options: {
        en: "Английский",
        ru: "Русский",
        kk: "Казахский"
      }
    },
    notifications: {
      title: "Уведомления",
      emailNotifications: "Уведомления по эл. почте",
      documentUpdates: "Обновления документов",
      commentNotifications: "Уведомления о комментариях",
      systemNotifications: "Системные уведомления"
    },
    theme: {
      title: "Тема",
      light: "Светлая",
      dark: "Темная",
      system: "Системная"
    }
  },
  
  // Agents
  agents: {
    title: "Агенты",
    search: "Поиск агентов...",
    status: {
      title: "Статус",
      active: "Активен",
      idle: "В ожидании",
      busy: "Занят",
      error: "Ошибка",
      offline: "Офлайн"
    },
    actions: {
      start: "Запустить агента",
      stop: "Остановить агента",
      restart: "Перезапустить агента",
      configure: "Настроить"
    },
    details: {
      title: "Детали агента",
      description: "Описание",
      status: "Текущий статус",
      lastActive: "Последняя активность",
      tasks: "Выполненные задачи",
      uptime: "Время работы",
      logs: "Логи"
    },
    types: {
      documentParser: "Анализатор документов",
      termExtractor: "Экстрактор терминов",
      knowledgeGraphBuilder: "Построитель графа знаний",
      semanticVerifier: "Семантический верификатор",
      consistencyChecker: "Проверка согласованности",
      referenceResolver: "Обработчик ссылок"
    },
    monitoring: {
      title: "Мониторинг агентов",
      performance: "Производительность",
      memory: "Использование памяти",
      cpu: "Использование ЦП",
      queue: "Очередь задач"
    },
    noAgents: "Агенты не найдены"
  },
  
  // Versions
  versions: {
    title: "История версий",
    current: "Текущая версия",
    previous: "Предыдущие версии",
    created: "Создано {{date}}",
    createdBy: "Создано пользователем {{name}}",
    compare: "Сравнить версии",
    restore: "Восстановить эту версию",
    difference: "Различия с текущей версией",
    noVersions: "Предыдущие версии не найдены"
  },
  
  // Analytics
  analytics: {
    title: "Аналитика",
    documentAnalytics: "Аналитика документов",
    userActivity: "Активность пользователей",
    systemPerformance: "Производительность системы",
    period: {
      day: "24 часа",
      week: "7 дней",
      month: "30 дней",
      quarter: "3 месяца",
      year: "12 месяцев"
    },
    metrics: {
      documentsCreated: "Созданные документы",
      documentEdits: "Правки документов",
      verificationRuns: "Запуски проверки",
      issuesFound: "Найденные проблемы",
      issuesResolved: "Решенные проблемы"
    }
  },
  
  // Errors
  errors: {
    general: "Произошла ошибка",
    notFound: "Ресурс не найден",
    unauthorized: "Несанкционированный доступ",
    serverError: "Ошибка сервера",
    networkError: "Ошибка сети",
    retry: "Повторить",
    fileNotFound: "Файл не найден",
    fileUploadFailed: "Загрузка файла не удалась",
    invalidForm: "Пожалуйста, проверьте форму на наличие ошибок"
  }
};