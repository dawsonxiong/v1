import Image from "next/image";

import { MotionSection } from "@/components/MotionSection";
import { PageContainer } from "@/components/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const experiences = [
  {
    role: "senior software engineer",
    company: "revisiondojo (yc f24)",
    period: "may 2025 - present",
    summary: "bringing ai to the classroom",
    image: "/logos/revisiondojo.svg",
    skills: ["typescript", "next.js", "tailwindcss", "node.js", "postgres"],
  },
  {
    role: "software engineer",
    company: "canada china public relations foundation",
    period: "may 2025 - aug 2025",
    summary:
      "built a website for the canada & china public relations foundation",
    image: "/logos/ccprf.png",
    skills: ["typescript", "next.js", "tailwindcss"],
  },
  {
    role: "ai reasoning specialist",
    company: "shipd by datacurve (yc w24)",
    period: "sep 2024 - may 2025",
    summary: "labelled and analyzed data",
    image: "/logos/shipd.jpeg",
    skills: ["typescript", "python"],
  },
  {
    role: "bachelor of computer science",
    company: "university of waterloo",
    period: "sep 2024 - present",
    summary: "studying hard",
    image: "/logos/uwaterloo.svg",
    skills: ["cs", "math", "economics", "ai"],
  },
];

export default function ExperiencePage() {
  return (
    <PageContainer>
      <MotionSection delay={0.1}>
        <div className="space-y-2">
          <h1 className="h1">experience</h1>
          <p className="text-base text-zinc-600">just getting started</p>
        </div>
      </MotionSection>

      <MotionSection delay={0.2}>
        <Card>
          <CardContent className="space-y-6 pt-0">
            {experiences.map((experience, index) => (
              <div key={`${experience.role}-${experience.company}`}>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 ring-1 ring-black/5">
                      <Image
                        src={experience.image}
                        alt={`${experience.company} logo`}
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-zinc-900">
                        {experience.role}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {experience.company} · {experience.period}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600">{experience.summary}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {experience.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                {index < experiences.length - 1 ? (
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
