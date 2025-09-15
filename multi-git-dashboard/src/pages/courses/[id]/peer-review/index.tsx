import PeerReview from '@/components/views/PeerReview';
import { Container } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import { hasFacultyPermission } from '@/lib/auth/utils';
import { TeamSet } from '@shared/types/TeamSet';
import {
  DateUtils,
  getCurrentWeekGenerator,
  getEndOfWeek,
  weekToDateGenerator,
} from '@/lib/utils';
import { Course } from '@shared/types/Course';
import dayjs from 'dayjs';

const PeerReviewListPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query as {
    id: string;
  };
  
  const courseApiRoute = `/api/courses/${id}`;
  const teamSetsApiRoute = `/api/courses/${id}/teamsets`;
  const peerReviewSettingsApiRoute = `/api/courses/${id}/peer-review/settings`;

  const [teamSets, setTeamSets] = useState<TeamSet[]>([]);
  const [course, setCourse] = useState<Course>();
  const [dateUtils, setDateUtils] = useState<DateUtils>();
  const permission = hasFacultyPermission();

  const onUpdate = () => {
    fetchTeamSets();
    fetchPeerReviewSettings();
    fetchCourse();
  };
  
  const fetchPeerReviewSettings = async () => {
    try {
      const response = await fetch(peerReviewSettingsApiRoute, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error('Error fetching peer review settings:', response.statusText);
      }
      else {
        const data = await response.json();
        console.log('Peer Review Settings:', data);
        // Handle peer review settings as needed
      }
    } catch (error) {
      console.error('Error fetching peer review settings:', error);
    }
  };

  const fetchTeamSets = async () => {
    try {
      const response = await fetch(teamSetsApiRoute, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Error fetching team set names:', response.statusText);
      } else {
        const data: TeamSet[] = await response.json();
        setTeamSets(data);
        console.log('Team Sets:', data);
      }
    } catch (error) {
      console.error('Error fetching team set names:', error);
    }
  };
  
  const fetchCourse = useCallback(async () => {
    try {
      const response = await fetch(courseApiRoute);
      if (!response.ok) {
        console.error('Error fetching course:', response.statusText);
        return;
      }
      const course: Course = await response.json();

      const courseStartDate = dayjs(course.startDate);
      const dateUtils = {
        weekToDate: weekToDateGenerator(courseStartDate),
        getCurrentWeek: getCurrentWeekGenerator(courseStartDate),
        getEndOfWeek: getEndOfWeek,
      };

      setCourse(course);
      setDateUtils(dateUtils);
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  }, [id]);

  useEffect(() => {
    if (router.isReady) {
      fetchTeamSets();
      fetchPeerReviewSettings();
      if (id) {
        fetchCourse();
      }
    }
  }, [router.isReady, id, fetchCourse]);

  return (
    <Container
      style={{
        marginTop: '40px',
      }}
    >
      <PeerReview
        course={course}
        courseId={id}
        teamSets={teamSets}
        dateUtils={dateUtils}
        onUpdate={onUpdate}
      />
    </Container>
  );
};

export default PeerReviewListPage;
