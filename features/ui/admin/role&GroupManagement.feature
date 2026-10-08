Feature: Role & GroupManagement Functionality

Background:
  Given I navigate to login page
  When I login as "Admin" role
  Then I should be logged in successfully

@regression @smoke @ROLE_MGMT_002 @ROLE_MGMT_008 @GRP_MGMT_003 @GRP_MGMT_005 @GRP_MGMT_008 @GRP_MGMT_009 @GRP_MGMT_014
Scenario: Role and Group Management Workflow End-to-End (Creation, Assignment, and Deletion)
  Given the sidebar is loaded
  When I click on Role Management in sidebar
  Then I should see the Role Management page

  When I create a new role for role group assignment
  Then I should see message "created"

  When I click on Group Management in sidebar
  Then I should see the Group Management page

  When I click on Add Group button
  Then I should see the Add Group page

  When I create a group with the created role
  Then I should see message "created"

  When I click on User Management in sidebar
  Then I should see the User Management page

  When I click on Add User button
  Then I should see the Add User page

  When I fill the full name in Add User form
  And I enter "valid" user email
  And I fill the password in Add User form
  And I select the created group for the user
  And I click Save User button
  Then I should see message "created successfully"
  Then I should see the User Management page

  When I search for "created" user by email
  Then I should see "created" user in the list

  When I delete "created" user
  Then I should see message "deleted"

  When I click on Group Management in sidebar
  Then I should see the Group Management page

  When I search for the created group by name
  Then I should see the created group in the list

  When I delete the created group
  Then I should see message "deleted"

  When I click on Role Management in sidebar
  Then I should see the Role Management page

  When I delete the created role
  Then I should see message "deleted"

 @ROLE_MGMT_002
Scenario: Verify Add Role functionality
    Given User navigates to Role Management page
    When User clicks on Add Role button
    And User enters role details
        | roleName     | entity       | description             |
        | User Manager | CBA Database | Role for user creation  |
    And User clicks on Save button
    Then I should see message "created"
    And Newly created role should appear in role list and be selected
    And All permissions should be unchecked by default

 @ROLE_MGMT_004
Scenario: Verify Role Name mandatory validation
    Given User navigates to Role Management page
    When User clicks on Add Role button
    And User leaves role name blank and enters description
        | description   |
        | QA Lead Role  |
    And User clicks on Save button
    Then Validation message should display for role name
    And Role should not be created
    And User should remain on Add Role popup

@ROLE_MGMT_005
Scenario: Verify duplicate role name validation
    Given User navigates to Role Management page
    When I create a new role for role group assignment
    Then I should see message "created"

    When User clicks on Add Role button
    And User enters role details
        | roleName  | entity       | description        |
        | (created) | CBA Database | Duplicate QA Lead  |
    And User clicks on Save button
    Then Validation message should display for role name
    And Role should not be created
    And Only one role tab named "createdRoleName" should exist

 @ROLE_MGMT_007
Scenario: Verify Edit Role functionality
    Given User navigates to Role Management page
    When I create a new role for role group assignment
    Then I should see message "created"

    When User checks the following permissions for entity "CBA Database"
        | permission |
        | Create     |
        | Edit       |
        | Annotate   |
    And User clicks on Save button for permissions
    Then I should see message "saved"

    When User refreshes the page
    And User selects the created role
    Then Permissions for entity "CBA Database" should include
        | permission |
        | Create     |
        | Edit       |
        | Annotate   |

@regression @ROLE_MGMT_008
Scenario: Verify Delete Role functionality
    Given User navigates to Role Management page
    When I create a new role for role group assignment
    Then I should see message "created"
    And I should see the created role in role list

    Given User navigates to Role Management page
    When I delete the created role
    Then I should see message "deleted"

@regression @ROLE_MGMT_009
Scenario: Verify permission checkbox selection and deselection functionality
    Given User navigates to Role Management page
    When User selects role "User Manager"

    When User checks the following permissions for entity "CBA Database"
        | permission |
        | Delete     |
    Then Permission "Delete" should be checked for entity "CBA Database"

    When User unchecks the following permissions for entity "CBA Database"
        | permission |
        | Delete     |
    Then Permission "Delete" should be unchecked for entity "CBA Database"

    When User checks the following permissions for entity "CBA Database"
        | permission |
        | Create     |
        | Edit       |
        | Delete     |
    And User clicks on Save button for permissions
    Then I should see message "saved"

    When User refreshes the page
    And User selects role "User Manager"
    Then Permissions for entity "CBA Database" should include
        | permission |
        | Create     |
        | Edit       |
        | Delete     |

