import { SectionHeading } from "@/features/landing/components/section-heading";
import { TeamCarousel } from "@/features/landing/components/team-carousel";
import { fill, type Dictionary } from "@/lib/i18n";

import akmalPhoto from "../../../public/members/akmal.webp";
import ariqPhoto from "../../../public/members/ariq.webp";
import falifPhoto from "../../../public/members/falif.webp";
import nadyaPhoto from "../../../public/members/nadya.webp";
import zakiPhoto from "../../../public/members/zaki.webp";

const photos = [nadyaPhoto, ariqPhoto, zakiPhoto, akmalPhoto, falifPhoto];

export function Team({ t }: { t: Dictionary["landing"] }) {
  const members = t.team.members.map((member, index) => {
    return {
      ...member,
      photo: photos[index],
      showLabel: fill(t.team.showMember, { name: member.name }),
      portraitAlt: fill(t.team.portraitOf, { name: member.name }),
    };
  });

  return (
    <section id="team" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionHeading title={t.team.title} isSplit>{t.team.lead}</SectionHeading>
      </div>
      <div className="mt-10">
        <TeamCarousel members={members} chooseLabel={t.team.chooseLabel} />
      </div>
    </section>
  );
}
