Feature: Admin Login Functionality

  @regression @smoke @LOGIN_TC_002 @LOGIN_TC_013
  Scenario: Verify login with valid credentials
    Given I navigate to login page
    When I login as "Admin" role
    Then I should be logged in successfully

  @regression @LOGIN_TC_003
  Scenario Outline: Verify login validations for invalid email and password
    Given I navigate to login page
    When I enter "<usernameType>" username for "Admin"
    And I enter "<passwordType>" password for "Admin"
    And I click on login button
    Then I should see error message "<expectedResult>"

  Examples:
    | usernameType | passwordType | expectedResult                    |
    | valid        | invalid      | Invalid email address or password. |
    | invalid      | valid        | Invalid email address or password. |
    | invalid      | invalid      | Invalid email address or password. |

  @regression @smoke @LOGIN_TC_004
  Scenario Outline: Verify forgot password functionality with registered email
    Given I navigate to login page
    When I click on forgot password link
    Then I should be on forgot password page
    When I enter "valid" username for "Admin"
    Then I click on submit button
    Then I should see reset email sent message

  @regression @LOGIN_TC_005
  Scenario: Verify create account link redirects to signup page
    Given I navigate to login page
    When I click on create account link
    Then I should be on create account page

  @regression @LOGIN_TC_006
  Scenario: Verify create account flow with valid details
    Given I navigate to login page
    When I click on create account link
    Then I should be on create account page
    When I enter generated email for create account
    And I enter "Abcd@1234" password for create account
    And I enter "Abcd@1234" confirm password for create account
    And I accept terms and conditions
    And I click on create now button
    Then I should see verification email sent message
