'use client';
import { DomaineList } from './DomaineList';

type DomaineListProps = React.ComponentProps<typeof DomaineList>['domaines'];

export function RubriquesOverviewDomaines({
  domaines, }: { domaines: DomaineListProps; }) {

  return (<DomaineList domaines={domaines} />);
}