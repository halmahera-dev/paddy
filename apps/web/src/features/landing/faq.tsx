import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@hollou/ui/components/accordion";

import { SectionHeading } from "@/features/landing/components/section-heading";
import type { Dictionary } from "@/lib/i18n";

export function Faq({ t }: { t: Dictionary["landing"] }) {
  return (
    <section id="faq" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-8 lg:grid-cols-3 lg:gap-16">
        <SectionHeading title={t.faq.title}>{t.faq.lead}</SectionHeading>
        <Accordion className="lg:col-span-2">
          {t.faq.items.map(function renderQuestion(item) {
            return (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
