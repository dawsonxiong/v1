import { MotionSection } from "@/components/MotionSection";
import { PageContainer } from "@/components/PageContainer";
import ActivityFeed from "@/components/activity/ActivityFeed";

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
        <ActivityFeed />
      </MotionSection>
    </PageContainer>
  );
}
