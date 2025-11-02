import { MotionSection } from "@/components/MotionSection";
import { PageContainer } from "@/components/PageContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const lifeUpdates = [
  {
    title: "saltum matutinorum",
    detail:
      "lorem ipsum dolor sit amet et consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
  },
  {
    title: "cursus montium",
    detail:
      "lorem ipsum dolor sit amet et consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
  },
  {
    title: "lectio libera",
    detail:
      "lorem ipsum dolor sit amet et consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
  },
];

export default function LifePage() {
  return (
    <PageContainer>
      <MotionSection delay={0.1}>
        <div className="space-y-2">
          <h1 className="h1">life</h1>
          <p className="text-base text-zinc-600">stuff i've been up to</p>
        </div>
      </MotionSection>

      <MotionSection delay={0.2}>
        <Card>
          <CardContent className="space-y-4 pt-0">
            {lifeUpdates.map((entry) => (
              <div key={entry.title} className="space-y-1.5">
                <p className="font-medium text-zinc-900">{entry.title}</p>
                <p className="text-sm text-zinc-600">{entry.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </MotionSection>
    </PageContainer>
  );
}
