import { PageHeader } from "@/components/page-header";
import { PeopleManager } from "@/components/people-manager";
import { getPeople } from "@/lib/api";

export const metadata = { title: "People" };
export default async function PeoplePage() { const people = await getPeople(); return <><PageHeader eyebrow="Paddling crew" title="People make the miles matter." description="Add paddlers, choose your current identity, and assign the crew to trips." /><PeopleManager initialPeople={people} /></>; }
