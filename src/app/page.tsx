import Image from "next/image";

import { MotionSection } from "@/components/MotionSection";
import { PageContainer } from "@/components/PageContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <PageContainer>
      <MotionSection delay={0.1}>
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-stretch sm:gap-10 sm:text-left">
          <div className="space-y-2 sm:flex sm:flex-1 sm:flex-col sm:justify-end">
            <h1 className="h1">dawson xiong</h1>
            <p className="text-base leading-7 text-zinc-600">
              i'm not a tech bro <br />
              but i'm bullish on building <br />
              and enjoying life
            </p>
          </div>
          <div className="relative size-32 overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-[0_15px_40px_rgba(15,23,42,0.08)] ring-1 ring-black/5 sm:size-40 sm:flex-none">
            <Image
              src="/images/dawson.jpeg"
              alt="dawson"
              fill
              sizes="(min-width: 640px) 10rem, 8rem"
              quality={100}
              className="object-cover"
              priority
            />
          </div>
        </div>
      </MotionSection>

      <MotionSection delay={0.2}>
        <Card>
          <CardContent className="space-y-4 pt-0 text-sm leading-7 text-zinc-600">
            <p>
              lorem ipsum dolor sit amet, consectetur adipiscing elit. sed
              malesuada ex, vitae suscipit nulla lacinia vel. ut id nunc
              egestas, bibendum enim id, fermentum enim. ultricies euismod
              magna, et ultrices nisl scelerisque eu.
            </p>
            <Separator />
            <ul className="space-y-3">
              {[
                "fusce euismod felis ut justo",
                "sagittis in justo non tincidunt",
                "quisque in dui sit amet sapien",
              ].map((value) => (
                <li key={value} className="flex items-center gap-3 text-sm">
                  <span className="size-1.5 rounded-full bg-zinc-900/70" />
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </MotionSection>
    </PageContainer>
  );
}
