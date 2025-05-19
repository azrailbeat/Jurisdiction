// Kazakh translations
export default {
  // App-wide shared strings
  "app": {
    "title": "Заңнамалық құжаттарды басқару жүйесі",
    "language": "Тіл",
    "search": "Іздеу",
    "loading": "Жүктелуде...",
    "save": "Сақтау",
    "cancel": "Болдырмау",
    "delete": "Жою",
    "edit": "Өңдеу",
    "create": "Құру",
    "actions": "Әрекеттер",
    "status": "Күй"
  },
  
  // Navigation
  "nav": {
    "home": "Басты бет",
    "documents": "Құжаттар",
    "versions": "Нұсқалар",
    "knowledgeGraph": "Білім графы",
    "verification": "Тексеру",
    "agents": "Агенттер",
    "analytics": "Талдау",
    "settings": "Параметрлер",
    "logout": "Шығу",
    "login": "Кіру"
  },
  
  // Document management
  "documents": {
    "title": "Құжаттар қоймасы",
    "newDocument": "Жаңа құжат",
    "upload": "Құжатты жүктеу",
    "compare": "Құжаттарды салыстыру",
    "search": "Құжаттарды іздеу",
    "filters": "Сүзгілер",
    "status": {
      "draft": "Жоба",
      "review": "Қаралуда",
      "approved": "Мақұлданған",
      "published": "Жарияланған",
      "archived": "Мұрағатталған"
    },
    "fields": {
      "title": "Тақырып",
      "createdBy": "Құрастырушы",
      "createdAt": "Құрылған күні",
      "updatedAt": "Жаңартылған күні",
      "status": "Күй",
      "type": "Құжат түрі",
      "category": "Санат",
      "description": "Сипаттама"
    },
    "uploadInstructions": "Құжатты осында сүйреп тастаңыз немесе таңдау үшін басыңыз",
    "supportedFormats": "Қолдау көрсетілетін форматтар: DOCX, PDF, TXT"
  },
  
  // Version control
  "versions": {
    "title": "Нұсқалар тарихы",
    "current": "Ағымдағы нұсқа",
    "compare": "Ағымдағы нұсқамен салыстыру",
    "revert": "Осы нұсқаға қайту",
    "created": "{{date}} құрылған",
    "by": "{{name}} құрастырған",
    "changes": "Өзгерістер",
    "added": "Қосылған",
    "removed": "Жойылған",
    "modified": "Өзгертілген"
  },
  
  // Knowledge graph
  "knowledgeGraph": {
    "title": "Білім графы",
    "nodes": "Түйіндер",
    "edges": "Байланыстар",
    "entityTypes": "Объект түрлері",
    "relationTypes": "Қатынас түрлері",
    "filters": "Сүзгілер",
    "search": "Графта іздеу",
    "details": "Объект мәліметтері",
    "statistics": "Граф статистикасы",
    "export": "Графты экспорттау",
    "relatedDocuments": "Байланысты құжаттар",
    "pathAnalysis": "Жолдарды талдау"
  },
  
  // Verification and compliance
  "verification": {
    "title": "Тексеру және сәйкестік",
    "issues": "Табылған мәселелер",
    "runVerification": "Тексеруді іске қосу",
    "complianceReport": "Сәйкестік есебі",
    "relatedLegislation": "Байланысты заңнама",
    "severity": {
      "critical": "Қауіпті",
      "high": "Жоғары",
      "medium": "Орташа",
      "low": "Төмен",
      "info": "Ақпараттық"
    },
    "status": {
      "open": "Ашық",
      "inProgress": "Жұмыс жүргізілуде",
      "resolved": "Шешілді",
      "closed": "Жабық",
      "wontFix": "Түзетілмейді"
    }
  },
  
  // Agents
  "agents": {
    "title": "Агенттерді басқару",
    "createAgent": "Агент құру",
    "runningAgents": "Жұмыс істеп тұрған агенттер",
    "allAgents": "Барлық агенттер",
    "status": {
      "idle": "Күту режимінде",
      "running": "Жұмыс істеуде",
      "paused": "Тоқтатылған",
      "completed": "Аяқталған",
      "failed": "Қателік"
    },
    "types": {
      "parser": "Талдау агенті",
      "vectorizer": "Векторизация агенті",
      "verification": "Тексеру агенті",
      "analysis": "Талдау агенті",
      "termAlignment": "Термин теңестіру агенті"
    },
    "actions": {
      "start": "Бастау",
      "pause": "Кідірту",
      "resume": "Жалғастыру",
      "stop": "Тоқтату",
      "restart": "Қайта бастау",
      "configure": "Конфигурациялау"
    }
  },
  
  // Analytics
  "analytics": {
    "title": "Аналитикалық тақта",
    "documentStatistics": "Құжат статистикасы",
    "userActivity": "Пайдаланушы белсенділігі",
    "topDocuments": "Үздік құжаттар",
    "complianceRate": "Сәйкестік деңгейі",
    "issuesByCategory": "Санат бойынша мәселелер",
    "timeRange": "Уақыт диапазоны",
    "export": "Деректерді экспорттау"
  },
  
  // Settings
  "settings": {
    "title": "Параметрлер",
    "tabs": {
      "profile": "Профиль",
      "account": "Аккаунт",
      "notifications": "Хабарландырулар",
      "system": "Жүйе",
      "aiModels": "AI және модельдер"
    },
    "profile": {
      "title": "Профиль параметрлері",
      "subtitle": "Жеке ақпаратты басқару",
      "fullName": "Толық аты-жөні",
      "email": "Электрондық пошта",
      "bio": "Өмірбаян",
      "avatar": "Профиль суреті",
      "change": "Өзгерту",
      "saveProfile": "Профильді сақтау"
    },
    "account": {
      "title": "Аккаунт параметрлері",
      "subtitle": "Аккаунт баптауларын басқару",
      "username": "Пайдаланушы аты",
      "language": "Интерфейс тілі",
      "theme": "Интерфейс тақырыбы",
      "themes": {
        "light": "Жарық",
        "dark": "Қараңғы",
        "system": "Жүйелік"
      },
      "security": "Қауіпсіздік",
      "changePassword": "Құпия сөзді өзгерту",
      "enableTwoFactor": "Екі факторлы аутентификацияны қосу",
      "saveAccount": "Аккаунт параметрлерін сақтау"
    },
    "notifications": {
      "title": "Хабарландыру параметрлері",
      "subtitle": "Хабарландыруларды басқару",
      "emailNotifications": "Электрондық пошта хабарландырулары",
      "emailNotificationsDesc": "Электрондық пошта арқылы хабарландырулар алу",
      "documentUpdates": "Құжат жаңартулары",
      "documentUpdatesDesc": "Бақыланатын құжаттар жаңартылғанда хабарлама алу",
      "verificationAlerts": "Тексеру туралы ескертулер",
      "verificationAlertsDesc": "Тексеру мәселелері туралы ескерту алу",
      "weeklyDigest": "Апталық дайджест",
      "weeklyDigestDesc": "Жүйе белсенділігінің апталық жиынтығын алу",
      "saveNotifications": "Хабарландыру параметрлерін сақтау"
    },
    "system": {
      "title": "Жүйе параметрлері",
      "subtitle": "Жүйелік параметрлерді конфигурациялау",
      "apiEndpoint": "API шеткі нүктесі",
      "defaultXmlFormat": "Әдепкі XML форматы",
      "maxVersions": "Сақталатын нұсқалардың максималды саны",
      "experimental": "Эксперименттік мүмкіндіктерді қосу",
      "maintenance": "Жүйе қызмет көрсету",
      "rebuildGraph": "Білім графын қайта құру",
      "rescanDocuments": "Құжаттарды қайта сканерлеу",
      "clearCache": "Кэшті тазарту",
      "saveSystem": "Жүйе параметрлерін сақтау"
    },
    "aiModels": {
      "title": "AI және модельдер",
      "subtitle": "AI модельдерін конфигурациялау",
      "apiKey": "AI моделінің API кілті",
      "model": "Әдепкі модель",
      "maxTokens": "Токендердің максималды саны",
      "semanticAnalysis": "Семантикалық талдауды қосу",
      "automatedVerification": "Автоматты тексеруді қосу",
      "saveAI": "AI параметрлерін сақтау"
    }
  },
  
  // Error messages
  "errors": {
    "general": "Қате орын алды. Қайталап көріңіз.",
    "notFound": "Сұралған ресурс табылмады.",
    "unauthorized": "Бұл әрекетті орындауға рұқсатыңыз жоқ.",
    "serverError": "Сервер қатесі орын алды. Кейінірек қайталап көріңіз.",
    "validation": "Енгізілген деректерді тексеріп, қайталап көріңіз.",
    "fileUpload": "Файлды жүктеу сәтсіз аяқталды. Қайталап көріңіз."
  }
};