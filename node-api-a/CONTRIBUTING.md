L'api micro finance  respecte quelques règles avant de s'engager. Si vous êtes dans l'entreprise, vous devez respecter ces règles. Si vous êtes un contributeur généreux, vous êtes encouragé à suivre ces règles, mais toute aide est acceptée..



- [Coding Rules](#rules)
- [Commit Message Guidelines](#commit)


##  <a name="rules"></a> Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

- Code should compile
- Respect rule of the Linter
- Test should pass
- Code must be consistent with the rest of the code of the repository (big refactoring must be in a specific commit)
- Code should be reviewed by someone from Jahia

## <a name="commit"></a> Commit Message Guidelines

Jahia rely a lot on Jira for development process.

### Commit Message Format

Each commit message consists of a header and a body. The header has a special format that includes a *TaskID* and a *subject*:

```
<TaskID>: <subject>
<BLANK LINE>
<body>
```

Only the *header* is mandatory.

The *TaskID* is the task from Jira, for example **BACKLOG-10153** or **QA-11717**.

The *subject* contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end


#### Samples

```
BACKLOG-10153: handle simple click in image picker
```

or with more details:

```
BACKLOG-10153: handle simple click in image picker

Handle simple click meant to add the selectable variant to Card in the design system
```