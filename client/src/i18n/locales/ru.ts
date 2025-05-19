export default {
  common: {
    appName: "Юрисдикция",
    loading: "Загрузка...",
    error: "Произошла ошибка",
    save: "Сохранить",
    cancel: "Отмена",
    delete: "Удалить",
    edit: "Редактировать",
    view: "Просмотр",
    create: "Создать",
    update: "Обновить",
    submit: "Отправить",
    search: "Поиск",
    filter: "Фильтр",
    sort: "Сортировка",
    upload: "Загрузить",
    download: "Скачать",
    noResults: "Результаты не найдены",
    back: "Назад",
    next: "Далее",
    confirm: "Подтвердить",
    actions: "Действия",
    status: {
      draft: "Черновик",
      pending: "В ожидании",
      review: "На рассмотрении",
      approved: "Одобрено",
      published: "Опубликовано",
      rejected: "Отклонено",
      archived: "В архиве",
      all: "Все статусы"
    },
    dateFormat: {
      short: "DD.MM.YYYY",
      long: "D MMMM YYYY",
      time: "HH:mm"
    }
  },
  auth: {
    signIn: "Войти",
    signOut: "Выйти",
    profile: "Профиль",
    settings: "Настройки"
  },
  navigation: {
    dashboard: "Панель управления",
    documents: "Документы",
    verification: "Верификация",
    knowledgeGraph: "График знаний",
    agents: "Агенты",
    settings: "Настройки",
    analytics: "Аналитика",
    help: "Помощь"
  },
  dashboard: {
    title: "Панель управления",
    subtitle: "Обзор вашей законодательной системы",
    welcome: "Добро пожаловать",
    cards: {
      documents: {
        title: "Документы",
        subtitle: "Управление законодательными документами"
      },
      activity: {
        title: "Последние действия",
        subtitle: "Последние действия в системе",
        noActivity: "Нет недавних действий"
      },
      verification: {
        title: "Проблемы верификации",
        subtitle: "Документы, требующие проверки",
        noIssues: "Проблемы верификации не найдены"
      },
      knowledge: {
        title: "График знаний",
        subtitle: "Исследуйте взаимосвязи документов",
      },
      agents: {
        title: "Активные агенты",
        subtitle: "ИИ-агенты, выполняющие задачи",
        noAgents: "Активные агенты не найдены"
      }
    }
  },
  documents: {
    title: "Документы",
    subtitle: "Управляйте и сотрудничайте над законодательными документами",
    actions: {
      newDocument: "Новый документ",
      uploadDocument: "Загрузить документ",
      searchDocuments: "Поиск документов...",
      filterByStatus: "Фильтр по статусу"
    },
    table: {
      title: "Название",
      status: "Статус",
      created: "Создано",
      modified: "Изменено",
      author: "Автор",
      version: "Версия"
    },
    form: {
      title: "Название",
      titlePlaceholder: "Введите название документа",
      description: "Описание",
      descriptionPlaceholder: "Введите описание документа",
      status: "Статус",
      submit: "Создать документ",
      cancel: "Отмена"
    },
    details: {
      title: "Детали документа",
      versions: "Версии",
      metadata: "Метаданные",
      relatedDocuments: "Связанные документы",
      verification: "Статус верификации"
    },
    editor: {
      title: "Редактор документов",
      save: "Сохранить изменения",
      history: "История версий",
      compare: "Сравнить версии",
      preview: "Предпросмотр",
      comments: "Комментарии"
    },
    messages: {
      createSuccess: "Документ успешно создан",
      updateSuccess: "Документ успешно обновлен",
      deleteSuccess: "Документ успешно удален",
      createError: "Не удалось создать документ",
      updateError: "Не удалось обновить документ",
      deleteError: "Не удалось удалить документ"
    },
    noDocuments: "Документы не найдены",
    emptyState: {
      title: "Документы отсутствуют",
      description: "Создайте свой первый документ, чтобы начать работу",
      action: "Создать документ"
    },
    upload: {
      title: "Загрузить документ",
      instructions: "Перетащите файл или нажмите для выбора",
      supportedFormats: "Поддерживаемые форматы: .docx, .pdf, .xml",
      uploading: "Загрузка...",
      success: "Загрузка выполнена успешно",
      error: "Загрузка не удалась",
      retry: "Повторить загрузку"
    }
  },
  verification: {
    title: "Верификация",
    subtitle: "Проверка законодательных документов на согласованность и соответствие",
    filters: {
      all: "Все проблемы",
      critical: "Критические",
      major: "Серьезные",
      minor: "Незначительные",
      resolved: "Решенные"
    },
    table: {
      document: "Документ",
      issue: "Проблема",
      severity: "Серьезность",
      status: "Статус",
      location: "Расположение",
      detected: "Обнаружено"
    },
    details: {
      title: "Детали проблемы",
      description: "Описание",
      context: "Контекст",
      conflictingReference: "Конфликтующая ссылка",
      resolution: "Решение",
      actions: {
        markAsResolved: "Отметить как решенное",
        reopenIssue: "Переоткрыть проблему",
        assignTo: "Назначить"
      }
    },
    noIssues: "Проблемы верификации не найдены",
    emptyState: {
      title: "Нет проблем верификации",
      description: "Все документы прошли верификацию",
      action: "Проверить документы"
    }
  },
  knowledgeGraph: {
    title: "График знаний",
    subtitle: "Исследуйте взаимосвязи между законодательными документами",
    actions: {
      zoom: "Масштаб",
      filter: "Фильтр графика",
      layout: "Изменить разметку",
      export: "Экспорт графика",
      search: "Поиск сущностей",
      focus: "Фокус на выбранном"
    },
    legend: {
      title: "Легенда",
      document: "Документ",
      term: "Юридический термин",
      concept: "Концепция",
      entity: "Сущность",
      relation: "Отношение"
    },
    details: {
      title: "Детали сущности",
      type: "Тип",
      connections: "Связи",
      documents: "Упомянутые документы"
    },
    stats: {
      title: "Статистика графика",
      nodes: "Всего узлов",
      edges: "Всего связей",
      clusters: "Кластеры",
      density: "Плотность графика"
    },
    search: {
      placeholder: "Поиск сущностей...",
      noResults: "Сущности не найдены"
    },
    emptyState: {
      title: "График знаний пуст",
      description: "Добавьте документы для наполнения графика знаний",
      action: "Добавить документы"
    }
  },
  agents: {
    title: "Агенты",
    subtitle: "Управление ИИ-агентами, анализирующими законодательные документы",
    list: {
      name: "Имя",
      status: "Статус",
      type: "Тип",
      lastActive: "Последняя активность",
      documents: "Документы",
      tasks: "Задачи"
    },
    status: {
      active: "Активен",
      idle: "Простаивает",
      processing: "Обработка",
      error: "Ошибка",
      offline: "Офлайн"
    },
    details: {
      title: "Детали агента",
      description: "Описание",
      capabilities: "Возможности",
      metrics: "Показатели производительности",
      logs: "Журналы активности",
      configuration: "Конфигурация"
    },
    actions: {
      start: "Запустить агента",
      stop: "Остановить агента",
      restart: "Перезапустить агента",
      configure: "Настроить агента",
      viewLogs: "Просмотр журналов"
    },
    types: {
      parser: "Парсер документов",
      validator: "Валидатор",
      analyzer: "Семантический анализатор",
      classifier: "Классификатор документов",
      extractor: "Экстрактор сущностей",
      comparator: "Компаратор документов",
      termAlignment: "Согласование терминов"
    },
    noAgents: "Агенты не найдены",
    emptyState: {
      title: "Агенты не настроены",
      description: "Настройте агентов для анализа документов",
      action: "Настроить агентов"
    }
  },
  settings: {
    title: "Настройки",
    subtitle: "Настройка параметров приложения",
    sections: {
      general: "Основные",
      account: "Аккаунт",
      notifications: "Уведомления",
      system: "Система",
      integrations: "Интеграции",
      appearance: "Внешний вид",
      advanced: "Расширенные"
    },
    language: {
      title: "Язык",
      description: "Изменить язык интерфейса приложения",
      languages: {
        en: "English",
        ru: "Русский",
        kk: "Қазақша"
      }
    },
    theme: {
      title: "Тема",
      description: "Выберите предпочитаемую цветовую тему",
      options: {
        light: "Светлая",
        dark: "Темная",
        system: "Системная"
      }
    },
    account: {
      title: "Информация об аккаунте",
      email: "Эл. почта",
      name: "Имя",
      role: "Роль",
      organization: "Организация",
      changePassword: "Изменить пароль"
    },
    notifications: {
      title: "Настройки уведомлений",
      email: "Уведомления по эл. почте",
      push: "Push-уведомления",
      digest: "Ежедневная сводка",
      mentions: "Упоминания и комментарии"
    },
    system: {
      title: "Системные настройки",
      dateFormat: "Формат даты",
      timeZone: "Часовой пояс",
      accessibility: "Параметры доступности"
    },
    integrations: {
      title: "Интеграции",
      connectedServices: "Подключенные сервисы",
      apiKeys: "API-ключи",
      webhooks: "Вебхуки"
    },
    save: "Сохранить настройки",
    cancel: "Отменить изменения",
    messages: {
      saveSuccess: "Настройки успешно сохранены",
      saveError: "Не удалось сохранить настройки"
    }
  }
};