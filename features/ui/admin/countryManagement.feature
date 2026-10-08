# Feature: Country Management Functionality

# Background:
#   Given I navigate to login page
#   When I login as "Admin" role
#   Then I should be logged in successfully

# @regression @smoke @CM_TC_003 @CM_TC_005 @CM_TC_006
# Scenario: Verify successful creation and deletion of new country

#   Given the sidebar is loaded
#   When I click on Country Management in sidebar
#   Then I should see the Country Management page

#   When I click on Add Country button
#   Then I should see the Add Country page

#   And I create a new country
#   Then I should see message "created successfully"
#   Then I should see the Country Management page

#   When I search for "created" country by title
#   Then I should see "created" country in the list

#   When I delete "created" country
#   Then I should see message "deleted"

#   When I search for "created" country by title
#   Then I should not see "created" country in the list

# @regression @smoke @CM_TC_004
# Scenario: Verify editing existing country details

#   Given the sidebar is loaded
#   When I click on Country Management in sidebar
#   Then I should see the Country Management page

#   When I click on Add Country button
#   Then I should see the Add Country page

#   And I create a new country
#   Then I should see message "created successfully"
#   Then I should see the Country Management page

#   When I search for "created" country by title
#   Then I should see "created" country in the list

#   When I click edit for "created" country
#   Then I should see the Edit Country page

#   When I update the country
#   Then I should see message "updated successfully"
#   Then I should see the Country Management page

#   When I search for "updated" country by title
#   And I should see "updated" country in the list
#   Then I should see the updated title in the country list

#   When I delete "updated" country
#   Then I should see message "deleted"

# @regression @smoke @CM_TC_007
# Scenario: Verify validation messages for invalid country details during country creation (Blank fields)

#   Given the sidebar is loaded
#   When I click on Country Management in sidebar
#   Then I should see the Country Management page

#   When I click on Add Country button
#   Then I should see the Add Country page

#   When I click Save Country button
#   Then I should see the add country validation messages
#       | Title is required |
#       | Slug is required  |


# @regression @smoke @CM_TC_007
# Scenario: Verify duplicate slug validation during country creation

#   Given the sidebar is loaded
#   When I click on Country Management in sidebar
#   Then I should see the Country Management page

#   When I click on Add Country button
#   Then I should see the Add Country page

#   When I fill the country form with existing country
#   And I click Save Country button
#   Then I should see message "already exists"

# @regression @smoke @CM_TC_007
# Scenario: Verify validation messages for invalid country details during country creation (Invalid data)

#   Given the sidebar is loaded
#   When I click on Country Management in sidebar
#   Then I should see the Country Management page

#   When I click on Add Country button
#   Then I should see the Add Country page

#   When I fill the country form with invalid country data
#   And I click Save Country button
#   Then I should see the add country validation messages
#       | Title must be at most 120 characters |
#       | Slug may only contain lowercase letters, digits and hyphens |
#       | ISO numeric code must be at most 10 characters |
#       | Administrative division ID must be at most 80 characters |
