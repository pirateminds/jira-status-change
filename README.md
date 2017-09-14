<h1 align="center">jira-status-change</h1>

<h5 align="center">The simple way to change Jira issues status robust.</h5>

<br />

# Require
Node v8.4+

## Installation

`npm install -g jira-status-change`

## &#10084; Usage

`jira-status-change --jql='status=\"awaiting\"' --host=jira --username=some --password=password --protocol=https --version=2 --toStatus='send to'`

needs to fill almost all options.

# Notes
Some times it falls with [CAPTCHAs](https://developer.atlassian.com/jiradev/jira-apis/jira-rest-apis/jira-rest-api-tutorials/jira-rest-api-version-2-tutorial#JIRARESTAPIVersion2Tutorial-CAPTCHAs) error. You needs to relogin manually to the site.