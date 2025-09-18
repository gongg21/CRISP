import { DateUtils } from '@/lib/utils';
import { Course } from './Course';
import { Team } from './Team';
import { User } from './User';

export interface PeerReview {
  _id: string;
  courseId: string;
  repoName: string;
  repoUrl: string;
  assignedTeam: Team | null;
  reviewer: User | null;
  assignedBy: User | null;
  assignedAt: Date;
  deadline: Date | null;
  status: "Pending" | "In Progress" | "Completed";
}

export interface PeerReviewComment {
  _id: string;
  peerReviewId: string;
  filePath: string | null;
  startLine: number | null;
  endLine: number | null;
  author: User;
  comment: string;
  createdAt: Date;
  isOverall?: boolean;
}

export interface RepoNode {
  path: string;
  name: string;
  type: 'file' | 'directory';
  children?: RepoNode[];
}
