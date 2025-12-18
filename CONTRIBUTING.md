# Contributing to AWS Toolkit for JetBrains

Thank you for your interest in contributing to the AWS Toolkit for JetBrains! Whether it's a bug report, new feature, 
correction, or additional documentation, we greatly value feedback and contributions from our community.

Please read through this document before submitting any issues or pull requests to ensure we have all the necessary 
information to effectively respond to your bug report or contribution.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Reporting Bugs/Feature Requests](#reporting-bugsfeature-requests)
- [Building From Source](#building-from-source)
- [Contributing via Pull Requests](#contributing-via-pull-requests)
- [Code Style and Standards](#code-style-and-standards)
- [Testing Requirements](#testing-requirements)
- [Debugging/Running Locally](#debuggingrunning-locally)
- [Running Tests](#running-tests)
- [Communication and Community](#communication-and-community)
- [Review Process](#review-process)
- [Additional Resources](#additional-resources)
- [Code of Conduct](#code-of-conduct)
- [Licensing](#licensing)

## Getting Started

Welcome to the AWS Toolkit for JetBrains community! This toolkit provides AWS integration for JetBrains IDEs 
including IntelliJ IDEA, PyCharm, WebStorm, Rider, and more.

### Find Things to Work On

Looking at the existing issues is a great way to find something to contribute on:

- [Good First Issues](https://github.com/aws/aws-toolkit-jetbrains/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) - Great for newcomers
- [Help Wanted](https://github.com/aws/aws-toolkit-jetbrains/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) - Issues where we'd especially appreciate community contributions
- [Bug Reports](https://github.com/aws/aws-toolkit-jetbrains/issues?q=is%3Aissue+is%3Aopen+label%3Abug) - Help us fix issues

Before starting work on a significant change, please open an issue to discuss your approach. This helps avoid 
duplicate work and ensures your contribution aligns with the project's direction.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Git**: Version control system
- **Java 21**: [Download Amazon Corretto 21](https://docs.aws.amazon.com/corretto/latest/corretto-21-ug/downloads-list.html)
- **.NET 6**: Required for Rider plugin development
  - macOS: `brew install dotnet@6`
  - Note: If Gradle cannot find `dotnet`, run `./gradlew --stop` and `./gradlew projects` to reload the daemon
- **JetBrains IDE**: IntelliJ IDEA (recommended for development)

**Important**: It is recommended to [launch your IDE from the terminal](https://www.jetbrains.com/help/idea/working-with-the-ide-features-from-command-line.html) 
due to a known issue with Gradle/Java 21 where the Gradle daemon does not respect your PATH variable when the IDE 
is started from the desktop/Toolbox.

## Development Setup

### 1. Fork and Clone the Repository

```bash
# Fork the repository on GitHub, then clone your fork
git clone git@github.com:YOUR-USERNAME/aws-toolkit-jetbrains.git
cd aws-toolkit-jetbrains

# Add upstream remote to keep your fork in sync
git remote add upstream git@github.com:aws/aws-toolkit-jetbrains.git
```

### 2. Open the Project

1. Launch IntelliJ IDEA from your terminal (recommended)
2. Open the cloned repository folder
3. Wait for Gradle to sync the project
4. The IDE should automatically detect the project structure

### 3. Verify Your Setup

```bash
# Test that the build system works
./gradlew projects

# Run a basic build
./gradlew check
```

### Project Structure

The repository follows a multi-module Gradle structure:

- `plugins/toolkit/` - Main AWS Toolkit plugin code
- `plugins/amazonq/` - Amazon Q integration
- `plugins/core/` - Shared core functionality
- `buildSrc/` - Custom Gradle plugins and build logic
- `ui-tests/` - UI automation tests
- `testdata/` - Test fixtures and sample projects

See [REPOLAYOUT.md](REPOLAYOUT.md) for detailed information about the repository structure.

## Reporting Bugs/Feature Requests

We welcome you to use the GitHub issue tracker to report bugs or suggest features.

When filing an issue, please check [existing open](https://github.com/aws/aws-toolkit-jetbrains/issues), or 
[recently closed](https://github.com/aws/aws-toolkit-jetbrains/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aclosed%20), 
issues to make sure somebody else hasn't already reported the issue. 

### Bug Reports

Please include as much information as possible:

* **Clear Title**: A concise description of the issue
* **Reproducible Steps**: Detailed steps to reproduce the behavior
* **Expected Behavior**: What you expected to happen
* **Actual Behavior**: What actually happened
* **Version Information**:
  - Plugin version (Help → About → Copy version info)
  - JetBrains IDE and version
  - Operating system and version
* **Environment Details**:
  - Recently installed plugins
  - Any unusual configuration
* **Logs**: Include relevant logs from `idea.log` (Help → Show Log in Finder/Explorer)
* **Screenshots**: If applicable, add screenshots to help explain the problem

### Feature Requests

For feature requests, please include:

* **Problem Statement**: What problem does this feature solve?
* **Proposed Solution**: How would you like this feature to work?
* **Alternatives Considered**: What other approaches have you thought about?
* **Use Case**: Real-world scenario where this would be helpful

## Building From Source

### Requirements

* [Java 21](https://docs.aws.amazon.com/corretto/latest/corretto-21-ug/downloads-list.html)
* [Git](https://git-scm.com/)
* .NET 6
  * In theory, you can use a higher version, however we build with .NET 6 in CI
  * macOS steps:
    ```
    brew install dotnet@6
    ```
  * If Gradle cannot find `dotnet`, run `./gradlew --stop` and `./gradlew projects` to reload the daemon. Note that this should be done in your terminal as invoking Gradle through the IDE will use the IDE's cached PATH.

### Instructions

1. Clone the github repository:
   ```bash
   git clone git@github.com:aws/aws-toolkit-jetbrains.git
   cd aws-toolkit-jetbrains
   ```

2. To manually build a plugin distribution, run the global task, `./gradlew buildPlugin` to build all plugins, or on specific subproject if you want a specific plugin:
   ```bash
   # Build a specific plugin
   ./gradlew :plugin-toolkit:intellij-standalone:buildPlugin
   
   # This produces a plugin zip under:
   # plugins/toolkit/intellij-standalone/build/distributions
   ```
   
   You can also run the `:plugin-core:buildPlugin` and `:plugin-amazonq:buildPlugin` tasks.
   
   Use the `-PideProfileName={JETBRAINS_VERSION}` option to build the plugin for a particular IDE version:
   ```bash
   ./gradlew :plugin-toolkit:intellij-standalone:buildPlugin -PideProfileName=2024.1
   ```

3. In your JetBrains IDE (e.g. IntelliJ) navigate to the `Plugins` preferences and select "Install Plugin from Disk...", navigate to the zip file(s) produced in step 2.

4. You will be prompted to restart your IDE.

## Contributing via Pull Requests

Contributions via pull requests are much appreciated. Before sending us a pull request, please ensure that:

1. You are working against the latest source on the *main* branch.
2. You check existing open, and recently merged, pull requests to make sure someone else hasn't addressed the problem already.
3. You open an issue to discuss any significant work - we would hate for your time to be wasted.

### Pull Request Process

To send us a pull request, please:

1. **Fork the repository**
   ```bash
   # Click 'Fork' on GitHub, then clone your fork
   git clone git@github.com:YOUR-USERNAME/aws-toolkit-jetbrains.git
   cd aws-toolkit-jetbrains
   ```

2. **Create a branch for your changes**
   ```bash
   git checkout -b feature/my-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Modify the source**
   - Focus on the specific change you are contributing
   - **All changes must have associated automated tests**
   - Follow our [code style guidelines](#code-style-and-standards)

4. **Ensure local tests pass**
   ```bash
   ./gradlew check
   ```

5. **Generate a changelog entry** (if the change is visible to users)
   ```bash
   ./gradlew :newChange --console plain
   ```
   Follow the prompts. Changelog entries should:
   - Describe the change succinctly
   - Use Git-Flavored Markdown ([GFM](https://github.github.com/gfm/))
   - Reference the GitHub Issue # if relevant

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "type(scope): description of changes"
   ```
   - Use clear, descriptive commit messages
   - Reference issue numbers when relevant
   - See [commit message guidelines](#commit-messages)

7. **Push to your fork**
   ```bash
   git push origin feature/my-feature-name
   ```

8. **Create a pull request**
   - Complete the pull request template
   - Link to any related issues
   - Provide clear description of changes
   - Include screenshots/GIFs for UI changes

9. **Respond to feedback**
   - Pay attention to automated build failures
   - Stay involved in the conversation
   - Address reviewer comments promptly

### Commit Messages

Follow these guidelines for commit messages:

- **Format**: `type(scope): subject`
  - **type**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
  - **scope**: The area of code affected (e.g., `s3`, `lambda`, `ui`)
  - **subject**: Brief description in imperative mood
- **Example**: `fix(lambda): resolve timeout issue with large deployments`
- **Body** (optional): More detailed explanation if needed

## Code Style and Standards

### Kotlin Guidelines

We follow the [Kotlin Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html) with some project-specific additions:

- **Line Length**: Maximum 140 characters
- **Indentation**: 4 spaces (no tabs)
- **Naming Conventions**:
  - Classes: `PascalCase`
  - Functions/Variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Private members: prefix with underscore when needed for clarity

### Code Quality

- **Use meaningful names**: Variables and functions should clearly indicate their purpose
- **Keep functions small**: Each function should do one thing well
- **Add documentation**: Use KDoc for public APIs
- **Avoid magic numbers**: Use named constants
- **Handle errors properly**: Don't swallow exceptions

### Static Analysis

We use several tools to maintain code quality:

- **detekt**: Kotlin static analysis
  ```bash
  ./gradlew detekt
  ```
- **ktlint**: Kotlin linter
- **checkstyle**: Additional code style checks

These run automatically as part of `./gradlew check`.

### IntelliJ IDEA Plugin Guidelines

Follow JetBrains' guidelines for plugin development:

- [IntelliJ Platform SDK](https://plugins.jetbrains.com/docs/intellij/welcome.html)
- [Kotlin for Plugin Developers](https://plugins.jetbrains.com/docs/intellij/kotlin.html)
- [UI Guidelines](https://jetbrains.design/intellij/)

### Project-Specific Guidelines

- **AWS Explorer**: Should not have dependencies (such as `sam` or `cloud-debug`). It should work without needing to install extra stuff.
- **Tool Dependencies**: Dependencies (such as `sam` or `cloud-debug`) should fetch/install lazily, when the user interacts with a feature that requires them.
- **Threading**: Use IntelliJ's threading model properly (EDT vs background threads)
- **Resource Management**: Always dispose resources properly, use `Disposable` pattern

## Testing Requirements

All code changes must include appropriate tests. We use JUnit 5 and various mocking frameworks.

### Test Categories

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test interactions between components
3. **UI Tests**: Test user interface interactions

### Writing Tests

```kotlin
class MyServiceTest {
    @Test
    fun `test should describe what it tests`() {
        // Given
        val input = "test"
        
        // When
        val result = myService.process(input)
        
        // Then
        assertThat(result).isEqualTo("expected")
    }
}
```

### Test Guidelines

- **Test names**: Use descriptive names or backtick syntax for readability
- **AAA Pattern**: Arrange, Act, Assert
- **One assertion per test**: Keeps tests focused
- **Mock external dependencies**: Use MockK or similar
- **Test edge cases**: Don't just test the happy path

## Debugging/Running Locally

To test your changes locally, you can run the project from IntelliJ or Gradle using the `runIde` tasks. Each build will download the required IDE version and start it in a sandbox (isolated) configuration.

### In IDE Approach (Recommended)

Launch the IDE through your IntelliJ instance using the provided run configurations. 
If ran using the Debug feature, a debugger will be auto-attached to the sandbox IDE.

### Running Manually

```bash
# IntelliJ IDEA Community
./gradlew :plugin-toolkit:intellij-standalone:runIde -PrunIdeVariant=IC
./gradlew :plugin-amazonq:runIde -PrunIdeVariant=IC
./gradlew :sandbox-all:runIde -PrunIdeVariant=IC

# IntelliJ IDEA Ultimate
./gradlew :plugin-toolkit:intellij-standalone:runIde -PrunIdeVariant=IU
./gradlew :plugin-amazonq:runIde -PrunIdeVariant=IU
./gradlew :sandbox-all:runIde -PrunIdeVariant=IU

# Rider
./gradlew :plugin-toolkit:intellij-standalone:runIde -PrunIdeVariant=RD
./gradlew :plugin-amazonq:runIde -PrunIdeVariant=RD
./gradlew :sandbox-all:runIde -PrunIdeVariant=RD

# Gateway
./gradlew :plugin-toolkit:jetbrains-gateway:runIde
```

These targets download the required IDE for testing.

### Alternative IDE

To run the plugin in a **specific JetBrains IDE** (and you have it installed), specify the `ALTERNATIVE_IDE` environment variable:

```bash
ALTERNATIVE_IDE=/path/to/ide ./gradlew :plugin-toolkit:intellij-standalone:runIde
```

This is needed to run PyCharm and WebStorm. See also `alternativeIdePath` option in the `runIde` tasks provided by the Gradle IntelliJ Plugin [documentation](https://github.com/JetBrains/gradle-intellij-plugin).

## Running Tests

### Unit Tests / Checkstyle

These tests make no network calls and are safe for anyone to run.

```bash
./gradlew check
```

### Integration Tests

It is **NOT** recommended for third party contributors to run these due to they create and mutate AWS resources.

- Requires valid AWS credentials (take care: it will respect any credentials currently defined in your environmental variables, and fallback to your default AWS profile otherwise).
- Requires `sam` CLI to be on your `$PATH`.

```bash
./gradlew integrationTest
```

### UI Tests

It is **NOT** recommended for third party contributors to run these due to they create and mutate AWS resources.

- Requires valid AWS credentials
- Requires `sam` CLI to be on your `$PATH`.

```bash
./gradlew :ui-tests:uiTestCore
```

#### Debug GUI Tests

The sandbox IDE runs with a debug port open (`5005`). In your main IDE, create a Java Remote Debug run configuration and tell it to attach to that port.

If the tests run too quickly, you can tell the UI tests to wait for the debugger to attach by editing the `suspend.set(false)` to `true` in the tasks `RunIdeForUiTestTask` in [toolkit-intellij-subplugin Gradle plugin](buildSrc/src/main/kotlin/toolkit-intellij-subplugin.gradle.kts)

### Logging

Log messages (`LOG.info`, `LOG.error()`, …) by default are written to:

```
plugins/toolkit/intellij/build/idea-sandbox/system/log/idea.log
plugins/toolkit/intellij/build/idea-sandbox/system-test/logs/idea.log  # Tests
plugins/toolkit/jetbrains-gateway/build/idea-sandbox/system/logs/idea.log  # Gateway
```

DEBUG-level log messages are skipped by default. To enable them, add the following line to the _Help_ > _Debug Log Settings_ dialog in the IDE instance started by the `runIde` task:

```
software.aws.toolkits
```

**Please be aware that debug level logs may contain more sensitive information. It is not advisable to keep it on nor share log files that contain debug logs**

## Communication and Community

### How to Get Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussions
- **Pull Request Comments**: For feedback on specific changes

### Community Guidelines

- **Be Respectful**: Treat all community members with respect
- **Be Patient**: Maintainers are often volunteers with limited time
- **Be Clear**: Provide clear, detailed information in issues and PRs
- **Be Collaborative**: Work together to find the best solutions
- **Give Credit**: Acknowledge others' contributions and ideas

### Response Times

- We aim to respond to issues and PRs within a few business days
- Complex changes may require more time for thorough review
- If you haven't heard back in a week, feel free to politely ping the thread

## Review Process

### What to Expect

1. **Automated Checks**: CI will run tests and code quality checks
2. **Initial Review**: A maintainer will review your PR for overall approach
3. **Detailed Review**: Code will be reviewed for correctness, style, and best practices
4. **Iterations**: You may need to make changes based on feedback
5. **Approval**: Once approved, a maintainer will merge your PR

### Review Criteria

Reviewers will consider:

- **Functionality**: Does it work as intended?
- **Tests**: Are there adequate tests?
- **Code Quality**: Is the code clean, maintainable, and well-documented?
- **Performance**: Are there any performance concerns?
- **Security**: Are there any security implications?
- **Compatibility**: Does it work across supported IDE versions?
- **UX**: For UI changes, is the user experience good?

### Tips for Faster Reviews

- **Keep PRs Small**: Smaller PRs are easier to review
- **Write Good Descriptions**: Explain what and why, not just how
- **Add Screenshots**: For UI changes, include before/after screenshots
- **Respond Promptly**: Address feedback quickly
- **Test Thoroughly**: Ensure all tests pass before requesting review

## Additional References

* [IntelliJ Platform SDK Documentation](https://plugins.jetbrains.com/docs/intellij/welcome.html)
* [Kotlin Standard Library for IntelliJ](https://plugins.jetbrains.com/docs/intellij/kotlin.html#kotlin-standard-library)
* [IntelliJ UI Guidelines](https://jetbrains.design/intellij/)
* [Rider SDK Documentation](https://www.jetbrains.com/help/resharper/sdk/Rider.html)
* [IDE Directories Reference](https://intellij-support.jetbrains.com/hc/en-us/articles/206544519-Directories-used-by-the-IDE-to-store-settings-caches-plugins-and-logs)

## Code of Conduct

This project has adopted the [Amazon Open Source Code of Conduct](https://aws.github.io/code-of-conduct). 
For more information see the [Code of Conduct FAQ](https://aws.github.io/code-of-conduct-faq) or contact 
[opensource-codeofconduct@amazon.com](mailto:opensource-codeofconduct@amazon.com) with any additional questions or comments.

## Licensing

See the [LICENSE](LICENSE) file for our project's licensing. We will ask you to confirm the licensing of your contribution.

We may ask you to sign a [Contributor License Agreement (CLA)](http://en.wikipedia.org/wiki/Contributor_License_Agreement) for larger changes.