@regression @GRP_MGMT_004
Scenario: Verify Edit Group functionality
  Given the sidebar is loaded

  When I click on Role Management in sidebar
  Then I should see the Role Management page
  When I create a new role for role group assignment
  Then I should see message "created"

  When I click on Group Management in sidebar
  Then I should see the Group Management page
  When I click on Add Group button
  Then I should see the Add Group page
  
  When I create a group with the created role
  Then I should see message "created"
  
  When I search for the created group by name
  Then I should see the created group in the list
  
  When I click edit for "created" group
  Then I should see the Edit Group page
  
  When I change the group name to a new value
  And I add a new combination with the created role, domain "Labour Law Database", country "Belgium"
  And I remove the current combination
  And I click Save Changes button
  Then I should see message "updated successfully"

  When I click on Group Management in sidebar
  Then I should see the Group Management page
  
  When I search for the updated group by name
  Then I should see the updated group in the list
  
  When I click edit for "updated" group
  Then I should see the Edit Group page

  Then I should see the updated group name in the edit form
  And I should not see the removed combination

  When I click on Group Management in sidebar
  Then I should see the Group Management page

  When I search for the updated group by name
  Then I should see the updated group in the list

  When I delete the updated group
  Then I should see message "deleted"

  When I click on Role Management in sidebar
  Then I should see the Role Management page

  When I delete the created role
  Then I should see message "deleted"

@regression @GRP_MGMT_007
Scenario: Verify Group Name mandatory validation
  Given the sidebar is loaded

  When I click on Group Management in sidebar
  Then I should see the Group Management page
  When I click on Add Group button
  Then I should see the Add Group page

  When I add a new combination with role "annotator", domain "CBA Database", country "Netherlands, Kingdom of the"
  And I click Save Group button
  Then I should see the group validation messages
    | Group name is required |
  And the Group Name field should be highlighted
  And I should see the Add Group page

@regression @GRP_MGMT_010
Scenario: Verify combination validation - Role missing
  Given the sidebar is loaded

  When I click on Group Management in sidebar
  Then I should see the Group Management page
  When I click on Add Group button
  Then I should see the Add Group page

  When I select domain "CBA Database"
  And I select country "Netherlands, Kingdom of the"
  And I click Add Row button
  Then I should see message "Select a Role and Domain before adding."
  And I should not see any combinations added

@regression @GRP_MGMT_010
Scenario: Verify combination validation - Domain missing
  Given the sidebar is loaded

  When I click on Group Management in sidebar
  Then I should see the Group Management page
  When I click on Add Group button
  Then I should see the Add Group page

  When I select role "annotator"
  And I click Add Row button
  Then I should see message "Select a Role and Domain before adding."
  And I should not see any combinations added

@regression @GRP_MGMT_010
Scenario: Verify combination validation - Duplicate combination
  Given the sidebar is loaded

  When I click on Group Management in sidebar
  Then I should see the Group Management page
  When I click on Add Group button
  Then I should see the Add Group page

  When I add a new combination with role "annotator", domain "CBA Database", country "Netherlands, Kingdom of the"
  Then I should see only one combination for role "annotator", domain "CBA Database", country "Netherlands, Kingdom of the"

  When I select role "annotator"
  And I select domain "CBA Database"
  And I select country "Netherlands, Kingdom of the"
  And I click Add Row button
  Then I should see message "That Role / Domain / Country combination is already added."
  And I should see only one combination for role "annotator", domain "CBA Database", country "Netherlands, Kingdom of the"

@regression @GRP_MGMT_011
Scenario: Verify Cancel functionality on Add New Group page
  Given the sidebar is loaded

  When I click on Group Management in sidebar
  Then I should see the Group Management page
  When I click on Add Group button
  Then I should see the Add Group page

  When I enter group name "Europe Team"
  And I add a new combination with role "annotator", domain "CBA Database", country "Netherlands, Kingdom of the"
  And I click Cancel button
  Then I should see the Group Management page
  And I should not see "Europe Team" group in the list

@regression @GRP_MGMT_018
Scenario: Verify Group creation without any combination
  Given the sidebar is loaded

  When I click on Group Management in sidebar
  Then I should see the Group Management page
  When I click on Add Group button
  Then I should see the Add Group page

  When I enter group name "Europe Team"
  And I click Save Group button
  Then I should see message "Add at least one Country / Domain / Role combination."
  And I should see the Add Group page

