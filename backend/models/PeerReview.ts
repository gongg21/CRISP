import mongoose, { Schema, Types } from 'mongoose';
import { PeerReview as SharedPeerReview } from '@shared/types/PeerReview';

export interface PeerReview extends Omit<SharedPeerReview, '_id' | 'courseId' | 'peerReviewSettingsId' | 'peerReviewAssignmentIds'>, Document {
  _id: Types.ObjectId;
  course: Types.ObjectId;
  peerReviewSettingsId: Types.ObjectId;
  peerReviewAssignmentIds: Types.ObjectId[];
}

const peerReviewSchema = new Schema<PeerReview>({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now, required: true },
  peerReviewSettingsId: { type: Schema.Types.ObjectId, ref: 'PeerReviewSettings' },
  peerReviewAssignmentIds: [{ type: Schema.Types.ObjectId, ref: 'PeerReviewAssignment' }],
});

const PeerReviewModel = mongoose.model<PeerReview>('PeerReview', peerReviewSchema);

export default PeerReviewModel;
