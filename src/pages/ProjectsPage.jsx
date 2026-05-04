import { mockProjects } from "../data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProjectsPage({ onOpenProject }) {
  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Project List</h1>
          <p className="mt-2 text-neutral-500">View all B2B passive acquisition channel projects.</p>
        </div>
        <Button className="rounded-2xl">New Project</Button>
      </div>

      <div className="grid gap-6">
        {mockProjects.map((project) => (
          <Card key={project.id} className="rounded-[1.5rem] border-0 shadow-sm">
            <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xl font-semibold">{project.name}</div>
                <div className="mt-2 text-sm text-neutral-600">{project.productDescription}</div>
                <div className="mt-3 text-sm text-neutral-500">
                  Target Audience: {project.targetAudience}
                </div>
                <div className="mt-1 text-sm text-neutral-500">
                  Touchpoint Channels: {project.channels.join(" / ")}
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 lg:items-end">
                <div className="text-sm text-neutral-500">Last Updated: {project.updatedAt}</div>
                <Button className="rounded-2xl" onClick={() => onOpenProject(project.id)}>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}