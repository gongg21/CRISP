import { hasFacultyPermission } from '@/lib/auth/utils';
import {
  Button,
  Center,
  Container,
  Group,
  Modal,
  Text,
  Tabs,
} from '@mantine/core';
import Link from 'next/link';
import PeerReviewSetUpForm from '../forms/PeerReviewSetUpForm';
import TutorialPopover from '../tutorial/TutorialPopover';
import { useState } from 'react';
import { DateUtils } from '@/lib/utils';
import { TeamSet } from '@shared/types/TeamSet';
import { Course } from '@shared/types/Course';
import PeerReviewInfo from './PeerReviewInfo';

interface PeerReviewProps {
  course: Course | undefined;
  courseId: string;
  dateUtils: DateUtils | undefined;
  teamSets: TeamSet[];
  onUpdate: () => void;
}

const PeerReview: React.FC<PeerReviewProps> = ({
  course,
  courseId,
  dateUtils,
  teamSets,
  onUpdate,
}) => {
  
  const handleSetUpConfirmed = () => {
    onUpdate();
  };
  
  return (
      <Tabs defaultValue={hasFacultyPermission() ? "peerReviewSettings" : "peerReviews"}>
        <Tabs.List
          style={{
            justifyContent: 'center',
          }}
        >
          {hasFacultyPermission() && (
            <Tabs.Tab value="peerReviewSettings">Peer Review Settings</Tabs.Tab>
          )}
          <Tabs.Tab value="peerReviews">Peer Reviews</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="peerReviewSettings" pt="xs">
         <PeerReviewSetUpForm
            courseId={courseId}
            onSetUpConfirmed={handleSetUpConfirmed}
         />
        </Tabs.Panel>

        {/* Tab Panel for Internal Assessments */}
        <Tabs.Panel value="peerReviews" pt="xs">
          {course && dateUtils ? (
            <PeerReviewInfo 
              courseId={courseId}
              teamSets={teamSets}
              dateUtils={dateUtils}
              onUpdate={onUpdate}
            />
          ) : (
            <Center>
              <Text>No Peer Reviews</Text>
            </Center>
          )}
        </Tabs.Panel>
      </Tabs>
  );
};

export default PeerReview;
