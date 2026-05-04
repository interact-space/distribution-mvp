import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  CheckCircle2,
  Download,
  FileText,
  Globe,
  Layers3,
  ListChecks,
  MessageSquare,
  RefreshCw,
  Send,
  Sparkles,
  Target,
  Workflow,
} from 'lucide-react';
import { loadState, saveState } from '@/services/storageService';
import { downloadCsv } from '@/services/csvExportService';
import { createOperationLog } from '@/services/operationLogService';
import { enrichPostWithGeoMetadata, getAverageChannelFit } from '@/services/contentAdaptationService';

const CHANNELS = [
  { id: 'xiaohongshu', name: 'Xiaohongshu' },
  { id: 'zhihu', name: 'Zhihu' },
  { id: 'weibo', name: 'Weibo' },
  { id: 'twitter', name: 'X / Twitter' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'reddit', name: 'Reddit' },
];

const initialLeads = [
  { id: 1, name: 'Mia Chen', source: 'Zhihu', status: 'New Lead', note: 'Asked about automated posting solutions' },
  { id: 2, name: 'Tobias Wang', source: 'LinkedIn', status: 'Contacted', note: 'Interested in cold-start growth' },
  { id: 3, name: 'Alex Li', source: 'Reddit', status: 'Following Up', note: 'Interested in GEO distribution' },
  { id: 4, name: 'Nina Xu', source: 'Xiaohongshu', status: 'Converted', note: 'Booked a demo' },
];

const statusCols = ['New Lead', 'Contacted', 'Following Up', 'Converted'];

const capabilityItems = [
  'GEO Content Adaptation',
  'Multi-source Distribution',
  'Channel Fit Metadata',
  'CSV Export',
  'Local Persistence',
  'Operation Logs',
];

function makePosts({ productName, audience, keywords, tone, description }) {
  const kw = keywords
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 4);

  const angle = kw.length ? `around ${kw.join(' / ')}` : 'around target user pain points';

  return [
    {
      title: `${productName || 'your product'} cold-start growth playbook`,
      channel: 'Zhihu',
      body: `I have been studying the growth strategy of ${productName || 'a new product'} and found that many teams do not struggle with building the product itself, but with distributing content consistently. We are building an automated workflow that connects post creation, distribution, lead collection, and sales follow-up for ${audience || 'early-stage teams'}, ${angle}.\n\nIf you are also building ${productName || 'a new project'}, what would you want to solve first: post creation, distribution, or lead conversion?`,
    },
    {
      title: `${productName || 'Product'} cold start does not have to rely on paid traffic`,
      channel: 'Xiaohongshu',
      body: `When teams start the cold-start growth process for ${productName || 'a project'}, the first instinct is often to spend on paid traffic. A more practical approach is to build a repeatable content distribution system first.\n\nOur workflow is simple:\n1. Automatically generate platform-specific posts\n2. Distribute content across multiple channels\n3. Collect leads automatically\n4. Move qualified prospects into the sales pipeline\n\nDesigned for ${audience || 'new project teams'} with a ${tone || 'Professional'} tone.`,
    },
    {
      title: `How we automate GEO posting for ${productName || 'new products'}`,
      channel: 'LinkedIn',
      body: `We are building a lightweight growth workflow for ${productName || 'early-stage products'}: content generation, multi-channel distribution, inbound lead capture, and sales follow-up in one place.\n\nBest fit for ${audience || 'small teams'} who want a practical cold-start system instead of scattered manual work. ${description ? `Core context: ${description}` : ''}`,
    },
  ];
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <Card className="rounded-[1.35rem] border border-neutral-200 bg-white shadow-sm">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <div className="text-sm text-neutral-500">{label}</div>
          <div className="mt-2 text-2xl font-semibold text-neutral-950">{value}</div>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-neutral-100">
          <Icon className="h-5 w-5 text-neutral-700" />
        </div>
      </CardContent>
    </Card>
  );
}

