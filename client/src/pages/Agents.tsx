import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data for agents
const AGENT_STATUS = {
  ONLINE: 'online',
  DEGRADED: 'degraded',
  OFFLINE: 'offline'
};

const SAMPLE_AGENTS = [
  {
    id: 1,
    name: 'Inbound Gateway Agent',
    version: '1.3.5',
    status: AGENT_STATUS.ONLINE,
    role: 'Приём HTTP/Webhook, валидация и публикация события',
    trigger: 'POST-запрос от формы / каналов',
    input: 'Raw JSON, JWT-sub',
    output: 'Kafka `inbound.messages`, S3 raw',
    logs: 'gateway.access, schema-errors',
    latency: '120ms',
    errorRate: '0.05%',
    lastUpdated: '2023-05-18T12:35:42Z',
    config: {
      threads: 4,
      rateLimit: '1000/min',
      maxPayloadSize: '5MB',
      validateSchema: true,
      logLevel: 'INFO'
    }
  },
  {
    id: 2,
    name: 'Identity Resolver Agent',
    version: '2.1.0',
    status: AGENT_STATUS.ONLINE,
    role: 'Маpпинг multi-channel ID → contact_id',
    trigger: 'Сообщение в Kafka',
    input: 'contact_identity, external ids',
    output: 'contact_id',
    logs: 'resolver-audit',
    latency: '85ms',
    errorRate: '0.02%',
    lastUpdated: '2023-06-22T09:12:30Z',
    config: {
      cacheSize: '1GB',
      timeoutMs: 500,
      retries: 3,
      logLevel: 'INFO'
    }
  },
  {
    id: 3,
    name: 'Classifier Agent',
    version: '1.4.2',
    status: AGENT_STATUS.DEGRADED,
    role: 'Intent / priority / dept ML-классификация',
    trigger: 'Сообщение с contact_id',
    input: 'Text, meta',
    output: 'intent, priority, department_id',
    logs: 'classifier.prompts, latency',
    latency: '520ms',
    errorRate: '1.12%',
    lastUpdated: '2023-04-30T18:47:15Z',
    config: {
      modelType: 'llama2-13b',
      confidenceThreshold: 0.75,
      topK: 3,
      logProbs: true,
      logLevel: 'DEBUG'
    }
  },
  {
    id: 4,
    name: 'Routing Agent',
    version: '1.2.8',
    status: AGENT_STATUS.ONLINE,
    role: 'Создание тикета, постановка в dept-очередь',
    trigger: 'Классифиц. msg',
    input: 'Ticket draft',
    output: 'ticket_id, Kafka dept queue',
    logs: 'router-sql, sla set',
    latency: '65ms',
    errorRate: '0.03%',
    lastUpdated: '2023-05-28T14:22:50Z',
    config: {
      dbPoolSize: 10,
      priorityRules: 'advanced',
      slaDefaults: true,
      logLevel: 'INFO'
    }
  },
  {
    id: 5,
    name: 'Department RAG Agent',
    version: '0.9.7',
    status: AGENT_STATUS.ONLINE,
    role: 'Автоответ (LLM + KB)',
    trigger: 'Ticket open, RAG-call',
    input: 'KB embeddings',
    output: 'Draft reply / confidence',
    logs: 'rag-trace, passages',
    latency: '1250ms',
    errorRate: '0.23%',
    lastUpdated: '2023-07-01T10:15:25Z',
    config: {
      embeddingModel: 'e5-large',
      retrievalModel: 'gpt-4-turbo',
      chunkSize: 512,
      retrieverTopK: 5,
      logLevel: 'INFO'
    }
  },
  {
    id: 6,
    name: 'Outbound Comms Agent',
    version: '1.5.1',
    status: AGENT_STATUS.ONLINE,
    role: 'Отправка сообщения клиенту в канал',
    trigger: 'Ticket comment',
    input: 'msg, attach',
    output: 'Channel API call',
    logs: 'outbound-gateway',
    latency: '175ms',
    errorRate: '0.09%',
    lastUpdated: '2023-06-10T08:33:20Z',
    config: {
      channels: ['email', 'sms', 'push', 'whatsapp'],
      retryPolicy: 'exponential',
      templateEngine: 'handlebars',
      logLevel: 'INFO'
    }
  },
  {
    id: 7,
    name: 'Compliance Logger Agent',
    version: '1.0.3',
    status: AGENT_STATUS.ONLINE,
    role: 'Хэширование документов, сидирование в блокчейн',
    trigger: 'ticket_closed event',
    input: 'file CID, tx',
    output: 'Polygon txid',
    logs: 'chain.tx, ipfs.pin',
    latency: '320ms',
    errorRate: '0.01%',
    lastUpdated: '2023-06-05T16:42:10Z',
    config: {
      hashAlgo: 'sha-256',
      ipfsGateway: 'ipfs.io',
      networkId: 'polygon-mumbai',
      logLevel: 'INFO'
    }
  },
  {
    id: 8,
    name: 'SLA Monitor Agent',
    version: '2.0.2',
    status: AGENT_STATUS.OFFLINE,
    role: 'Проверка сроков, эскалации',
    trigger: 'Cron / Prometheus',
    input: 'Tickets, SLA',
    output: 'alert event',
    logs: 'sla.alerts',
    latency: '95ms',
    errorRate: '0%',
    lastUpdated: '2023-05-20T12:10:45Z',
    config: {
      checkInterval: '60s',
      escalationLevels: 3,
      notificationChannels: ['email', 'slack'],
      logLevel: 'WARNING'
    }
  },
  {
    id: 9,
    name: 'Archiver Agent',
    version: '1.1.0',
    status: AGENT_STATUS.ONLINE,
    role: 'Архивация resolved тикетов, Glacier lifecycle',
    trigger: 'Ticket age > 30d',
    input: 'JSON + files',
    output: 'Glacier vault',
    logs: 'archiver-log',
    latency: '450ms',
    errorRate: '0.04%',
    lastUpdated: '2023-06-18T19:55:30Z',
    config: {
      archiveStorageClass: 'DEEP_ARCHIVE',
      retentionPeriod: '7years',
      compressionType: 'lz4',
      logLevel: 'INFO'
    }
  }
];

