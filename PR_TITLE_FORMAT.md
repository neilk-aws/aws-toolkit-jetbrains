# PR Title Format Requirement

## Current Issue with PR #2

The current PR title:
```
Add comprehensive README.md documentation for aws-toolkit-jetbrains repository
```

**Does not follow the repository's conventional commit format.**

## Required Format

PR titles in this repository must follow the **Conventional Commit** format:

```
type(scope): subject
```

### Format Components:

- **type**: Must be one of the following:
  - `build` - Changes to build system or dependencies
  - `ci` - Changes to CI/CD configuration
  - `config` - Configuration changes
  - `deps` - Dependency updates
  - `docs` - Documentation changes
  - `feat` - New features
  - `fix` - Bug fixes
  - `perf` - Performance improvements
  - `refactor` - Code refactoring
  - `revert` - Revert previous changes
  - `style` - Code style changes (formatting, etc.)
  - `telemetry` - Telemetry-related changes
  - `test` - Test additions or changes
  - `types` - Type definition changes

- **scope**: (optional but recommended) The area of the codebase affected (e.g., readme, amazonq, workflow)

- **subject**: Brief description of the change in lowercase

## Corrected Title for PR #2

The PR title should be updated to:

```
docs(readme): add comprehensive documentation for aws-toolkit-jetbrains repository
```

### Explanation:
- **type**: `docs` - Because this PR adds documentation
- **scope**: `readme` - Because it specifically adds a README.md file
- **subject**: `add comprehensive documentation for aws-toolkit-jetbrains repository` - Concise description of what was added

## How to Update the PR Title

Since PR titles cannot be updated through git operations, the title must be updated manually through the GitHub web interface:

1. Navigate to the PR: https://github.com/neilk-aws/aws-toolkit-jetbrains/pull/2
2. Click the **Edit** button next to the PR title
3. Update the title to: `docs(readme): add comprehensive documentation for aws-toolkit-jetbrains repository`
4. Save the changes

## Additional Examples

Here are examples from the repository's recent commit history that follow this format:

- `refactor(amazonq): refactor, remove shortAnswer to suit the API changes`
- `fix(inline-completion): potential inline completion failure due to input validation exception`
- `feat(amazonq): support SAS findings`
- `test(qdoc): Add ui tests for qdoc update readme flow`

## Why This Format Matters

Conventional commit format provides:
- **Consistency**: All commits and PRs follow the same structure
- **Automation**: Tools can automatically generate changelogs and determine version bumps
- **Clarity**: The type prefix immediately conveys the nature of the change
- **Organization**: Changes can be easily categorized and filtered

## Reference

For more information about Conventional Commits, see: https://www.conventionalcommits.org/
