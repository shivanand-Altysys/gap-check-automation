import { TemplateBuilderData, TemplateBuilderQuestionData, TemplateData } from '../types';

export const DefaultTemplate: Partial<TemplateData> = {
  domain: 'User Management',
  description: 'Default template description',
  createSection: false
};

// Focused form for the conditional "Required Rule" scenario (SE_BUILDER_022):
// Question 2 is mandatory only when Question 1 ("Has salary increased?") = Yes.
export const RequiredRuleFormData: TemplateBuilderData = {
  sectionName: 'Salary Review',
  sections: [
    {
      name: 'Salary Review',
      questions: [
        { typeLabel: 'Yes / No', question: 'Has salary increased?' },
        {
          typeLabel: 'Short Answer',
          question: 'How much salary increase was provided?',
          requiredWhen: { sourceQuestion: 'Has salary increased?', value: 'yes' }
        }
      ]
    }
  ]
};

// Focused form for the conditional "Add Logic" visibility scenario (SE_BUILDER_023):
// Question 2 is hidden until Question 1 ("Has salary increased?") = Yes.
export const VisibilityRuleFormData: TemplateBuilderData = {
  sectionName: 'Salary Review',
  sections: [
    {
      name: 'Salary Review',
      questions: [
        { typeLabel: 'Yes / No', question: 'Has salary increased?' },
        {
          typeLabel: 'Short Answer',
          question: 'How much salary increase was provided?',
          visibleWhen: { sourceQuestion: 'Has salary increased?', value: 'yes' }
        }
      ]
    }
  ]
};

// Minimal publishable form for the versioning scenario (SE_BUILDER_026): one section with a single
// question, enough to publish version 1.
export const VersioningBaseFormData: TemplateBuilderData = {
  sectionName: 'Overtime',
  sections: [
    {
      name: 'Overtime',
      questions: [{ typeLabel: 'Yes / No', question: 'Do you work overtime?' }]
    }
  ]
};

// The question added when editing the published template to produce version 2.
export const OvertimeLegalQuestion: TemplateBuilderQuestionData = {
  typeLabel: 'Yes / No',
  question: 'Is overtime pay legally mandatory?'
};

// Two distinct questions that deliberately share a question key in different letter casing
// (SE_BUILDER_031) — exercises the case-insensitive question-key uniqueness validation.
export const DuplicateKeyFormData: TemplateBuilderData = {
  sectionName: 'Working Hours',
  sections: [
    {
      name: 'Working Hours',
      questions: [
        { typeLabel: 'Short Answer', question: 'What are your usual working hours?', questionKey: 'working_hours' },
        { typeLabel: 'Short Answer', question: 'How many hours do you work per week?', questionKey: 'Working_Hours' }
      ]
    }
  ]
};

// Two questions (a parent and a dependent) for the incomplete-logic negative case (SE_BUILDER_034):
// a visibility rule referencing the parent is left without a condition and must not save.
export const IncompleteLogicData: TemplateBuilderData = {
  sectionName: 'Salary Review',
  sections: [
    {
      name: 'Salary Review',
      questions: [
        { typeLabel: 'Yes / No', question: 'Has salary increased?' },
        { typeLabel: 'Short Answer', question: 'How much was the increase?' }
      ]
    }
  ]
};

export const TemplateBuilderFormData: TemplateBuilderData = {
  sectionName: 'Working Hours',
  sections: [
    {
      name: 'Working Hours',
      questions: [
        { typeLabel: 'Short Answer', question: 'What is your employment type?', required: true, helpText: 'e.g. Full-time, Part-time, Contract', previewAnswer: 'Full-time' },
        { typeLabel: 'Paragraph', question: 'Describe your working hours arrangement.', comment: true, helpText: 'Please provide details about your working hours', previewAnswer: 'Standard 9-5, flexible Fridays' },
        { typeLabel: 'Multiple Choice', question: 'Which shift do you usually work?', options: ['Morning shift', 'Night shift', 'Afternoon'], previewAnswer: 'Morning shift' },
        { typeLabel: 'Yes / No', question: 'Do you receive overtime pay?', previewAnswer: 'yes' },
      ]
    },
    {
      name: 'Employment Details',
      questions: [
        { typeLabel: 'Dropdown', question: 'Select your contract type.', options: ['Permanent', 'Temporary', 'Contractor'], required: true, previewAnswer: 'Permanent' },
        { typeLabel: 'Multi Select', question: 'Select applicable work locations.', options: ['Office', 'Remote', 'Hybrid'], helpText: 'Select all that apply', previewAnswer: ['Office'] },
        { typeLabel: 'Date', question: 'What is your contract start date?', previewAnswer: '2024-01-01' },
        { typeLabel: 'Number', question: 'How many hours do you work per week?', required: true, previewAnswer: '40' },
        { typeLabel: 'Short Answer', question: 'Who is your line manager?', comment: true, previewAnswer: 'Jane Doe' }
      ]
    },
    {
      name: 'Compensation',
      questions: [
        { typeLabel: 'Number', question: 'What is your monthly salary?', previewAnswer: '3000' },
        { typeLabel: 'Paragraph', question: 'Describe any bonuses or allowances.', previewAnswer: 'Performance bonus annually' },
        { typeLabel: 'Dropdown', question: 'What is your pay frequency?', options: ['Monthly', 'Weekly', 'Bi-weekly'], previewAnswer: 'Monthly' },
        { typeLabel: 'Yes / No', question: 'Are you eligible for overtime pay?', previewAnswer: 'yes' },
        { typeLabel: 'Short Answer', question: 'Currency of salary (e.g., USD)', visibleWhen: { sourceQuestion: 'Are you eligible for overtime pay?', value: 'yes' }, previewAnswer: 'USD' }
      ]
    },
    {
      name: 'Benefits',
      questions: [
        { typeLabel: 'Short Answer', question: 'Name of health provider (if any)', previewAnswer: 'Acme Health' },
        { typeLabel: 'Paragraph', question: 'Describe any additional benefits or perks.', previewAnswer: 'Company gym access' },
        { typeLabel: 'Yes / No', question: 'Do you receive a pension contribution?', previewAnswer: 'yes' },
        { typeLabel: 'Number', question: 'Number of paid leave days per year', visibleWhen: { sourceQuestion: 'Do you receive a pension contribution?', value: 'yes' }, previewAnswer: '20' }
      ]
    }
  ]
};

export const TemplateBuilderMultiSelectFromListData: TemplateBuilderData = {
  sectionName: 'Working Hours',
  sections: [
    {
      name: 'Working Hours',
      questions: [
        {
          typeLabel: 'Multi Select',
          question: 'Question = Applicable Shift Patterns',
          sourceListName: 'cobra-vocab-tishift',
          searchKeyword: 'cobra-vocab-tishift',
          previewAnswer: ['Morning shifts', 'Night shifts']
        }
      ]
    }
  ]
};

export const TemplateBuilderLogicData: TemplateBuilderData = {
  sectionName: 'Working Hours',
  sections: [
    {
      name: 'Working Hours',
      questions: [
        {
          typeLabel: 'Yes / No',
          question: 'Does the agreement have clauses on standard working hours?'
        },
        {
          typeLabel: 'Multiple Choice',
          question: 'Are working hours per day agreed?',
          options: ['Yes', 'No'],
          visibleWhen: {
            sourceQuestion: 'Does the agreement have clauses on standard working hours?',
            value: 'yes'
          }
        }
      ]
    }
  ]
};
