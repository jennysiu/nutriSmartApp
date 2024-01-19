# Contributing to this Project

## Naming Conventions

One Word - lowercase.

2+ Words - use the following:

- CSS IDs - camelCase
- CSS Classes - kebab-case
- JS Variables - camelCase
- JS Functions - camelCase
- Filenames - camelCase (other than docs)
- Git Branches - camelCase with the type of branch before eg:
  - feature/createSearchTool
  - docs/editReadme
  - fix/correctErrorInConsole
- Git Commits - lowercase sentence without stop and in the past tense eg
  - "added search button to recipe search form"
  - "edited the readme to include screenshot"

## Code Style

Install Prettier and make the default formatter in your IDE. The config file (.prettierrc) should then format all code consistently on save.

NB: Errors in your code will prevent Prettier working. Keep an eye out for code errors in your IDE console (Prettier shows errors in the "output" tab).

## Git Workflow

Create a new branch and push to origin:

```
git checkout main
git pull origin main
git checkout -b feature/createSearchTool
git add .
git commit -m "added something useful"
git push origin feature/createSearchTool
```

Then create a Pull Request and Slack the team for approval.

## Pull Requests

Pull the proposed branch and **test for errors** to keep the main branch clean.

```
git checkout feature/createSearchTool
```

...if there is a correction to be made that is blocking the merge you can push your commit as normal:

```
git add .
git commit -m "changed something"
git push origin feature/createSearchTool

```

## Useful Git Commands

List local branches

```
git branch
```

List remote branches

```
git branch -r
```

List local and remote branches

```
git branch -a
```
