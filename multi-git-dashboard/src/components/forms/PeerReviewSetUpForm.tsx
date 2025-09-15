
import {
  Button,
  TextInput,
  Textarea,
  Text,
  Radio,
  Checkbox,
} from '@mantine/core';
import { useForm } from '@mantine/form';

interface PeerReviewSetUpFormProps {
  courseId: string | string[] | undefined;
  onSetUpConfirmed: () => void;
}

const PeerReviewSetUpForm: React.FC<PeerReviewSetUpFormProps> = ({
  courseId,
  onSetUpConfirmed,
}) => {
  
  const form = useForm({
      initialValues: {
        assessmentName: '',
        description: '',
        startDate: '',
        endDate: '',
        reviewerType: 'individual',
        revieweeType: 'individual',
        minReviews: '0',
        maxReviews: '1',
        manualAssign: true,
        randomAssign: false,
      },
    });
    
    // TO DO: Add validation to ensure minReviews is not greater than maxReviews
    const handleSubmit = async () => {
      try {
        const response = await fetch(
          `/api/courses/${courseId}/peer-review-set-up`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: [form.values],
            }),
          }
        );
  
        if (response.ok) {
          onSetUpConfirmed();
        } else {
          alert('Error creating internal assessment');
        }
      } catch (error) {
        alert('Something went wrong when creating internal assessment');
      }
    };
  
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        withAsterisk
        label="Assessment Name"
        {...form.getInputProps('assessmentName')}
      />

      <Textarea
        withAsterisk
        label="Description"
        {...form.getInputProps('description')}
      />

      <TextInput
        withAsterisk
        label="Start Date"
        {...form.getInputProps('startDate')}
        placeholder="YYYY-MM-DD"
        type="date"
      />

      <TextInput
        withAsterisk
        label="End Date"
        {...form.getInputProps('endDate')}
        placeholder="YYYY-MM-DD"
        type="date"
      />

      <Text
        style={{ fontWeight: 'bold', marginTop: '16px', marginBottom: '8px' }}
      >
        Assignment Mode
      </Text>
      <div style={{ marginBottom: '16px', display: 'flex', flexDirection: "row", gap: '15px' }}>
        <Checkbox
          label="Manual"
          checked={form.values.manualAssign}
          onChange={event =>
            form.setFieldValue('manualAssign', event.currentTarget.checked)
          }
        />
        <Checkbox
          label="Random"
          checked={form.values.randomAssign}
          onChange={event =>
            form.setFieldValue('randomAssign', event.currentTarget.checked)
          }
        />
      </div>
      
      <Text
        style={{ fontWeight: 'bold', marginTop: '16px', marginBottom: '8px' }}
      >
        Reviewer Type
      </Text>
      <div style={{ marginBottom: '16px', display: 'flex', flexDirection: "row", gap: '15px' }}>
        <Radio.Group
          value={form.values.reviewerType}
          onChange={value => form.setFieldValue('reviewerType', value)}
        >
          <div style={{ display: 'flex', gap: '20px' }}>
            <Radio label="Team" value="team" />
            <Radio label="Individual" value="individual" />
          </div>
        </Radio.Group>
      </div>
      
      <Text
        style={{ fontWeight: 'bold', marginTop: '16px', marginBottom: '8px' }}
      >
        Reviewee Type
      </Text>
      <div style={{ marginBottom: '16px', display: 'flex', flexDirection: "row", gap: '15px' }}>
        <Radio.Group
          value={form.values.revieweeType}
          onChange={value => form.setFieldValue('revieweeType', value)}
        >
          <div style={{ display: 'flex', gap: '20px' }}>
            <Radio label="Team" value="team" />
            <Radio label="Individual" value="individual" />
          </div>
        </Radio.Group>
      </div>

      <TextInput
        label="Minimum Reviews per Reviewer"
        {...form.getInputProps('minReviews')}
        placeholder="Enter min reviews"
        type="number"
      />
      
      <TextInput
        label="Maximum Reviews per Reviewer"
        {...form.getInputProps('maxReviews')}
        placeholder="Enter max reviews"
        type="number"
      />

      <Button type="submit" mt="sm">
        Confirm Settings
      </Button>
    </form>
  );
};

export default PeerReviewSetUpForm;