const VERSION_HISTORY = [
  { version: '1.4.2', date: '2023-04-30T18:47:15Z', author: 'Elena Koneva', commit: 'a7b3c9d', changes: 'Improved model performance by 15%' },
  { version: '1.4.1', date: '2023-03-25T14:22:10Z', author: 'Mikhail Petrov', commit: 'd8e4f2c', changes: 'Fixed token handling for large documents' },
  { version: '1.4.0', date: '2023-02-12T09:15:30Z', author: 'Elena Koneva', commit: 'f9g1h2i', changes: 'Upgraded to LLaMA2 model' },
  { version: '1.3.2', date: '2023-01-05T11:30:45Z', author: 'Sergei Ivanov', commit: 'j3k4l5m', changes: 'Memory optimization for embedded devices' },
  { version: '1.3.1', date: '2022-12-20T16:40:22Z', author: 'Anna Volkova', commit: 'n6o7p8q', changes: 'Security patches and dependency updates' },
];

const AGENT_TEMPLATES = [
  { id: 'http-listener', name: 'HTTP Listener', description: 'Basic HTTP/REST API endpoint with auth middleware' },
  { id: 'cron-job', name: 'Cron Job', description: 'Scheduled task with configurable intervals' },
  { id: 'llm-chain', name: 'LLM Chain', description: 'LangChain-based agent with customizable prompts' },
  { id: 'kafka-consumer', name: 'Kafka Consumer', description: 'Message queue processor with retry logic' },
  { id: 'custom-dockerfile', name: 'Custom Dockerfile', description: 'Build your agent from scratch' },
];

const KPI_METRICS = {
  liveAgents: '8/9 online',
  errorRate: '0.12%',
  avgLatency: '520 ms',
  ticketsInQueue: '37'
};

