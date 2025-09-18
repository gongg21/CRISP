import mongoose, { Schema, Types } from 'mongoose';
import { PeerReviewComment as SharedPeerReviewComment } from '@shared/types/PeerReview';

export interface PeerReviewComment extends Omit<SharedPeerReviewComment, '_id' | 'peerReviewAssignmentId' | 'author'>, Document {
  _id: Types.ObjectId;
  peerReviewAssignmentId: Types.ObjectId;
}

const peerReviewCommentSchema = new Schema<PeerReviewComment>({
  peerReviewAssignmentId: { type: Schema.Types.ObjectId, ref: 'PeerReviewAssignment', required: true },
  filePath: { type: String, required: true },
  startLine: { type: Number, required: true },
  endLine: { type: Number, required: true },
});

const PeerReviewCommentModel = mongoose.model<PeerReviewComment>('PeerReviewComment', peerReviewCommentSchema);

export default PeerReviewCommentModel;
