import { mockProjects } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stages = ["Discovery", "Interested", "Evaluating", "Converted"];

export default function ProjectDetailPage({ projectId, onBack }) {
  const project = mockProjects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-neutral-100 p-8">
        <div className="text-lg font-medium">Project not found</div>
        <Button className="mt-4 rounded-2xl" onClick={onBack}>
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <button onClick={onBack} className="mb-3 text-sm text-neutral-500 hover:text-neutral-700">
            ← Back to Projects
          </button>
          <h1 className="text-3xl font-semibold">{project.name}</h1>
          <p className="mt-2 text-neutral-500">{project.productDescription}</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="rounded-[1.5rem] border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Surface Map</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-neutral-50 p-4">
              <div className="text-sm text-neutral-500">Audience</div>
              <div className="mt-2 font-medium">{project.targetAudience}</div>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-4">
              <div className="text-sm text-neutral-500">Search Signals</div>
              <div className="mt-2 font-medium">{project.keywords}</div>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-4">
              <div className="text-sm text-neutral-500">Content Tone</div>
              <div className="mt-2 font-medium">{project.tone}</div>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-4">
              <div className="text-sm text-neutral-500">Channel Surface</div>
              <div className="mt-2 font-medium">{project.channels.join(" / ")}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Asset Library</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.posts.length === 0 ? (
              <div className="rounded-2xl bg-neutral-50 p-4 text-neutral-500">No content assets yet</div>
            ) : (
              project.posts.map((post) => (
                <div key={post.id} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="font-semibold">{post.title}</div>
                    <div className="rounded-full bg-neutral-900 px-2.5 py-0.5 text-xs font-semibold text-white">
                      {post.channel}
                    </div>
                  </div>
                  <div className="text-sm leading-6 text-neutral-700">{post.body}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Execution Log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {project.distributions.length === 0 ? (
              <div className="rounded-2xl bg-neutral-50 p-4 text-neutral-500">No operation logs yet</div>
            ) : (
              project.distributions.map((item) => (
                <div key={item.id} className="rounded-2xl bg-neutral-50 p-4">
                  <div className="font-medium">{item.title}</div>
                  <div className="mt-1 text-sm text-neutral-500">
                    {item.channel} · {item.time} · Status: {item.status}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] border-0 shadow-sm">
  <CardHeader>
    <CardTitle>Response Pipeline</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid gap-4 xl:grid-cols-4">
      {stages.map((stage) => (
        <Card key={stage} className="rounded-[1.5rem] border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{stage}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {project.leads
              .filter((lead) => lead.stage === stage)
              .map((lead) => (
                <div key={lead.id} className="rounded-2xl bg-neutral-50 p-3">
                  <div className="font-medium">{lead.name}</div>
                  <div className="mt-1 text-xs text-neutral-500">Source: {lead.source}</div>
                  <div className="mt-2 text-sm text-neutral-700">{lead.note}</div>
                </div>
              ))}
          </CardContent>
        </Card>
      ))}
    </div>
  </CardContent>
</Card>
      </div>
    </div>
  );
}