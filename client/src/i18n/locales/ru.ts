// Russian translations
export default {
  // App-wide shared strings
  "app": {
    "title": "Система управления законодательными документами",
    "language": "Язык",
    "search": "Поиск",
    "loading": "Загрузка...",
    "save": "Сохранить",
    "cancel": "Отмена",
    "delete": "Удалить",
    "edit": "Редактировать",
    "create": "Создать",
    "actions": "Действия",
    "status": "Статус"
  },
  
  // Navigation
  "nav": {
    "home": "Главная",
    "documents": "Документы",
    "versions": "Версии",
    "knowledgeGraph": "Граф знаний",
    "verification": "Проверка",
    "agents": "Агенты",
    "analytics": "Аналитика",
    "settings": "Настройки",
    "logout": "Выйти",
    "login": "Войти"
  },
  
  // Document management
  "documents": {
    "title": "Репозиторий документов",
    "newDocument": "Новый документ",
    "upload": "Загрузить документ",
    "compare": "Сравнить документы",
    "search": "Поиск документов",
    "filters": "Фильтры",
    "status": {
      "draft": "Черновик",
      "review": "На рассмотрении",
      "approved": "Одобрен",
      "published": "Опубликован",
      "archived": "В архиве"
    },
    "fields": {
      "title": "Название",
      "createdBy": "Создатель",
      "createdAt": "Дата создания",
      "updatedAt": "Дата обновления",
      "status": "Статус",
      "type": "Тип документа",
      "category": "Категория",
      "description": "Описание"
    },
    "uploadInstructions": "Перетащите документ сюда или нажмите для выбора",
    "supportedFormats": "Поддерживаемые форматы: DOCX, PDF, TXT"
  },
  
  // Version control
  "versions": {
    "title": "История версий",
    "current": "Текущая версия",
    "compare": "Сравнить с текущей",
    "revert": "Вернуться к этой версии",
    "created": "Создано {{date}}",
    "by": "автор {{name}}",
    "changes": "Изменения",
    "added": "Добавлено",
    "removed": "Удалено",
    "modified": "Изменено"
  },
  
  // Knowledge graph
  "knowledgeGraph": {
    "title": "Граф знаний",
    "nodes": "Узлы",
    "edges": "Связи",
    "entityTypes": "Типы сущностей",
    "relationTypes": "Типы отношений",
    "filters": "Фильтры",
    "search": "Поиск в графе",
    "details": "Детали сущности",
    "statistics": "Статистика графа",
    "export": "Экспорт графа",
    "relatedDocuments": "Связанные документы",
    "pathAnalysis": "Анализ путей"
  },
  
  // Verification and compliance
  "verification": {
    "title": "Проверка и соответствие",
    "issues": "Обнаруженные проблемы",
    "runVerification": "Запустить проверку",
    "complianceReport": "Отчет о соответствии",
    "relatedLegislation": "Связанное законодательство",
    "severity": {
      "critical": "Критическая",
      "high": "Высокая",
      "medium": "Средняя",
      "low": "Низкая",
      "info": "Информация"
    },
    "status": {
      "open": "Открыта",
      "inProgress": "В процессе",
      "resolved": "Решена",
      "closed": "Закрыта",
      "wontFix": "Не будет исправлена"
    }
  },
  
  // Agents
  "agents": {
    "title": "Управление агентами",
    "createAgent": "Создать агента",
    "runningAgents": "Работающие агенты",
    "allAgents": "Все агенты",
    "status": {
      "idle": "Ожидание",
      "running": "Работает",
      "paused": "Приостановлен",
      "completed": "Завершен",
      "failed": "Сбой"
    },
    "types": {
      "parser": "Агент анализа",
      "vectorizer": "Агент векторизации",
      "verification": "Агент проверки",
      "analysis": "Агент анализа",
      "termAlignment": "Агент выравнивания терминов"
    },
    "actions": {
      "start": "Запустить",
      "pause": "Приостановить",
      "resume": "Возобновить",
      "stop": "Остановить",
      "restart": "Перезапустить",
      "configure": "Настроить"
    }
  },
  
  // Analytics
  "analytics": {
    "title": "Аналитическая панель",
    "documentStatistics": "Статистика документов",
    "userActivity": "Активность пользователей",
    "topDocuments": "Популярные документы",
    "complianceRate": "Уровень соответствия",
    "issuesByCategory": "Проблемы по категориям",
    "timeRange": "Временной диапазон",
    "export": "Экспорт данных"
  },
  
  // Settings
  "settings": {
    "title": "Настройки",
    "tabs": {
      "profile": "Профиль",
      "account": "Аккаунт",
      "notifications": "Уведомления",
      "system": "Система",
      "aiModels": "ИИ и модели"
    },
    "profile": {
      "title": "Настройки профиля",
      "subtitle": "Управление личной информацией",
      "fullName": "Полное имя",
      "email": "Адрес электронной почты",
      "bio": "Биография",
      "avatar": "Изображение профиля",
      "change": "Изменить",
      "saveProfile": "Сохранить профиль"
    },
    "account": {
      "title": "Настройки аккаунта",
      "subtitle": "Управление настройками аккаунта",
      "username": "Имя пользователя",
      "language": "Язык интерфейса",
      "theme": "Тема интерфейса",
      "themes": {
        "light": "Светлая",
        "dark": "Темная",
        "system": "Системная"
      },
      "security": "Безопасность",
      "changePassword": "Изменить пароль",
      "enableTwoFactor": "Включить двухфакторную аутентификацию",
      "saveAccount": "Сохранить настройки аккаунта"
    },
    "notifications": {
      "title": "Настройки уведомлений",
      "subtitle": "Управление уведомлениями",
      "emailNotifications": "Уведомления по электронной почте",
      "emailNotificationsDesc": "Получать уведомления по электронной почте",
      "documentUpdates": "Обновления документов",
      "documentUpdatesDesc": "Уведомления при обновлении отслеживаемых документов",
      "verificationAlerts": "Оповещения о проверке",
      "verificationAlertsDesc": "Получать уведомления о проблемах при проверке",
      "weeklyDigest": "Еженедельная сводка",
      "weeklyDigestDesc": "Получать еженедельную сводку активности системы",
      "saveNotifications": "Сохранить настройки уведомлений"
    },
    "system": {
      "title": "Системные настройки",
      "subtitle": "Конфигурация системных настроек",
      "apiEndpoint": "API endpoint",
      "defaultXmlFormat": "Формат XML по умолчанию",
      "maxVersions": "Макс. число хранимых версий",
      "experimental": "Включить экспериментальные функции",
      "maintenance": "Обслуживание системы",
      "rebuildGraph": "Перестроить граф знаний",
      "rescanDocuments": "Пересканировать документы",
      "clearCache": "Очистить кеш",
      "saveSystem": "Сохранить системные настройки"
    },
    "aiModels": {
      "title": "ИИ и модели",
      "subtitle": "Настройка моделей ИИ",
      "apiKey": "API ключ модели ИИ",
      "model": "Модель по умолчанию",
      "maxTokens": "Максимум токенов",
      "semanticAnalysis": "Включить семантический анализ",
      "automatedVerification": "Включить автоматическую проверку",
      "saveAI": "Сохранить настройки ИИ"
    }
  },
  
  // Error messages
  "errors": {
    "general": "Произошла ошибка. Пожалуйста, попробуйте снова.",
    "notFound": "Запрашиваемый ресурс не найден.",
    "unauthorized": "У вас нет прав для выполнения этого действия.",
    "serverError": "Произошла ошибка сервера. Пожалуйста, попробуйте позже.",
    "validation": "Пожалуйста, проверьте введенные данные и попробуйте снова.",
    "fileUpload": "Не удалось загрузить файл. Пожалуйста, попробуйте снова."
  }
};