// Agent Card Component
const AgentCard = ({ 
  agent, 
  onViewDetails 
}: { 
  agent: any, 
  onViewDetails: (agent: any) => void 
}) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case AGENT_STATUS.ONLINE:
        return 'bg-green-500 hover:bg-green-600';
      case AGENT_STATUS.DEGRADED:
        return 'bg-yellow-500 hover:bg-yellow-600';
      case AGENT_STATUS.OFFLINE:
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-neutral-500 hover:bg-neutral-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case AGENT_STATUS.ONLINE:
        return 'Online';
      case AGENT_STATUS.DEGRADED:
        return 'Degraded';
      case AGENT_STATUS.OFFLINE:
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={getStatusClass(agent.status)}>
              {getStatusText(agent.status)}
            </Badge>
            <CardTitle className="mt-2 text-lg">{agent.name}</CardTitle>
            <CardDescription>v{agent.version}</CardDescription>
          </div>
          <Avatar className="h-9 w-9 bg-neutral-100">
            <AvatarFallback>{agent.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="pb-0 flex-1">
        <div className="text-sm text-neutral-500 space-y-1">
          <div className="flex justify-between">
            <span>Latency:</span>
            <span className="font-medium">{agent.latency}</span>
          </div>
          <div className="flex justify-between">
            <span>Error rate:</span>
            <span className="font-medium">{agent.errorRate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3">
        <div className="flex flex-wrap gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails(agent)}
          >
            <i className="fas fa-eye mr-1"></i> View
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <i className="fas fa-ellipsis-h mr-1"></i> Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <i className="fas fa-redo-alt mr-2"></i> Restart
              </DropdownMenuItem>
              <DropdownMenuItem>
                <i className="fas fa-cog mr-2"></i> Configure
              </DropdownMenuItem>
              <DropdownMenuItem>
                <i className="fas fa-history mr-2"></i> Rollback
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};

// Agent Details Dialog
const AgentDetailsDialog = ({ 
  agent, 
  isOpen, 
  onClose 
}: { 
  agent: any | null, 
  isOpen: boolean, 
  onClose: () => void 
}) => {
  if (!agent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge className={agent.status === AGENT_STATUS.ONLINE 
              ? 'bg-green-500' 
              : agent.status === AGENT_STATUS.DEGRADED 
                ? 'bg-yellow-500' 
                : 'bg-red-500'}
            >
              {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
            </Badge>
            <DialogTitle>{agent.name} v{agent.version}</DialogTitle>
          </div>
          <DialogDescription>
            {agent.role}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="overview" className="w-full h-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[50vh]">
              <TabsContent value="overview" className="p-1">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Agent Details</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      <div>
                        <div className="text-sm text-neutral-500">Role</div>
                        <div className="font-medium">{agent.role}</div>
                      </div>
                      <div>
                        <div className="text-sm text-neutral-500">Trigger</div>
                        <div className="font-medium">{agent.trigger}</div>
                      </div>
                      <div>
                        <div className="text-sm text-neutral-500">Input</div>
                        <div className="font-medium">{agent.input}</div>
                      </div>
                      <div>
                        <div className="text-sm text-neutral-500">Output</div>
                        <div className="font-medium">{agent.output}</div>
                      </div>
                      <div>
                        <div className="text-sm text-neutral-500">Key Logs</div>
                        <div className="font-medium">{agent.logs}</div>
                      </div>
                      <div>
                        <div className="text-sm text-neutral-500">Last Updated</div>
                        <div className="font-medium">{new Date(agent.lastUpdated).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Flow Diagram</h3>
                    <div className="border rounded-lg p-4 bg-neutral-50">
                      <pre className="text-xs overflow-auto">
                        {`@startuml
participant "User" as U
participant "${agent.name}" as A
participant "Next Service" as N

U -> A: ${agent.input}
activate A
A -> A: Process
A -> N: ${agent.output}
deactivate A
@enduml`}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Current Environment</h3>
                    <div className="border rounded-lg p-4 bg-neutral-50 font-mono text-xs">
                      {Object.entries(agent.config).map(([key, value]) => (
                        <div key={key} className="flex">
                          <span className="text-blue-600 w-36">{key}:</span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="config" className="p-1">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Configuration</h3>
                    <p className="text-sm text-neutral-500">
                      Edit the agent's configuration. Changes will be applied during the next deployment cycle.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(agent.config).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <label className="text-sm font-medium">{key}</label>
                          <Input type="text" defaultValue={String(value)} />
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end mt-4 gap-2">
                      <Button variant="outline">Reset</Button>
                      <Button>Save Configuration</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">JSON Preview</h3>
                    <div className="border rounded-lg p-4 bg-neutral-50 font-mono text-xs overflow-auto max-h-[200px]">
                      <pre>{JSON.stringify(agent.config, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="metrics" className="p-1">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Performance Metrics</h3>
                    <p className="text-sm text-neutral-500">
                      Real-time metrics for the past 24 hours
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Latency (ms)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-40 flex items-center justify-center text-neutral-400">
                          <i className="fas fa-chart-line mr-2"></i> 
                          Grafana iFrame would load here
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Throughput (req/s)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-40 flex items-center justify-center text-neutral-400">
                          <i className="fas fa-chart-bar mr-2"></i> 
                          Grafana iFrame would load here
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Error Rate (%)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-40 flex items-center justify-center text-neutral-400">
                          <i className="fas fa-exclamation-triangle mr-2"></i> 
                          Grafana iFrame would load here
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Memory Usage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-40 flex items-center justify-center text-neutral-400">
                          <i className="fas fa-memory mr-2"></i> 
                          Grafana iFrame would load here
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="logs" className="p-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input placeholder="Filter logs..." className="max-w-sm" />
                    <Select defaultValue="info">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Log level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debug">DEBUG</SelectItem>
                        <SelectItem value="info">INFO</SelectItem>
                        <SelectItem value="warn">WARN</SelectItem>
                        <SelectItem value="error">ERROR</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <i className="fas fa-sync-alt mr-2"></i> Refresh
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg">
                    <div className="bg-neutral-100 p-2 text-xs font-mono">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">Live</Badge>
                        <span>Showing recent logs for {agent.name}</span>
                      </div>
                    </div>
                    <div className="p-3 font-mono text-xs space-y-1 max-h-[300px] overflow-auto bg-black text-green-500">
                      <div>[2023-05-18 12:34:56.789] [INFO] Starting {agent.name} v{agent.version}</div>
                      <div>[2023-05-18 12:34:57.012] [INFO] Configuration loaded successfully</div>
                      <div>[2023-05-18 12:34:57.345] [INFO] Connected to Kafka broker</div>
                      <div>[2023-05-18 12:34:58.678] [DEBUG] Trace ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890</div>
                      <div>[2023-05-18 12:35:01.234] [INFO] Processing message with ID msg-12345</div>
                      <div>[2023-05-18 12:35:01.456] [DEBUG] Request payload: {"{\"user_id\": 12345, \"message\": \"Hello\"}"}</div>
                      <div>[2023-05-18 12:35:02.789] [INFO] Message processed successfully in 555ms</div>
                      <div>[2023-05-18 12:35:03.012] [WARN] Rate limiting applied for client IP 192.168.1.1</div>
                      <div>[2023-05-18 12:35:05.345] [ERROR] Failed to connect to external API: timeout</div>
                      <div>[2023-05-18 12:35:06.678] [INFO] Retrying API connection (1/3)</div>
                      <div>[2023-05-18 12:35:07.901] [INFO] Successfully connected to external API</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="versions" className="p-1">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Version History</h3>
                    <Button>
                      <i className="fas fa-cloud-upload-alt mr-2"></i> Deploy New Version
                    </Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Version</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Commit</TableHead>
                        <TableHead>Changes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {VERSION_HISTORY.map((version, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">
                            {version.version}
                            {i === 0 && (
                              <Badge className="ml-2 bg-blue-500">Current</Badge>
                            )}
                          </TableCell>
                          <TableCell>{new Date(version.date).toLocaleDateString()}</TableCell>
                          <TableCell>{version.author}</TableCell>
                          <TableCell className="font-mono text-xs">{version.commit}</TableCell>
                          <TableCell>{version.changes}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <i className="fas fa-undo-alt mr-1"></i> Rollback
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Agent Create Wizard
const CreateAgentWizard = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean, 
  onClose: () => void 
}) => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Step 1: Select Template</h2>
            <p className="text-neutral-500">
              Choose a starting template for your new agent.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {AGENT_TEMPLATES.map(template => (
                <Card 
                  key={template.id} 
                  className={`cursor-pointer transition-colors ${selectedTemplate === template.id ? 'border-primary' : ''}`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{template.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Step 2: Configure Agent & Secrets</h2>
            <p className="text-neutral-500">
              Set up your agent's configuration and link any required secrets.
            </p>
            
            <div className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Agent Name</label>
                  <Input placeholder="e.g. Custom Analytics Agent" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Version</label>
                  <Input placeholder="0.1.0" defaultValue="0.1.0" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Environment</label>
                  <Select defaultValue="dev">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dev">Development</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="prod">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Queue Name</label>
                  <Input placeholder="e.g. analytics.events" />
                </div>
              </div>
              
              <Separator className="my-3" />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Configuration (YAML/JSON)</label>
                <div className="border rounded-md">
                  <textarea 
                    className="w-full h-36 p-3 font-mono text-sm" 
                    placeholder="threads: 4
logLevel: INFO
maxPayloadSize: 10MB
timeout: 30s"
                  ></textarea>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Secrets</label>
                  <Button variant="outline" size="sm">
                    <i className="fas fa-plus mr-1"></i> Add Secret
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Path in Vault</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>API_KEY</TableCell>
                      <TableCell className="font-mono text-xs">secrets/agents/analytics/api_key</TableCell>
                      <TableCell>External Analytics API Key</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <i className="fas fa-trash"></i>
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Step 3: SLA & Rollout Strategy</h2>
            <p className="text-neutral-500">
              Define service level objectives and deployment strategy.
            </p>
            
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Target SLA (latency)</label>
                  <Input placeholder="e.g. 500ms" defaultValue="500ms" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Error Budget (%)</label>
                  <Input placeholder="e.g. 0.1%" defaultValue="0.1%" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Canary Deployment %</label>
                  <Input placeholder="e.g. 10%" defaultValue="10%" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Alert Channel</label>
                  <Select defaultValue="slack">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slack">Slack - #ops-alerts</SelectItem>
                      <SelectItem value="email">Email - Ops Team</SelectItem>
                      <SelectItem value="pagerduty">PagerDuty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator className="my-3" />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Scaling Policy</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm">Min Replicas</label>
                    <Input type="number" defaultValue="2" min="1" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm">Max Replicas</label>
                    <Input type="number" defaultValue="10" min="1" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm">CPU Target (%)</label>
                    <Input type="number" defaultValue="75" min="1" max="100" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm">Memory Target (Mi)</label>
                    <Input type="number" defaultValue="256" min="1" />
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-neutral-50">
                <h3 className="text-sm font-medium mb-2">Deployment Preview</h3>
                <pre className="text-xs font-mono overflow-auto">
{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: custom-analytics-agent
spec:
  replicas: 2
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      containers:
      - name: agent
        image: agents-registry/custom-analytics-agent:0.1.0
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi`}
                </pre>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <DialogDescription>
            Define a new microservice agent in three simple steps.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden py-4">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-neutral-200'}`}>1</div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-neutral-200'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-neutral-200'}`}>2</div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary' : 'bg-neutral-200'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-neutral-200'}`}>3</div>
            </div>
          </div>
          
          <ScrollArea className="h-[50vh] pr-4">
            {renderStep()}
          </ScrollArea>
        </div>
        
        <DialogFooter className="flex justify-between">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={prevStep}>
                <i className="fas fa-arrow-left mr-2"></i> Previous
              </Button>
            )}
          </div>
          <div>
            {step < 3 ? (
              <Button onClick={nextStep} disabled={step === 1 && !selectedTemplate}>
                Next <i className="fas fa-arrow-right ml-2"></i>
              </Button>
            ) : (
              <Button onClick={onClose}>
                Finish <i className="fas fa-check ml-2"></i>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Agents Page Component
const AgentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // Using React Query to fetch agents (with mock data for now)
  const { data: agents = SAMPLE_AGENTS, isLoading } = useQuery({
    queryKey: ['/api/agents'],
    initialData: SAMPLE_AGENTS
  });
  
  // Filter agents based on search term
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleViewDetails = (agent: any) => {
    setSelectedAgent(agent);
    setIsDetailsOpen(true);
  };
  
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };
  
  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Agent Orchestrator</h1>
          <p className="text-neutral-500 mt-1">
            Monitor, configure and deploy microservice agents
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-3">
            <div className="flex items-center text-sm">
              <i className="fas fa-circle text-green-500 mr-1"></i>
              <span className="font-medium mr-1">Live agents:</span>
              <span>{KPI_METRICS.liveAgents}</span>
            </div>
            <div className="flex items-center text-sm">
              <i className="fas fa-exclamation-triangle text-yellow-500 mr-1"></i>
              <span className="font-medium mr-1">Error rate (1h):</span>
              <span>{KPI_METRICS.errorRate}</span>
            </div>
            <div className="flex items-center text-sm">
              <i className="fas fa-clock text-blue-500 mr-1"></i>
              <span className="font-medium mr-1">Avg latency:</span>
              <span>{KPI_METRICS.avgLatency}</span>
            </div>
            <div className="flex items-center text-sm">
              <i className="fas fa-ticket-alt text-purple-500 mr-1"></i>
              <span className="font-medium mr-1">Tickets in queue:</span>
              <span>{KPI_METRICS.ticketsInQueue}</span>
            </div>
          </div>
          
          <div className="relative">
            <Input
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-9"
            />
            <div className="absolute left-3 top-2.5 text-neutral-400">
              <i className="fas fa-search"></i>
            </div>
          </div>
          
          <Button onClick={() => setIsCreateOpen(true)}>
            <i className="fas fa-plus mr-2"></i>
            New Agent
          </Button>
        </div>
      </div>
      
      {/* Agents Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAgents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
          
          {filteredAgents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
              <i className="fas fa-robot text-5xl mb-4"></i>
              <h3 className="text-lg font-medium">No agents found</h3>
              <p className="text-sm mt-1">
                {searchTerm ? 'Try adjusting your search term' : 'Add your first agent to get started'}
              </p>
            </div>
          )}
        </>
      )}
      
      {/* Agent Details Dialog */}
      <AgentDetailsDialog
        agent={selectedAgent}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
      
      {/* Create Agent Wizard */}
      <CreateAgentWizard
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
};

export default AgentsPage;