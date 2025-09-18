import mongoose, { Schema, Types } from 'mongoose';
import { PeerReviewSettings as SharedPeerReviewSettings } from '@shared/types/PeerReview';

export interface PeerReviewSettings extends Omit<SharedPeerReviewSettings, '_id' | 'peerReviewId'>, Document {
  _id: Types.ObjectId;
  peerReviewId: Types.ObjectId;
}

const peerReviewSettingsSchema = new Schema<PeerReviewSettings>({
  peerReviewId: { type: Schema.Types.ObjectId, ref: 'PeerReview', required: true, unique: true },
  reviewerType: {
    type: String,
    enum: ['Individual', 'Team'],
    required: true,
    default: 'Individual',
  },
  revieweeType: {
    type: String,
    enum: ['Individual', 'Team'],
    required: true,
    default: 'Individual',
  },
  minReviewsPerReviewer: { type: Number, required: true, default: 1 },
  maxReviewsPerReviewer: { type: Number, required: true, default: 3 },
  assignmentMode: {
    type: String,
    enum: ['Random', 'Manual', 'Hybrid'],
    required: true,
    default: 'Random',
  },
});

const PeerReviewCommentModel = mongoose.model<PeerReviewSettings>('PeerReviewSettings', peerReviewSettingsSchema);

export default PeerReviewCommentModel;
