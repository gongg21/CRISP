import {
  ActionIcon,
  Button,
  Card,
  Group,
  Select,
  Table,
  Text,
} from '@mantine/core';
import { JiraBoard } from '@shared/types/JiraData';
import { TeamData } from '@shared/types/TeamData';
import { User } from '@shared/types/User';
import { IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface PeerReviewTeamCardProps {
  members: User[];
  TA: User | null;
  teamData: TeamData | null;
  onUpdate: () => void;
}

const PeerReviewTeamCard: React.FC<PeerReviewTeamCardProps> = ({
  members,
  TA,
  teamData,
}) => {
  
  const student_rows = members?.map(member => {
    return (
      <Table.Tr key={member._id}>
        <Table.Td style={{ textAlign: 'left' }}>{member.name}</Table.Td>
        <Table.Td style={{ textAlign: 'left' }}>{member.gitHandle}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Card shadow="sm" padding="lg" radius="md" my={6} withBorder>
      <Group style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '2px',
        marginBottom: '16px',
        borderBottom: '1px solid #c0c0c0',
        paddingBottom: '8px',
      }}>
        <Text>Teaching Assistant: <strong>{TA ? TA.name : 'None'}</strong></Text>
        <Text>Repository: <strong>{teamData ? teamData.repoName : 'None'}</strong></Text>
      </Group>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ textAlign: 'left', width: '30%' }}>
              Name
            </Table.Th>
            <Table.Th style={{ textAlign: 'left', width: '30%' }}>
              Git Handle
            </Table.Th>
            <Table.Th style={{ textAlign: 'left', width: '30%' }}>
              Assigned Peer Reviews
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{student_rows}</Table.Tbody>
      </Table>
    </Card>
  );
};

export default PeerReviewTeamCard;
