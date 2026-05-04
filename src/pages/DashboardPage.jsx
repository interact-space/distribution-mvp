import { mockProjects } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const projectCount = mockProjects.length;
  const contentCount = mockProjects.reduce((sum, p) => sum + p.posts.length, 0);
  const operationCount = mockProjects.reduce((sum, p) => sum + p.distributions.length, 0);
  const leadCount = mockProjects.reduce((sum, p) => sum + p.leads.length, 0);

  const stats = [
    { label: "Projects", value: projectCount },
    { label: "Content Assets", value: contentCount },
    { label: "Operation Logs", value: operationCount },
    { label: "Leads", value: leadCount },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-neutral-500">Overview of the current B2B passive acquisition channel project.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label} className="rounded-[1.5rem] border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="text-sm text-neutral-500">{item.label}</div>
              <div className="mt-3 text-3xl font-semibold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Card className="rounded-[1.5rem] border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockProjects.map((project) => (
              <div key={project.id} className="rounded-2xl bg-neutral-50 p-4">
                <div className="font-medium">{project.name}</div>
                <div className="mt-1 text-sm text-neutral-500">{project.targetAudience}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Phase Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-neutral-700">
            <div className="rounded-2xl bg-neutral-50 p-4">Phase 1: Build the passive acquisition channel product structure</div>
            <div className="rounded-2xl bg-neutral-50 p-4">Phase 2: Connect mock data and operation status</div>
            <div className="rounded-2xl bg-neutral-50 p-4">Phase 3: Connect backend, database, and automated execution</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}