'use strict';

var angular = require('angular');
var _ = require('lodash');

/**
 * Search and view-as users.
 */
angular.module('calcentral.controllers').controller('UserSearchController', function(adminFactory, adminService, apiService, $scope) {
  $scope.userSearch = {
    title: 'View as',
    tabs: {
      search: {
        label: 'Search',
        queryRunning: false,
        users: []
      },
      saved: {
        label: 'Saved',
        isLoading: false,
        users: []
      },
      recent: {
        label: 'Recent',
        isLoading: false,
        users: []
      }
    }
  };

  var reportError = function(tab, status, errorDescription) {
    tab.error = {
      summary: status === 403 ? 'Access Denied' : 'Unexpected Error',
      description: errorDescription || 'Sorry, there was a problem. Contact CalCentral support if the problem persists.'
    };
  };

  var decorate = function(users) {
    var firstName = 'first_name';
    var lastName = 'last_name';

    angular.forEach(users, function(user) {
      // Normalize user's person name for the UI.
      user.name = user.name || (user[firstName] || '').concat(' ', user[lastName] || '');

      user.actAs = function() {
        adminService.actAs(user);
      };
      user.save = function() {
        adminFactory.storeUser({
          uid: adminService.getLdapUid(user)
        }).success(refreshStoredUsers);
      };
      user.delete = function() {
        return adminFactory.deleteUser({
          uid: adminService.getLdapUid(user)
        }).success(refreshStoredUsers);
      };
    });
    return users;
  };

  var getStoredUsers = function() {
    return adminFactory.getStoredUsers({
      refreshCache: true
    });
  };

  // Synchronize the 'saved' state on the list of searched users.
  var updateSearchedUserSavedStates = function() {
    var searchedUsers = $scope.userSearch.tabs.search.users;
    var savedUsers = $scope.userSearch.tabs.saved.users;
    var ldapUid = 'ldap_uid';

    _(searchedUsers).forEach(function(target) {
      var saved = false;

      _(savedUsers).forEach(function(source) {
        if (target[ldapUid] === source[ldapUid]) {
          saved = true;
          // Exit the loop
          return false;
        }
      });

      target.saved = saved;
    });
  };

  var refreshStoredUsers = function() {
    var tabs = $scope.userSearch.tabs;
    getStoredUsers().success(function(data) {
      angular.forEach([tabs.saved, tabs.recent], function(tab) {
        tab.isLoading = true;
        tab.users = decorate(_.get(data, 'users.' + tab.label.toLowerCase()));
        if (tab.users.length === 0) {
          tab.message = 'No ' + tab.label.toLowerCase() + ' items.';
        } else {
          tab.message = '';
        }
        if (tab === tabs.saved) {
          updateSearchedUserSavedStates();
        }
        tab.isLoading = false;
      });
    }).error(function(data, status) {
      angular.forEach([tabs.saved, tabs.recent], function(tab) {
        reportError(tab, status, data.error);
      });
    });
  };

  $scope.userSearch.byNameOrId = function() {
    $scope.userSearch.tabs.search.error = null;
    $scope.userSearch.tabs.search.message = null;
    $scope.userSearch.tabs.search.queryRunning = true;
    var nameOrId = $scope.userSearch.tabs.search.nameOrId;
    adminFactory.searchUsers(nameOrId).success(function(data) {
      if (!data.users || data.users.length === 0) {
        $scope.userSearch.tabs.search.message = 'Your search on \"' + nameOrId + '\" did not match any users.';
      }
      $scope.userSearch.tabs.search.users = decorate(data.users);
      updateSearchedUserSavedStates();
    }).error(function(data, status) {
      reportError($scope.userSearch.tabs.search, status, data.error);
    }).finally(function() {
      $scope.userSearch.tabs.search.queryRunning = false;
    });
  };

  $scope.userSearch.loadTab = function(tab) {
    $scope.userSearch.selectedTab = tab;
  };

  var init = function() {
    if (apiService.user.profile.roles.advisor) {
      $scope.userSearch.title = 'Student Lookup';
      $scope.userSearch.loadTab($scope.userSearch.tabs.search);
      refreshStoredUsers();
    }
  };

  init();
});