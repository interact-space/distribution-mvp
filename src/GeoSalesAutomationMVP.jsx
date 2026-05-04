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
import { Sparkles, Send, Workflow, Target, MessageSquare, Globe, Search, BarChart3, Download, ListChecks } from 'lucide-react';
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

function makePosts({ productName, audience, keywords, tone, description }) {
  const kw = keywords
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 4);

  const angle = kw.length ? `around ${kw.join(' / ')}` : 'around target user pain points';

  return [
    {
      title: `${productName || 'your product'}  cold-start growth playbook`,
      channel: 'Zhihu',
      body: `I have been studying the growth strategy of ${productName || 'a new product'} and found that many teams do not struggle with building the product itself, but with distributing content consistently. We are building an automated workflow that connects post creation, distribution, lead collection, and sales follow-up for ${audience || 'early-stage teams'}, ${angle}.\n\nIf you are also building ${productName || 'a new project'}, what would you want to solve first: post creation, distribution, or lead conversion?`,
    },
    {
      title: `${productName || 'Product'}  cold start does not have to rely on paid traffic`,
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

function FeatureBubble({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="relative w-full rounded-2xl bg-lime-400 px-6 py-5 text-2xl font-semibold tracking-tight text-black shadow-sm"
    >
      <div className="pr-6">{children}</div>
      <div className="absolute right-[-16px] top-1/2 h-0 w-0 -translate-y-1/2 border-y-[14px] border-l-[18px] border-y-transparent border-l-lime-400" />
    </motion.div>
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
    <div className="min-h-screen bg-neutral-200 text-neutral-900">
      <div className="mx-auto max-w-7xl p-6 md:p-10">
        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2rem] bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-500 text-3xl font-bold text-white shadow-sm">sy</div>
                <div>
                  <div className="text-xl font-semibold">Automated Acquisition & Sales Workflow</div>
                  <div className="text-sm text-neutral-500">Content Generation · Distribution · Lead Progression</div>
                </div>
              </div>

              <div className="space-y-4">
                <FeatureBubble>One-click Source Distribution</FeatureBubble>
                <FeatureBubble>GEO Automated Posting</FeatureBubble>
                <FeatureBubble>Post Writing & Distribution</FeatureBubble>
                <FeatureBubble>Sales Workflow Automation</FeatureBubble>
                <FeatureBubble>Cold-start Sales Workflow</FeatureBubble>
              </div>
            </motion.div>
          </div>

          <div>
            <Tabs defaultValue="builder" className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-2xl bg-white p-1 shadow-sm">
                <TabsTrigger value="builder">Content Builder</TabsTrigger>
                <TabsTrigger value="distribution">Distribution Center</TabsTrigger>
                <TabsTrigger value="crm">Sales Pipeline</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              </TabsList>

              <TabsContent value="builder" className="mt-6">
                <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
                  <Card className="rounded-[1.5rem] border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg"><Sparkles className="h-5 w-5" /> Project Input</CardTitle>
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
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[140px]" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[1.5rem] border-0 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-3">
                      <CardTitle className="flex items-center gap-2 text-lg"><MessageSquare className="h-5 w-5" /> Auto-generated Posts</CardTitle>
                      <Button variant="outline" size="sm" className="rounded-xl" onClick={exportPosts}>
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                      </Button>
                    </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {posts.map((post, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.06 }}
                          className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                        >
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <div className="font-semibold">{post.title}</div>
                            <Badge variant="secondary">{post.channel}</Badge>
                          </div>
                          <div className="mb-3 grid gap-2 md:grid-cols-3">
                            <div className="rounded-xl bg-white p-3 text-xs">
                              <div className="text-neutral-400">Channel Fit</div>
                              <div className="mt-1 text-lg font-semibold">{post.channelFitScore}</div>
                            </div>
                            <div className="rounded-xl bg-white p-3 text-xs">
                              <div className="text-neutral-400">Format</div>
                              <div className="mt-1 font-medium text-neutral-700">{post.format}</div>
                            </div>
                            <div className="rounded-xl bg-white p-3 text-xs">
                              <div className="text-neutral-400">Distribution Intent</div>
                              <div className="mt-1 font-medium text-neutral-700">{post.distributionIntent}</div>
                            </div>
                          </div>
                          <div className="mb-3 flex flex-wrap gap-2">
                            {post.geoKeywords.map((keyword) => (
                              <Badge key={keyword} variant="outline">{keyword}</Badge>
                            ))}
                          </div>
                          <p className="whitespace-pre-line text-sm leading-6 text-neutral-700">{post.body}</p>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="distribution" className="mt-6">
                <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
                  <Card className="rounded-[1.5rem] border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg"><Send className="h-5 w-5" /> Distribution Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-neutral-600">Select platforms to distribute to</div>
                      <div className="space-y-3">
                        {CHANNELS.map((channel) => {
                          const checked = selected.includes(channel.id);
                          return (
                            <label key={channel.id} className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3 cursor-pointer">
                              <Checkbox checked={checked} onCheckedChange={() => toggleChannel(channel.id)} />
                              <span>{channel.name}</span>
                            </label>
                          );
                        })}
                      </div>
                      <Button className="w-full rounded-2xl" onClick={publishAll}>Start Distribution</Button>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[1.5rem] border-0 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-3">
                      <CardTitle className="flex items-center gap-2 text-lg"><Globe className="h-5 w-5" /> Distribution Results</CardTitle>
                      <Button variant="outline" size="sm" className="rounded-xl" onClick={exportDistributionLogs} disabled={published.length === 0}>
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                      </Button>
                    </div>
                    </CardHeader>
                    <CardContent>
                      {published.length === 0 ? (
                        <div className="grid min-h-[320px] place-items-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 text-neutral-500">
                          No distribution records yet. Select channels on the left, then click “Start Distribution.”
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {published.map((item) => (
                            <div key={item.id} className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 md:flex-row md:items-center md:justify-between">
                              <div>
                                <div className="font-medium">{item.title}</div>
                                <div className="text-sm text-neutral-500">{item.channel} · {item.time}</div>
                              </div>
                              <Badge>{item.status}</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="crm" className="mt-6">
                <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
                  <Card className="rounded-[1.5rem] border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg"><Workflow className="h-5 w-5" /> Pipeline Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <Button variant="outline" className="w-full rounded-2xl" onClick={exportLeads}>
                        <Download className="mr-2 h-4 w-4" /> Export Leads CSV
                      </Button>
                      <div className="rounded-2xl bg-neutral-50 p-4">
                        <div className="mb-2 text-sm text-neutral-500">Conversion Progress</div>
                        <Progress value={pipelineProgress} className="mb-2" />
                        <div className="text-sm text-neutral-600">{pipelineProgress}% of leads have been converted</div>
                      </div>
                      <div className="space-y-3">
                        <div className="rounded-2xl bg-neutral-50 p-4">
                          <div className="mb-1 flex items-center gap-2 text-sm text-neutral-500"><Target className="h-4 w-4" /> New Lead</div>
                          <div className="text-2xl font-semibold">{leads.filter((l) => l.status === 'New Lead').length}</div>
                        </div>
                        <div className="rounded-2xl bg-neutral-50 p-4">
                          <div className="mb-1 flex items-center gap-2 text-sm text-neutral-500"><MessageSquare className="h-4 w-4" /> Following Up</div>
                          <div className="text-2xl font-semibold">{leads.filter((l) => l.status === 'Following Up').length}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {statusCols.map((status) => (
                      <Card key={status} className="rounded-[1.5rem] border-0 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-base">{status}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {leads.filter((lead) => lead.status === status).map((lead) => (
                            <div key={lead.id} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                              <div className="font-medium">{lead.name}</div>
                              <div className="mt-1 text-xs text-neutral-500">Source: {lead.source}</div>
                              <div className="mt-2 text-sm text-neutral-700">{lead.note}</div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {statusCols.filter((s) => s !== lead.status).map((next) => (
                                  <Button key={next} variant="outline" size="sm" className="rounded-xl" onClick={() => moveLead(lead.id, next)}>
                                    Move to {next}
                                  </Button>
                                ))}
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
                <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-5">
                  {[
                    { label: 'Generated Posts', value: posts.length, icon: Sparkles },
                    { label: 'Avg Channel Fit', value: averageChannelFit, icon: Target },
                    { label: 'Selected Channels', value: selected.length, icon: Globe },
                    { label: 'Total Leads', value: leads.length, icon: Search },
                    { label: 'Pipeline Progress', value: `${pipelineProgress}%`, icon: BarChart3 },
                    { label: 'Operation Logs', value: operationLogs.length, icon: ListChecks },
                  ].map((item) => (
                    <Card key={item.label} className="rounded-[1.5rem] border-0 shadow-sm">
                      <CardContent className="flex items-center justify-between p-6">
                        <div>
                          <div className="text-sm text-neutral-500">{item.label}</div>
                          <div className="mt-2 text-3xl font-semibold">{item.value}</div>
                        </div>
                        <item.icon className="h-8 w-8" />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <Card className="rounded-[1.5rem] border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Cold-start Workflow</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-5">
                        {['Input Product', 'Generate Posts', 'Multi-channel Distribution', 'Collect Leads', 'Move to Conversion'].map((step, idx) => (
                          <div key={step} className="rounded-2xl bg-neutral-50 p-4 text-center">
                            <div className="mb-2 text-sm text-neutral-500">STEP {idx + 1}</div>
                            <div className="font-medium">{step}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[1.5rem] border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5" /> Operation Logs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {operationLogs.slice(0, 6).map((log) => (
                        <div key={log.id} className="rounded-2xl bg-neutral-50 p-4">
                          <div className="font-medium">{log.action}</div>
                          <div className="mt-1 text-neutral-600">{log.detail}</div>
                          <div className="mt-2 text-xs text-neutral-400">{log.time}</div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full rounded-2xl" onClick={resetLocalWorkflow}>
                        Reset Local Workflow
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[1.5rem] border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>MVP Capability Checklist</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm leading-6 text-neutral-700">
                      <div className="rounded-2xl bg-neutral-50 p-4">✅ GEO-oriented content generation from product inputs</div>
                      <div className="rounded-2xl bg-neutral-50 p-4">✅ Platform-specific adaptation with channel fit metadata</div>
                      <div className="rounded-2xl bg-neutral-50 p-4">✅ Multi-source distribution simulation</div>
                      <div className="rounded-2xl bg-neutral-50 p-4">✅ Local workflow persistence with localStorage</div>
                      <div className="rounded-2xl bg-neutral-50 p-4">✅ CSV export for Excel-compatible structured storage</div>
                      <div className="rounded-2xl bg-neutral-50 p-4">✅ Operation logs for workflow traceability</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}