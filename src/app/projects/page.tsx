import { MotionSection } from "@/components/MotionSection";
import { PageContainer } from "@/components/PageContainer";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const projects = [
  {
    name: "Ut labore et dolore magna aliqua",
    blurb:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    stack: ["next.js", "indexeddb", "framer motion"],
  },
  {
    name: "Sic et non sic et et",
    blurb:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    stack: ["typescript", "tailwind", "shadcn/ui"],
  },
];

export default function ProjectsPage() {
  return (
    <PageContainer>
      <MotionSection delay={0.1}>
        <div className="space-y-2">
          <h1 className="h1">projects</h1>
          <p className="text-base text-zinc-600">always building something</p>
        </div>
      </MotionSection>

      <MotionSection delay={0.2}>
        <Card>
          <CardContent className="space-y-6 pt-0">
            {projects.map((project, index) => (
              <div key={project.name}>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-zinc-900">{project.name}</p>
                    <p className="text-sm text-zinc-600">{project.blurb}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <Badge key={item} variant="outline">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                {index < projects.length - 1 ? (
                  <Separator className="my-4 bg-zinc-100" />
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </MotionSection>
    </PageContainer>
  );
}
