import mongoose, { Schema, Types } from 'mongoose';
import { PeerReviewAssignment as SharedPeerReviewAssignment } from '@shared/types/PeerReview';

export interface PeerReviewAssignment
  extends Omit<SharedPeerReviewAssignment,
  '_id' | 'peerReviewId' | 'reviewerUser' | 'revieweeUser' |
  'reviewerTeam' | 'revieweeTeam' | 'assignedBy'>,
  Document {
    _id: Types.ObjectId;
    peerReviewId: Types.ObjectId;
    reviewerUser: Types.ObjectId | null;
    revieweeUser: Types.ObjectId | null;
    reviewerTeam: Types.ObjectId | null;
    revieweeTeam: Types.ObjectId | null;
    assignedBy: Types.ObjectId | null;
}

const peerReviewAssignmentSchema = new Schema<PeerReviewAssignment>({
  peerReviewId: { type: Schema.Types.ObjectId, ref: 'PeerReview', required: true },
  repoName: { type: String, required: true },
  repoUrl: { type: String, required: true },
  reviewerUser: { type: Schema.Types.ObjectId, ref: 'User' },
  revieweeUser: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewerTeam: { type: Schema.Types.ObjectId, ref: 'Team' },
  revieweeTeam: { type: Schema.Types.ObjectId, ref: 'Team' },
  assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedAt: { type: Date, default: Date.now, required: true },
  deadline: { type: Date },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
});

const PeerReviewAssignmentModel = mongoose.model<PeerReviewAssignment>('PeerReviewAssignment', peerReviewAssignmentSchema);

export default PeerReviewAssignmentModel;
