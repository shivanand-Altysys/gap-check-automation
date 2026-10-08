Feature: Create Survey Template

  Background:
    Given I navigate to login page
    When I login as "Admin" role
    Then I should be logged in successfully

  @regression @smoke @SE_CREATE_01 @SE_TC_001 @SE_TC_002 @SE_TC_004
  Scenario: Verify navigation to template builder page after successful template creation
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    Then I should see "created" template in the list

    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list


  @regression @smoke @SE_TC_003
  Scenario: Verify Edit Survey Template functionality
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    Then I should see "created" template in the list

    When I click edit for "created" template
    Then I should see the Edit Template page

    When I update the template
    Then I should see message "updated"

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page

    When I delete "created" template
    Then I should see message "deleted"

  @regression @negative @SE_TC_005
  Scenario: Validation messages when required fields missing in Create Template
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I click Proceed on Create Template
    Then I should see the create template validation messages
      | Template name is required |
      | Domain is required        |

  @regression @smoke @SE_BUILDER_001
  Scenario: Verify template status after saving and publishing form builder
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I build the survey form with all question types and logic
    And I validate the survey form in preview
    And I save the survey form builder
    Then I should see message "Form saved"

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    Then I should see "created" template status as "Draft"

    When I click form builder for "created" template
    Then I should see the Form Builder page
    When I publish the survey form builder
    Then I should see message "Form published"

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    Then I should see "created" template status as "Published"

    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list

  @regression @SE_BUILDER_003
  Scenario: Verify duplicate section functionality in Template Builder
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I add a section "Employment Information" to the form builder
    And I add a "Short Answer" question "Employer Name" to the current section
    And I duplicate section "Employment Information"
    Then I should see a duplicated section for "Employment Information"

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list

  @regression @SE_BUILDER_004
  Scenario: Verify Delete Section functionality in Template Builder
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I add a section "Employment Information" to the form builder
    And I add a "Short Answer" question "Employer Name" to the current section
    And I delete section "Employment Information"
    Then I should not see section "Employment Information" in the form builder

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list

  @regression @SE_BUILDER_007
  Scenario: Verify Question Key auto-generation and edit functionality
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I add a section "Working Hours" to the form builder
    And I add a "Short Answer" question "Are working hours per day agreed?" to the current section
    Then the question key should be "are_working_hours_per_day_agreed"

    When I update the question key to "working_hours_agreed"
    And I save the survey form builder
    Then I should see message "Form saved"

    When I reload the form builder page
    Then the question key should be "working_hours_agreed"

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list

  @regression @SE_BUILDER_022
  Scenario: Verify Required Rule functionality — question becomes mandatory only when condition is met
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I build the survey form with a conditional required rule
    And I save the survey form builder
    Then I should see message "Form saved"

    When I validate the conditional required rule in preview

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list

  @regression @SE_BUILDER_023
  Scenario: Verify Add Logic functionality — question is hidden until a condition is met
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I build the survey form with a conditional visibility rule
    And I save the survey form builder
    Then I should see message "Form saved"

    When I validate the conditional visibility rule in preview

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list

  @regression @SE_BUILDER_026
  Scenario: Verify previous version behavior after publishing a new version
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I build a publishable survey form
    And I save the survey form builder
    Then I should see message "Form saved"
    When I publish the survey form builder
    Then I should see message "Form published"

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    Then I should see "created" template status as "Published"
    When I record the published version of "created" template

    When I click form builder for "created" template
    Then I should see the Form Builder page
    When I add a question in the form builder
    And I publish the edited template as a new version
    Then I should see message "Form published"

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    Then the latest published version of "created" template should be newer than the recorded version
    Then the previously published version of "created" template should still be available

    When I delete all versions of "created" template
    Then I should not see "created" template in the list

  @regression @negative @SE_BUILDER_031
  Scenario: Verify Question Key uniqueness validation — duplicate keys are rejected case-insensitively
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I build the survey form with duplicate question keys
    Then I should see the duplicate question key error on the question cards
    When I save the survey form builder
    Then I should see message "Duplicate question key"

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list

  @regression @negative @SE_BUILDER_033
  Scenario: Verify validation when question text is blank
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I add a "Short Answer" question without entering question text
    And I attempt to publish the survey form builder
    Then I should see message "needs a label before publishing"
    Then I should see the Form Builder page

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list

  @regression @negative @SE_BUILDER_034 @SE_034_C1
  Scenario: Section is not created when its name is blank
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I attempt to add a section with a blank name
    Then I should see the section name required validation
    When I cancel the section modal

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list

  @regression @negative @SE_BUILDER_034 @SE_034_C2
  Scenario: Question with blank text cannot be published
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I add a "Short Answer" question without entering question text
    And I attempt to publish the survey form builder
    Then I should see message "needs a label before publishing"
    Then I should see the Form Builder page

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list

  @regression @negative @SE_BUILDER_034 @SE_034_C3
  Scenario: Multiple Choice question without options cannot be published
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I add a "Multiple Choice" question with text "Is overtime pay legally mandatory?" and no options
    And I attempt to publish the survey form builder
    Then I should see message "at least two options before publishing"
    Then I should see the Form Builder page

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list

  @regression @negative @SE_BUILDER_034 @SE_034_C4
  Scenario: Dropdown question without options cannot be published
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I add a "Dropdown" question with text "Select employment contract type" and no options
    And I attempt to publish the survey form builder
    Then I should see message "at least two options before publishing"
    Then I should see the Form Builder page

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list

  @regression @negative @SE_BUILDER_034 @SE_034_C5
  Scenario: Incomplete logic rule (no condition) is not saved
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I build the survey form for an incomplete logic rule
    And I attempt to configure a logic rule with no condition
    Then I should see the Form Builder page

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list

  @regression @negative @SE_BUILDER_034 @SE_034_C6
  Scenario: Empty template (no sections or questions) cannot be published
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I attempt to publish the survey form builder
    Then I should see message "Cannot publish an empty form"
    Then I should see the Form Builder page

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list

  @regression @negative @SE_BUILDER_034 @SE_034_C7
  Scenario: Template with a section but no questions cannot be published
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I add a section named "Working Hours"
    And I attempt to publish the survey form builder
    Then I should see message "Cannot publish an empty form"
    Then I should see the Form Builder page

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list

  @regression @negative @SE_BUILDER_034 @SE_034_C8
  Scenario: Over-long question text is capped at the max length
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I add a "Short Answer" question with a 1000 character text
    Then the question text should be capped at 300 characters

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list


  @regression @SE_BUILDER_016
  Scenario: Verify Multi Select question using From List option
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page
    When I build the survey form with multi-select from list
    And I validate the survey form in preview for multi-select from list
    And I save the survey form builder
    Then I should see message "Form saved"
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    Then I should see "created" template status as "Draft"
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list

