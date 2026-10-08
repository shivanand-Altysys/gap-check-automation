@user-management
Feature: User Management Functionality

Background:
  Given I navigate to login page
  When I login as "Admin" role
  Then I should be logged in successfully

@regression @smoke @USER_TC_012
Scenario: Verify successful creation of new user and first-time login workflow

  Given the sidebar is loaded
  When I click on User Management in sidebar 
  Then I should see the User Management page

  When I click on Add User button
  Then I should see the Add User page

  And I create a new user
  Then I should see message "created successfully"

  When I click Logout
  Then I should see message "You have been logged out successfully."

  When I enter "created" username for "User"
  When I enter "created" password for "User"
  And I click on login button

  When I change my password

  When I enter "created" username for "User"
  When I enter "new" password for "User"
  And I click on login button

  Then I should be logged in successfully

  When I click Logout
  Then I should see message "You have been logged out successfully."

  When I login as "Admin" role

  When I click on User Management in sidebar 
  Then I should see the User Management page

  When I search for "created" user by email
  Then I should see "created" user in the list

  When I delete "created" user
  Then I should see message "deleted"

@regression @smoke @USER_TC_002 @USER_TC_007
Scenario: Verify successful creation and deletion of new user

  Given the sidebar is loaded
  When I click on User Management in sidebar 
  Then I should see the User Management page

  When I click on Add User button
  Then I should see the Add User page

  And I create a new user
  Then I should see message "created successfully" 
  Then I should see the User Management page

  When I search for "created" user by email
  Then I should see "created" user in the list

  When I delete "created" user
  Then I should see message "deleted"

  When I search for "created" user by email
  Then I should not see "created" user in the list

@regression @smoke @USER_TC_005
Scenario: Verify editing existing user details

  Given the sidebar is loaded
  When I click on User Management in sidebar
  Then I should see the User Management page

  When I click on Add User button
  Then I should see the Add User page

  And I create a new user
  Then I should see message "created successfully"
  Then I should see the User Management page

  When I search for "created" user by email
  Then I should see "created" user in the list

  When I click edit for "created" user
  Then I should see the Edit User page

  When I update the user
  Then I should see message "updated successfully"
  Then I should see the User Management page

  When I search for "created" user by email
  Then I should see the updated name in the user list

  When I delete "created" user
  Then I should see message "deleted"

@regression @smoke @USER_TC_003
Scenario: Verify validation messages for invalid user details during user creation (Blank fields)
  
  Given the sidebar is loaded
  When I click on User Management in sidebar
  Then I should see the User Management page

  When I click on Add User button
  Then I should see the Add User page

  When I click Save User button
  Then I should see the add user validation messages
      | Full name is required |
      | Email is required     |
      | Password is required  |


@regression @smoke @USER_TC_003
Scenario: Verify validation messages for invalid user details during user creation (Invalid Email)

  Given the sidebar is loaded
  When I click on User Management in sidebar
  Then I should see the User Management page

  When I click on Add User button
  Then I should see the Add User page

  When I fill the full name in Add User form
  And I enter "invalid" user email
  And I fill the password in Add User form
  And I select "admin" groups for the user
  And I click Save User button
  Then I should see the add user validation messages
    | Enter a valid email address |


@regression @smoke @USER_TC_004 
Scenario: Verify duplicate email validation for existing active/inactive users (existing active user)

  Given the sidebar is loaded
  When I click on User Management in sidebar
  Then I should see the User Management page

  When I click on Add User button
  Then I should see the Add User page

  When I fill the full name in Add User form
  And I enter "admin" user email
  And I fill the password in Add User form
  And I select "admin" groups for the user
  And I click Save User button
  Then I should see message "A user with that email address already exists."

@regression @smoke @USER_TC_006
Scenario: Verify user status toggle functionality (Activate/Deactivate User)

  Given the sidebar is loaded
  When I click on User Management in sidebar 
  Then I should see the User Management page

  When I click on Add User button
  Then I should see the Add User page

  And I create a new user
  Then I should see message "created successfully" 
  Then I should see the User Management page

  When I search for "created" user by email
  And I should see "created" user in the list
  Then I should see "created" user status as "Active"

  When I deactivate "created" user
  Then I should see message "deactivated"

  When I search for "created" user by email
  Then I should see "created" user status as "Inactive"

  When I click Logout
  Then I should see message "You have been logged out successfully."

  When I enter "created" username for "User"
  When I enter "created" password for "User"
  And I click on login button
  Then I should see message "Incorrect email or password."

  When I login as "Admin" role

  When I click on User Management in sidebar 
  Then I should see the User Management page

  When I search for "created" user by email
  Then I should see "created" user in the list

  When I delete "created" user
  Then I should see message "deleted"

@regression @USER_TC_017
Scenario: Verify Cancel button functionality on Add New User page

  Given the sidebar is loaded
  When I click on User Management in sidebar
  Then I should see the User Management page

  When I click on Add User button
  Then I should see the Add User page

  When I fill the full name in Add User form
  And I enter "valid" user email
  And I fill the password in Add User form
  And I select "admin" groups for the user
  And I click Cancel button

  Then I should see the User Management page
  When I search for "created" user by email
  Then I should not see "created" user in the list

@regression @smoke @USER_TC_008
Scenario: Verify filtering users by status

  Given the sidebar is loaded
  When I click on User Management in sidebar
  Then I should see the User Management page

  When I click on Add User button
  Then I should see the Add User page
  And I create a new user
  Then I should see message "created successfully"
  Then I should see the User Management page

  When I search for "created" user by email
  And I deactivate "created" user
  Then I should see message "deactivated"

  When I click on Status filter dropdown
  And I select "Active" status filter
  Then all users in the list should have status "Active"

  When I click on Status filter dropdown
  And I select "Inactive" status filter
  Then all users in the list should have status "Inactive"

  When I delete "created" user
  Then I should see message "deleted"
