Feature: Document Management

Background:
    Given I navigate to login page
    When I login as "Admin" role
    Then I should be logged in successfully

@regression @smoke @DM_TC_003
Scenario Outline: Verify mandatory field validation on Document Upload

    Given the sidebar is loaded

    When I click on Document Management in sidebar
    Then I should see the Document Management page

    When I click on Upload Document button
    Then I should see the Upload Document page

    When I fill upload form with title "<title>" language "<language>" and file "<uploadFile>"
    And I click Save without a valid file

    Then I should see validation messages "<expectedMessages>"
    And I should remain on the Upload Document page
    And document should not be uploaded

    Examples:
      | title         | language | uploadFile | expectedMessages                                                            |
      |               |          | no         | Document title is required, Language is required, Upload a document file. |
      | Test Document |          | no         | Language is required, Upload a document file.                             |
      |               | any      | no         | Document title is required, Upload a document file.                       |
      | Test Document | any      | no         | Upload a document file.                                                    |
      |               |          | yes        | Document title is required, Language is required                          |
      | Test Document |          | yes        | Language is required                                                       |
      |               | any      | yes        | Document title is required                                                 |


@regression @smoke @DM_TC_004
Scenario: Verify successful document upload and extraction initiation

    Given the sidebar is loaded

    When I click on Document Management in sidebar
    Then I should see the Document Management page

    When I click on Upload Document button
    Then I should see the Upload Document page

    When I upload a valid document

    Then I should see message "Document uploaded successfully"
    And uploaded document should appear in document listing
    
    When I wait until extraction completes
    When I delete uploaded document
    Then uploaded document should be deleted


# Duplicate upload validation will be enabled once backend/frontend validation is implemented.

# @regression @smoke @DM_TC_007
# Scenario: Verify duplicate document upload validation
#
#     Given the sidebar is loaded
#
#     When I click on Document Management in sidebar
#     Then I should see the Document Management page
#
#     When I click on Upload Document button
#     Then I should see the Upload Document page
#
#     When I upload a valid document
#     Then I should see message "Document uploaded successfully"
#
#     When I click on Upload Document button
#     Then I should see the Upload Document page
#
#     And I upload the same document again
#
#     Then I should see message "Document already exists"
#     And duplicate document should not be uploaded
#     And extraction should not start


@regression @smoke @DM_TC_011
Scenario: Verify navigation to Review Extraction page

    Given the sidebar is loaded

    When I click on Document Management in sidebar
    Then I should see the Document Management page

    When I click on Upload Document button
    Then I should see the Upload Document page

    When I upload a valid document

    When I wait until extraction completes

    And I search uploaded document
    And I open Review page

    Then Review Extraction page should open
    And original PDF should be visible
    And extracted HTML should be visible
    And extraction issues panel should be visible

    When I click on Document Management in sidebar
    And I delete uploaded document
    Then uploaded document should be deleted


@regression @smoke @DM_TC_015
Scenario: Verify complete Document Management workflow

    Given the sidebar is loaded

    When I click on Document Management in sidebar
    Then I should see the Document Management page

    When I click on Upload Document button
    Then I should see the Upload Document page

    When I upload a valid document

    When I wait until extraction completes

    And I search uploaded document
    And I open Review page

    When I resolve all extraction issues

    And I publish document

    Then I should see message "Document published successfully"

    When I click on Document Management in sidebar
    And I delete uploaded document
    Then uploaded document should be deleted

@regression @smoke @DM_TC_016
Scenario: Verify document deletion functionality

    Given the sidebar is loaded

    When I click on Document Management in sidebar
    Then I should see the Document Management page

    When I click on Upload Document button
    Then I should see the Upload Document page

    When I upload a valid document
    Then I should see message "Document uploaded successfully"
    And uploaded document should appear in document listing

    When I wait until extraction completes
    And I search uploaded document

    When I click on Delete icon for uploaded document
    Then delete confirmation popup should display

    When I confirm document deletion
    Then I should see message "deleted"
    And uploaded document should be deleted

@regression @smoke @DM_TC_018
Scenario: Verify Resolve issue functionality

    Given the sidebar is loaded

    When I click on Document Management in sidebar
    Then I should see the Document Management page

    When I click on Upload Document button
    Then I should see the Upload Document page

    When I upload a valid document
    Then I should see message "Document uploaded successfully"
    And uploaded document should appear in document listing

    When I wait until extraction completes
    And I search uploaded document
    And I open Review page

    Then Review Extraction page should open
    And extraction issues panel should be visible

    When I click on an extraction issue
    And I click on Resolve button for the issue

    Then resolve confirmation popup should display

    When I confirm issue resolution
    Then I should see issue resolved success message
    And extraction issue count should be reduced

    When I click on Document Management in sidebar
    And I delete uploaded document
    Then uploaded document should be deleted

@regression @smoke @DM_TC_020
Scenario: Verify extraction accuracy of extracted HTML against source PDF

    Given the sidebar is loaded

    When I click on Document Management in sidebar
    Then I should see the Document Management page

    When I click on Upload Document button
    Then I should see the Upload Document page

    When I upload a valid document
    Then I should see message "Document uploaded successfully"
    And uploaded document should appear in document listing

    When I wait until extraction completes
    And I search uploaded document
    And I open Review page

    Then Review Extraction page should open
    And original PDF should be visible
    And extracted HTML should be visible

    Then extraction accuracy compared to source PDF should be at least 90%

    When I click on Document Management in sidebar
    And I delete uploaded document
    Then uploaded document should be deleted

@regression @smoke @DM_TC_021
Scenario: Verify extracted HTML has no inline CSS in code view

    Given the sidebar is loaded

    When I click on Document Management in sidebar
    Then I should see the Document Management page

    When I click on Upload Document button
    Then I should see the Upload Document page

    When I upload a valid document
    Then I should see message "Document uploaded successfully"
    And uploaded document should appear in document listing

    When I wait until extraction completes
    And I search uploaded document
    And I open Review page

    Then Review Extraction page should open
    And extracted HTML should be visible

    When I switch Content Editor to code view
    Then extracted HTML should not contain inline CSS

    When I click on Document Management in sidebar
    And I delete uploaded document
    Then uploaded document should be deleted