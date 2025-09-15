import { DateUtils } from '@/lib/utils';
import {
  Accordion,
  Center,
  Container,
  Loader,
  ScrollArea,
  Tabs,
} from '@mantine/core';
import { Profile } from '@shared/types/Profile';
import { Team as SharedTeam } from '@shared/types/Team';
import { TeamData } from '@shared/types/TeamData';
import { Status } from '@shared/types/util/Status';
import { useEffect, useState } from 'react';
import PeerReviewAccordionItem from '../peer-review/PeerReviewAccordianItem';
import { useTutorialContext } from '../tutorial/TutorialContext';
import TutorialPopover from '../tutorial/TutorialPopover';
import { TeamSet } from '@shared/types/TeamSet';

interface PeerReviewInfoProps {
  courseId: string;
  dateUtils: DateUtils;
  teamSets: TeamSet[];
  onUpdate: () => void;
}

export interface Team extends Omit<SharedTeam, 'teamData'> {
  teamData: string; // TeamData not populated
}

export type ProfileGetter = (gitHandle: string) => Promise<Profile>;

const PeerReviewInfo: React.FC<PeerReviewInfoProps> = ({
  courseId,
  dateUtils,
  teamSets,
  onUpdate,
}) => {
  const { curTutorialStage } = useTutorialContext();

  const [teams, setTeams] = useState<Team[]>([]);
  const [teamDatas, setTeamDatas] = useState<TeamData[]>([]);
  const [status, setStatus] = useState<Status>(Status.Idle);

  const [studentMap, setStudentMap] = useState<Record<string, Profile>>({});

  const [activeTab, setActiveTab] = useState<string | null>(
    teamSets ? teamSets[0]?.name : null
  );

  const getTeams = async () => {
    const res = await fetch(`/api/teams/course/${courseId}`);
    if (!res.ok) throw new Error('Failed to fetch teams');
    const teams: Team[] = await res.json();
    return teams;
  };

  const getTeamDatas = async () => {
    const res = await fetch(`/api/github/course/${courseId}`);
    if (!res.ok) throw new Error('Failed to fetch team data');
    const teamDatas: TeamData[] = await res.json();
    return teamDatas;
  };

  const setActiveTabAndSave = (tabName: string) => {
    onUpdate();
    setActiveTab(tabName);
    localStorage.setItem(`activeTeamSetTab_${courseId}`, tabName);
  };

  useEffect(() => {
    const savedTab = localStorage.getItem(`activeTeamSetTab_${courseId}`);
    if (savedTab && teamSets.some(teamSet => teamSet.name === savedTab)) {
      setActiveTab(savedTab);
    }
  }, [teamSets]);

  const headers = teamSets.map((teamSet, index) => (
    <Tabs.Tab
      key={index}
      value={teamSet.name}
      onClick={() => {
        setActiveTabAndSave(teamSet.name);
      }}
    >
      {teamSet.name}
    </Tabs.Tab>
  ));

  const data = teamDatas.map(teamData => {
    const team = teams.find(team => team.teamData === teamData._id);
    return { team, teamData };
  });

  useEffect(() => {
    const fetchData = async () => {
      setStatus(Status.Loading);
      try {
        const fetchedTeams = await getTeams();
        setTeams(fetchedTeams);
        const fetchedTeamDatas = await getTeamDatas();
        setTeamDatas(fetchedTeamDatas);
        if (teamDatas.length > 0) setActiveTabAndSave(teamSets[0].name);
        setStatus(Status.Idle);
      } catch (error) {
        setStatus(Status.Error);
        console.error(error);
      }
    };
    fetchData();
  }, [courseId]);

  if (status === Status.Loading)
    return (
      <Center>
        <Container mt={40}>
          <Loader />
        </Container>
      </Center>
    );
  if (status === Status.Error) return <Center>No GitHub Data Available</Center>;
  if (!teams.length || !teamDatas.length)
    return <Center>No teams found.</Center>;

  const renderOverviewAccordion = () => {
    return (
      <Accordion
        defaultValue={teamDatas.length > 0 ? [teamDatas[0]._id] : []}
        multiple
        variant="separated"
        mx={20}
      >
        {data.map(({ team, teamData }, idx) => (
          <PeerReviewAccordionItem
            key={teamData._id}
            team={team}
            teamData={teamData}
          />
        ))}
      </Accordion>
    )
  };

  return (
    <ScrollArea.Autosize mt={20} mah={750} scrollbarSize={8}>
      <Tabs value={activeTab} mx={20} style={{ paddingBottom: '20px' }}>
        {teamSets.map(teamSet => (
          <Tabs.Panel key={teamSet._id} value={teamSet.name}>
            {renderOverviewAccordion()}
          </Tabs.Panel>
        ))}
      </Tabs>
    </ScrollArea.Autosize>
  );
};

export default PeerReviewInfo;