@regression @GRP_MGMT_017
Scenario: Verify duplicate Group Name validation
  Given the sidebar is loaded

  When I click on Group Management in sidebar
  Then I should see the Group Management page
  When I click on Add Group button
  Then I should see the Add Group page

  When I enter group name "Europe Duplicate Team"
  And I add a new combination with role "annotator", domain "CBA Database", country "Netherlands, Kingdom of the"
  And I click Save Group button
  Then I should see message "created successfully"

  When I click on Group Management in sidebar
  Then I should see the Group Management page
  When I click on Add Group button
  Then I should see the Add Group page

  When I enter group name "Europe Duplicate Team"
  And I add a new combination with role "annotator", domain "CBA Database", country "Netherlands, Kingdom of the"
  And I click Save Group button
  Then I should see message "already exists"
  And I should see the Add Group page

  When I click on Group Management in sidebar
  Then I should see the Group Management page
  When I search for "Europe Duplicate Team" group by name
  Then I should see "Europe Duplicate Team" group in the list

  When I delete "Europe Duplicate Team" group
  Then I should see message "deleted"

@regression @GRP_MGMT_019
Scenario: Verify assignment count calculation
  Given the sidebar is loaded

  When I click on Group Management in sidebar
  Then I should see the Group Management page
  When I click on Add Group button
  Then I should see the Add Group page

  When I enter group name "Assignment Count Team"
  And I add a new combination with role "annotator", domain "CBA Database", country "Netherlands, Kingdom of the"
  And I click Save Group button
  Then I should see message "created successfully"

  When I click on Group Management in sidebar
  Then I should see the Group Management page
  When I search for "Assignment Count Team" group by name
  Then the assignment count for "Assignment Count Team" group should be 1

  When I click edit for "Assignment Count Team" group
  Then I should see the Edit Group page
  When I add a new combination with role "analyst", domain "CBA Database", country "Belgium"
  And I click Save Changes button
  Then I should see message "updated successfully"

  When I click on Group Management in sidebar
  Then I should see the Group Management page
  When I search for "Assignment Count Team" group by name
  Then the assignment count for "Assignment Count Team" group should be 2

  When I click edit for "Assignment Count Team" group
  Then I should see the Edit Group page
  When I remove combination with role "analyst", domain "CBA Database", country "Belgium"
  And I click Save Changes button
  Then I should see message "updated successfully"

  When I click on Group Management in sidebar
  Then I should see the Group Management page
  When I search for "Assignment Count Team" group by name
  Then the assignment count for "Assignment Count Team" group should be 1

  When I delete "Assignment Count Team" group
  Then I should see message "deleted"

@regression @GRP_MGMT_020
Scenario: Verify deletion restriction for Group assigned to users
  Given the sidebar is loaded

  When I click on Role Management in sidebar
  Then I should see the Role Management page
  When I create a new role for role group assignment
  Then I should see message "created"

  When I click on Group Management in sidebar
  Then I should see the Group Management page
  When I click on Add Group button
  Then I should see the Add Group page
  When I create a group with the created role
  Then I should see message "created"

  When I click on User Management in sidebar
  Then I should see the User Management page
  When I click on Add User button
  Then I should see the Add User page
  When I fill the full name in Add User form
  And I enter "valid" user email
  And I fill the password in Add User form
  And I select the created group for the user
  And I click Save User button
  Then I should see message "created successfully"
  Then I should see the User Management page
  When I remember the created user as "assignedUser1"

  When I click on Add User button
  Then I should see the Add User page
  When I fill the full name in Add User form
  And I enter "valid" user email
  And I fill the password in Add User form
  And I select the created group for the user
  And I click Save User button
  Then I should see message "created successfully"
  Then I should see the User Management page
  When I remember the created user as "assignedUser2"

  When I click on Group Management in sidebar
  Then I should see the Group Management page
  When I search for the created group by name
  Then I should see the created group in the list

  When I delete the created group
  Then I should see an alert dialog titled "Group is in use"
  And the alert dialog message should contain "cannot be deleted"
  And the alert dialog should list the users "assignedUser1" and "assignedUser2"

  When I dismiss the alert dialog
  When I search for the created group by name
  Then I should see the created group in the list

  When I click on User Management in sidebar
  Then I should see the User Management page
  When I delete the users "assignedUser1" and "assignedUser2"

  When I click on Group Management in sidebar
  Then I should see the Group Management page
  When I search for the created group by name
  Then I should see the created group in the list

  When I delete the created group
  Then I should see message "deleted"

  When I click on Role Management in sidebar
  Then I should see the Role Management page
  When I delete the created role
  Then I should see message "deleted"