@regression @SE_BUILDER_010
  Scenario: Verify Add Logic functionality between questions
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I build the survey form with add logic between questions
    Then I should see Question 2 hidden initially and visible after answering Question 1

    When I save the survey form builder
    Then I should see message "Form saved"

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    Then I should see "created" template status as "Draft"
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list

@regression @SE_BUILDER_009
  Scenario: Verify Delete Question functionality in Template Builder
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I add a question "Select employment contract type" in the existing section
    Then I should see the Form Builder page
    When I delete question "Select employment contract type"
    Then I should not see question "Select employment contract type" in the section

    When I save the survey form builder
    Then I should see message "Form saved"

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    Then I should see "created" template status as "Draft"
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list
  
@regression @SE_BUILDER_008
  Scenario: Verify Duplicate Question functionality in Template Builder
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page

    When I add a "Short Answer" question with text "What is the minimum wage for workers in this country?" in the existing section
    Then I should see the Form Builder page
    When I click duplicate for question "What is the minimum wage for workers in this country?"
    Then I should see the duplicated "Short Answer" question "What is the minimum wage for workers in this country?" below the original

    When I save the survey form builder
    Then I should see message "Form saved"

    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    Then I should see "created" template status as "Draft"
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list

  @regression @SE_BUILDER_017
  Scenario: Verify Search functionality in Multi Select dropdown
    Given the sidebar is loaded
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    When I click the Add Template button on Survey Engine page
    Then I should see the Create Template page
    When I create a new survey template
    Then I should see message "created"
    Then I should see the Form Builder page
    When I build the survey form with multi-select from list
    And I validate the survey form in preview for multi-select from list
    And I save the survey form builder
    Then I should see message "Form saved"
    When I click on Survey Engine in sidebar
    Then I should see the Survey Engine page
    Then I should see "created" template status as "Draft"
    When I delete "created" template
    Then I should see message "deleted"
    Then I should not see "created" template in the list
