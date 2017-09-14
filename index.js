#! /usr/bin/env node

const request = require('request');
const JiraApi = require('jira-client');
const commandLineArgs = require('command-line-args');
const processArray = require('./progress').processArray;

const optionDefinitions = [
    { name: 'jql', alias: 'j', type: String, defaultValue: 'status="awaiting"' },
    { name: 'host', alias: 'h', type: String, defaultValue: 'jira.atlassian.com' },
    { name: 'username', alias: 'u', type: String, defaultValue: 'some-user-name' },
    { name: 'password', alias: 'p', type: String, defaultValue: 'some-password' },
    { name: 'protocol', alias: 't', type: String, defaultValue: 'https' },
    { name: 'version', alias: 'v', type: String, defaultValue: '2' },
    { name: 'toStatus', alias: 's', type: String, defaultValue: 'send to'}
];

const options = commandLineArgs(optionDefinitions);;
console.log(options);

var jira = new JiraApi({
    protocol: options.protocol,
    host: options.host,
    username: options.username,
    password: options.password,
    apiVersion: options.version,
    strictSSL: true
});

async function processIssue(issue) {
    let resp = await jira.listTransitions(issue.id);
    let sendToQA = resp.transitions.find(e=> e.name.toLowerCase() === options.toStatus);
    if (sendToQA)
        await jira.transitionIssue(issue.id, { 
            "transition": {
                "id": sendToQA.id
            } 
        });
}

async function getJiraIssues(){
    let response = await jira.searchJira(options.jql);
    let issues = response.issues;

    while (response.issues.length < response.total) {
        response = await jira.searchJira(options.jql, {startAt: issues.length});
        issues = issues.concat(response.issues);
    }

    return issues;
}

function updateJiraPojects(issues) {
    return processArray(issues, processIssue);
}

async function searchJira() {
    let issues = await getJiraIssues();
    await updateJiraPojects(issues || []);
} 

searchJira().then(()=> {
    console.log('done');
}).catch(err=> {
    console.log(err && err.message);
})