@audit
Feature: Audit Log Functionality

  Background:
    Given I navigate to login page
    When I login as "Admin" role
    Then I should be logged in successfully
    Given the sidebar is loaded

  @regression @AUDIT_002
  Scenario: Verify audit log entries are generated for application actions
    When I click on Country Management in sidebar
    Then I should see the Country Management page

    When I click on Add Country button
    Then I should see the Add Country page

    And I create a new country
    Then I should see message "created successfully"

    When I search for "created" country by title
    And I click edit for "created" country

    When I update the country
    Then I should see message "updated successfully"

    When I search for "updated" country by title  
    When I delete "updated" country
    Then I should see message "deleted"

    When I click on Audit Log in sidebar
    Then I should see the Audit Log page
    Then I should see country audit log entry with action "INSERT"
    And I should see country audit log entry with action "UPDATE"
    And I should see country audit log entry with action "DELETE"

  @regression @AUDIT_003
  Scenario: Verify View link opens Audit Entry Details popup
    When I click on Audit Log in sidebar
    Then I should see the Audit Log page
    When I view audit log details "First audit"
    Then Audit Entry Details popup should be displayed

  @regression @AUDIT_004
  Scenario: Verify old and new values display correctly for UPDATE audit entries
    When I click on Country Management in sidebar
    Then I should see the Country Management page

    When I click on Add Country button
    Then I should see the Add Country page

    And I create a new country
    Then I should see message "created successfully"
    When I search for "created" country by title
    And I click edit for "created" country

    When I update the country
    Then I should see message "updated successfully"

    Given the sidebar is loaded
    When I click on Audit Log in sidebar
    Then I should see the Audit Log page
    When I open UPDATE audit entry details
    Then audit details should show correct old and new country values

  @regression @AUDIT_005
  Scenario Outline: Verify Action filter functionality
    When I click on Audit Log in sidebar
    Then I should see the Audit Log page
    When I select "<Action>" filter in audit log
    Then I should see audit log entry with action "<Action>"

    Examples:
      | Action |
      | INSERT |
      | DELETE |

  @regression @AUDIT_009
  Scenario Outline: Verify page size functionality
    When I click on Audit Log in sidebar
    Then I should see the Audit Log page
    When I set audit log records per page to <PageSize>
    Then records should load correctly

    Examples:
      | PageSize |
      |       20 |
      |      100 |