function SectionHeader({ title, description, action }) {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-neutral-950">{title}</h2>
        {description && <p className="mt-1 text-sm leading-6 text-neutral-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export default function GeoSalesAutomationMVP() {
  const [productName, setProductName] = useState('sy');
  const [audience, setAudience] = useState('Startup Teams / Indie Hackers / SMB Customers');
  const [keywords, setKeywords] = useState('GEO, automated posting, cold start, sales automation');
  const [tone, setTone] = useState('Professional');
  const [description, setDescription] = useState('Help teams automatically generate posts, distribute them across platforms, and move leads into the sales pipeline.');
  const [selected, setSelected] = useState(() => loadState('selectedChannels', ['xiaohongshu', 'zhihu', 'linkedin']));
  const [published, setPublished] = useState(() => loadState('distributionLogs', []));
  const [leads, setLeads] = useState(() => loadState('leads', initialLeads));
  const [operationLogs, setOperationLogs] = useState(() => loadState('operationLogs', [
    createOperationLog('System initialized', 'Loaded default MVP workflow data'),
  ]));

  const posts = useMemo(
    () => makePosts({ productName, audience, keywords, tone, description })
      .map((post) => enrichPostWithGeoMetadata(post, keywords)),
    [productName, audience, keywords, tone, description]
  );

  const averageChannelFit = useMemo(() => getAverageChannelFit(posts), [posts]);

  useEffect(() => {
    saveState('selectedChannels', selected);
  }, [selected]);

  useEffect(() => {
    saveState('distributionLogs', published);
  }, [published]);

  useEffect(() => {
    saveState('leads', leads);
  }, [leads]);

  useEffect(() => {
    saveState('operationLogs', operationLogs);
  }, [operationLogs]);

  const addOperationLog = (action, detail) => {
    setOperationLogs((prev) => [createOperationLog(action, detail), ...prev].slice(0, 30));
  };

  const pipelineProgress = Math.round((leads.filter((l) => l.status === 'Converted').length / leads.length) * 100);

  const toggleChannel = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const publishAll = () => {
    const timestamp = new Date().toLocaleString();
    const result = selected.map((channelId, idx) => ({
      id: `${channelId}-${Date.now()}-${idx}`,
      channel: CHANNELS.find((c) => c.id === channelId)?.name || channelId,
      title: posts[idx % posts.length].title,
      time: timestamp,
      status: 'Distributed',
    }));
    setPublished((prev) => [...result, ...prev]);
    addOperationLog('Distributed content', `Published ${result.length} records across selected channels`);
  };

  const moveLead = (id, next) => {
    const targetLead = leads.find((lead) => lead.id === id);
    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status: next } : lead)));
    if (targetLead) {
      addOperationLog('Updated lead status', `${targetLead.name}: ${targetLead.status} → ${next}`);
    }
  };

  const exportPosts = () => {
    downloadCsv('generated-posts.csv', posts.map((post, index) => ({
      id: index + 1,
      channel: post.channel,
      title: post.title,
      format: post.format,
      distributionIntent: post.distributionIntent,
      channelFitScore: post.channelFitScore,
      geoKeywords: post.geoKeywords.join(' | '),
      body: post.body,
    })));
    addOperationLog('Exported CSV', 'Generated posts exported for Excel-compatible storage');
  };

  const exportDistributionLogs = () => {
    downloadCsv('distribution-logs.csv', published.map((item) => ({
      id: item.id,
      channel: item.channel,
      title: item.title,
      status: item.status,
      time: item.time,
    })));
    addOperationLog('Exported CSV', 'Distribution logs exported for Excel-compatible storage');
  };

  const exportLeads = () => {
    downloadCsv('leads.csv', leads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      source: lead.source,
      status: lead.status,
      note: lead.note,
    })));
    addOperationLog('Exported CSV', 'Lead pipeline exported for Excel-compatible storage');
  };

  const resetLocalWorkflow = () => {
    setSelected(['xiaohongshu', 'zhihu', 'linkedin']);
    setPublished([]);
    setLeads(initialLeads);
    setOperationLogs([createOperationLog('Workflow reset', 'Local MVP workflow state was reset to defaults')]);
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-500 text-2xl font-bold text-white shadow-sm">
                sy
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">GEO Distribution Automation MVP</h1>
                  <Badge variant="secondary" className="rounded-full">v0.2</Badge>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-500">
                  Generate GEO-friendly content assets, adapt them for source platforms, simulate multi-channel distribution,
                  and export structured workflow data.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-2xl" onClick={exportPosts}>
                <Download className="mr-2 h-4 w-4" /> Export Posts
              </Button>
              <Button variant="outline" className="rounded-2xl" onClick={resetLocalWorkflow}>
                <RefreshCw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
          <aside className="space-y-5">
            <Card className="rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Layers3 className="h-4 w-4" /> Workflow Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {[
                  ['Input', 'Product, audience, keywords'],
                  ['Adapt', 'Platform-specific GEO metadata'],
                  ['Distribute', 'Selected source channels'],
                  ['Track', 'Logs, leads, and CSV exports'],
                ].map(([title, body]) => (
                  <div key={title} className="rounded-2xl bg-neutral-50 p-4">
                    <div className="font-medium text-neutral-950">{title}</div>
                    <div className="mt-1 text-neutral-500">{body}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {capabilityItems.map((item) => (
                  <Badge key={item} variant="outline" className="rounded-full px-3 py-1">
                    {item}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ListChecks className="h-4 w-4" /> Recent Operations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {operationLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="rounded-2xl bg-neutral-50 p-3 text-xs">
                    <div className="font-medium text-neutral-950">{log.action}</div>
                    <div className="mt-1 leading-5 text-neutral-500">{log.detail}</div>
                    <div className="mt-2 text-neutral-400">{log.time}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>

          <main>
            <Tabs defaultValue="builder" className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-2xl border border-neutral-200 bg-white p-1 shadow-sm">
                <TabsTrigger value="builder" className="rounded-xl">Builder</TabsTrigger>
                <TabsTrigger value="distribution" className="rounded-xl">Distribution</TabsTrigger>
                <TabsTrigger value="crm" className="rounded-xl">Leads</TabsTrigger>
                <TabsTrigger value="dashboard" className="rounded-xl">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="builder" className="mt-6">
                <div className="grid gap-6 2xl:grid-cols-[380px_1fr]">
                  <Card className="rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Sparkles className="h-5 w-5" /> Project Input
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="mb-2 text-sm text-neutral-600">Product Name</div>
                        <Input value={productName} onChange={(e) => setProductName(e.target.value)} />
                      </div>
                      <div>
                        <div className="mb-2 text-sm text-neutral-600">Target Audience</div>
                        <Input value={audience} onChange={(e) => setAudience(e.target.value)} />
                      </div>
                      <div>
                        <div className="mb-2 text-sm text-neutral-600">Keywords</div>
                        <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Separate with commas" />
                      </div>
                      <div>
                        <div className="mb-2 text-sm text-neutral-600">Tone</div>
                        <Select value={tone} onValueChange={setTone}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Professional">Professional</SelectItem>
                            <SelectItem value="Direct">Direct</SelectItem>
                            <SelectItem value="Casual">Casual</SelectItem>
                            <SelectItem value="Sales-oriented">Sales-oriented</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <div className="mb-2 text-sm text-neutral-600">Product Description</div>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[150px]" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm">
                    <CardHeader>
                      <SectionHeader
                        title="Generated GEO Content"
                        description="Each asset is enriched with channel fit, platform format, distribution intent, and GEO keywords."
                        action={
                          <Button variant="outline" size="sm" className="rounded-xl" onClick={exportPosts}>
                            <Download className="mr-2 h-4 w-4" /> Export CSV
                          </Button>
                        }
                      />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {posts.map((post, idx) => (
                        <motion.div
                          key={`${post.channel}-${post.title}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          className="rounded-[1.25rem] border border-neutral-200 bg-neutral-50 p-5"
                        >
                          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <div className="font-semibold text-neutral-950">{post.title}</div>
                              <div className="mt-1 text-sm text-neutral-500">{post.channel}</div>
                            </div>
                            <Badge className="w-fit rounded-full">{post.channelFitScore} Fit</Badge>
                          </div>

                          <div className="mb-4 grid gap-3 md:grid-cols-3">
                            <div className="rounded-2xl bg-white p-4 text-sm">
                              <div className="text-xs text-neutral-400">Format</div>
                              <div className="mt-1 font-medium text-neutral-800">{post.format}</div>
                            </div>
                            <div className="rounded-2xl bg-white p-4 text-sm md:col-span-2">
                              <div className="text-xs text-neutral-400">Distribution Intent</div>
                              <div className="mt-1 font-medium text-neutral-800">{post.distributionIntent}</div>
                            </div>
                          </div>

                          <div className="mb-4 flex flex-wrap gap-2">
                            {post.geoKeywords.map((keyword) => (
                              <Badge key={keyword} variant="outline" className="rounded-full">
                                {keyword}
                              </Badge>
                            ))}
                          </div>

                          <p className="whitespace-pre-line text-sm leading-7 text-neutral-700">{post.body}</p>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="distribution" className="mt-6">
                <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
                  <Card className="rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Send className="h-5 w-5" /> Distribution Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm leading-6 text-neutral-500">
                        Select source platforms and simulate a distribution run.
                      </p>
                      <div className="space-y-3">
                        {CHANNELS.map((channel) => {
                          const checked = selected.includes(channel.id);
                          return (
                            <label key={channel.id} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                              <Checkbox checked={checked} onCheckedChange={() => toggleChannel(channel.id)} />
                              <span className="text-sm font-medium">{channel.name}</span>
                            </label>
                          );
                        })}
                      </div>
                      <Button className="w-full rounded-2xl" onClick={publishAll}>
                        Start Distribution
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm">
                    <CardHeader>
                      <SectionHeader
                        title="Distribution Records"
                        description="Structured records are generated for each selected source channel."
                        action={
                          <Button variant="outline" size="sm" className="rounded-xl" onClick={exportDistributionLogs} disabled={published.length === 0}>
                            <Download className="mr-2 h-4 w-4" /> Export CSV
                          </Button>
                        }
                      />
                    </CardHeader>
                    <CardContent>
                      {published.length === 0 ? (
                        <div className="grid min-h-[320px] place-items-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 text-sm text-neutral-500">
                          No distribution records yet. Select channels, then start distribution.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {published.map((item) => (
                            <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 md:flex-row md:items-center md:justify-between">
                              <div>
                                <div className="font-medium text-neutral-950">{item.title}</div>
                                <div className="mt-1 text-sm text-neutral-500">{item.channel} · {item.time}</div>
                              </div>
                              <Badge className="w-fit rounded-full">{item.status}</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="crm" className="mt-6">
                <div className="space-y-6">
                  <Card className="rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm">
                    <CardHeader>
                      <SectionHeader
                        title="Downstream Lead Signals"
                        description="Lead tracking is included as a downstream signal from content distribution performance."
                        action={
                          <Button variant="outline" size="sm" className="rounded-xl" onClick={exportLeads}>
                            <Download className="mr-2 h-4 w-4" /> Export Leads
                          </Button>
                        }
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl bg-neutral-50 p-4">
                          <div className="mb-2 text-sm text-neutral-500">Conversion Progress</div>
                          <Progress value={pipelineProgress} className="mb-2" />
                          <div className="text-sm text-neutral-600">{pipelineProgress}% converted</div>
                        </div>
                        <div className="rounded-2xl bg-neutral-50 p-4">
                          <div className="mb-1 flex items-center gap-2 text-sm text-neutral-500">
                            <Target className="h-4 w-4" /> New Leads
                          </div>
                          <div className="text-2xl font-semibold">{leads.filter((l) => l.status === 'New Lead').length}</div>
                        </div>
                        <div className="rounded-2xl bg-neutral-50 p-4">
                          <div className="mb-1 flex items-center gap-2 text-sm text-neutral-500">
                            <MessageSquare className="h-4 w-4" /> Following Up
                          </div>
                          <div className="text-2xl font-semibold">{leads.filter((l) => l.status === 'Following Up').length}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                    {statusCols.map((status) => (
                      <Card key={status} className="rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-base">{status}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {leads.filter((lead) => lead.status === status).map((lead) => (
                            <div key={lead.id} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                              <div className="font-medium text-neutral-950">{lead.name}</div>
                              <div className="mt-1 text-xs text-neutral-500">Source: {lead.source}</div>
                              <div className="mt-3 text-sm leading-6 text-neutral-700">{lead.note}</div>
                              <div className="mt-4">
                                {statusCols[statusCols.indexOf(lead.status) + 1] ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl"
                                    onClick={() => moveLead(lead.id, statusCols[statusCols.indexOf(lead.status) + 1])}
                                  >
                                    Move to {statusCols[statusCols.indexOf(lead.status) + 1]}
                                  </Button>
                                ) : (
                                  <Badge variant="secondary" className="rounded-full">Completed</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="dashboard" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  <MetricCard label="Generated Posts" value={posts.length} icon={FileText} />
                  <MetricCard label="Avg Channel Fit" value={averageChannelFit} icon={Target} />
                  <MetricCard label="Selected Channels" value={selected.length} icon={Globe} />
                  <MetricCard label="Distribution Logs" value={published.length} icon={BarChart3} />
                  <MetricCard label="Operation Logs" value={operationLogs.length} icon={ListChecks} />
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-2">
                  <Card className="rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Workflow className="h-5 w-5" /> MVP Capability Checklist
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm leading-6 text-neutral-700">
                      {[
                        'GEO-oriented content generation from product inputs',
                        'Platform-specific adaptation with channel fit metadata',
                        'Multi-source distribution simulation',
                        'Local workflow persistence with localStorage',
                        'CSV export for Excel-compatible structured storage',
                        'Operation logs for workflow traceability',
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3 rounded-2xl bg-neutral-50 p-4">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ListChecks className="h-5 w-5" /> Operation Logs
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {operationLogs.slice(0, 7).map((log) => (
                        <div key={log.id} className="rounded-2xl bg-neutral-50 p-4">
                          <div className="font-medium text-neutral-950">{log.action}</div>
                          <div className="mt-1 text-neutral-600">{log.detail}</div>
                          <div className="mt-2 text-xs text-neutral-400">{log.time}</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}
