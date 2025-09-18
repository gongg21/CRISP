import { Card, Textarea, Group, Button } from '@mantine/core';
import { useState } from 'react';
import { PeerReviewComment } from '@shared/types/PeerReview';
import { User } from '@shared/types/User';

interface PeerReviewCommentWidgetProps {
  startLine: number;
  endLine: number;
  currFile: string;
  peerReviewId: string;
  currUser: User;
  onSave: (c: Omit<PeerReviewComment, '_id' | 'createdAt' | 'updatedAt'>, cleanup: () => void) => void;
  onCancel: () => void;
}

const PeerReviewCommentWidget: React.FC<PeerReviewCommentWidgetProps> = ({
  startLine,
  endLine,
  currFile,
  peerReviewId,
  currUser,
  onSave,
  onCancel,
}) => {
  const [commentText, setCommentText] = useState<string>("");
  
  return (
    <Card withBorder shadow="sm" p="xs">
      <Textarea
        placeholder={`Comment on lines ${startLine} to ${endLine}`}
        autosize
        minRows={3}
        value={commentText}
        onChange={(e) => setCommentText(e.currentTarget.value)}
      />
      <Group mt="xs">
        <Button
          size="xs"
          onClick={() => {
            onSave({
                peerReviewId,
                filePath: currFile,
                startLine,
                endLine,
                comment: commentText.trim(),
                author: currUser,
              },
              onCancel
            );
          }}
        >
          Save
        </Button>
        <Button variant="subtle" size="xs" onClick={onCancel}>
          Cancel
        </Button>
      </Group>
    </Card>
  );
};

export default PeerReviewCommentWidget;


