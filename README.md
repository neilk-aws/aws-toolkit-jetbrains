![Build Status](https://codebuild.eu-west-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiekhxeERIMmNLSkNYUktnUFJzUVJucmJqWnFLMGlpNXJiNE1LLzVWV3B1QUpSSkhCS04veHZmUGxZZ0ZmZlRzYjJ3T1VtVEs1b3JxbWNVOHFOeFJDOTAwPSIsIml2UGFyYW1ldGVyU3BlYyI6ImZXNW5KaytDRGNLdjZuZDgiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=main)
[![Coverage](https://img.shields.io/codecov/c/github/aws/aws-toolkit-jetbrains/master.svg)](https://codecov.io/gh/aws/aws-toolkit-jetbrains/branch/master) 
[![Downloads](https://img.shields.io/jetbrains/plugin/d/11349-aws-toolkit.svg)](https://plugins.jetbrains.com/plugin/11349-aws-toolkit) 
[![Version](https://img.shields.io/jetbrains/plugin/v/11349.svg?label=version)](https://plugins.jetbrains.com/plugin/11349-aws-toolkit)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=aws_aws-toolkit-jetbrains&metric=alert_status)](https://sonarcloud.io/dashboard?id=aws_aws-toolkit-jetbrains)
 
# AWS Toolkit for JetBrains

A comprehensive monorepo containing multiple JetBrains IDE plugins for AWS services, including the **AWS Toolkit** and **Amazon Q** (featuring CodeWhisperer, Code Transform, and AI-powered chat capabilities).

## Table of Contents

- [Project Overview](#project-overview)
- [Available Plugins](#available-plugins)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Key Technologies](#key-technologies)
- [Supported IDEs](#supported-ides)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Building from Source](#building-from-source)
  - [Running and Debugging](#running-and-debugging)
- [Testing](#testing)
- [Contributing](#contributing)
- [Feedback and Support](#feedback-and-support)
- [License](#license)

## Project Overview

The AWS Toolkit for JetBrains is an open-source project that provides multiple plugins to enhance your AWS development experience within JetBrains IDEs. This monorepo hosts several discrete plugins that can be installed independently:

- **AWS Toolkit** - Traditional AWS service integrations for resource management, Lambda development, CloudFormation, S3, and more
- **Amazon Q** - AI-powered development assistant with code generation, chat, transformations, and inline suggestions
- **Plugin Core** - Shared functionality and APIs used by other plugins

This project leverages a sophisticated Gradle multi-project build system to emit multiple release artifacts from a single codebase, ensuring code reuse and consistency across plugins while maintaining clear ownership boundaries.

## Available Plugins

### 🔧 AWS Toolkit (`plugin-toolkit`)

**JetBrains Marketplace:** [AWS Toolkit](https://plugins.jetbrains.com/plugin/11349-aws-toolkit)

A comprehensive toolkit for AWS developers providing:

- **AWS Resource Explorer** - Browse and manage AWS resources (Lambda, S3, CloudFormation, CloudWatch Logs, RDS, Redshift, etc.)
- **Authentication** - Connect using static credentials, credential process, AWS Builder ID, or AWS SSO
- **Lambda Development** - Local run/debug, remote invocation, package & deploy
- **SAM Support** - Build and deploy serverless applications (Java, Python, Node.js, .NET Core)
- **CloudFormation** - View stacks, events, resources, and outputs
- **CloudWatch Logs** - View and search log streams
- **Amazon S3** - Bucket management, upload/download operations
- **RDS/Redshift** - Connect to databases using temporary IAM credentials
- **CodeCatalyst** - Access cloud development environments

### 🤖 Amazon Q (`plugin-amazonq`)

**JetBrains Marketplace:** [Amazon Q](https://plugins.jetbrains.com/plugin/24267-amazon-q/)

The most capable generative AI-powered assistant for software development:

#### Agent Capabilities
- **`/dev`** - Implement new features across your entire project
- **`/doc`** - Generate API, technical design, and onboarding documentation
- **`/review`** - Automated code reviews with security analysis
- **`/test`** - Generate unit tests and improve code quality
- **`/transform`** - Upgrade Java applications in minutes

#### Core Features
- **Inline Chat** - Context-aware assistance directly in your editor
- **Chat** - Generate code, get explanations, and development guidance
- **Inline Suggestions** - Real-time code completions from snippets to full functions
- **Code Reference Log** - Attribution for suggestions similar to training data
- **15+ languages supported** - Python, TypeScript, Rust, Terraform, CloudFormation, and more

Components:
- `codewhisperer` - AI code suggestions and inline completions
- `chat` - Conversational AI assistance
- `codetransform` - Code modernization and transformation
- `mynah-ui` - TypeScript/React-based UI components for chat interface

### ⚙️ Plugin Core (`plugin-core`)

Provides foundational functionality shared across all plugins:
- AWS SDK integration and service clients
- Authentication and credential management
- Common UI components and utilities
- Resource management abstractions
- Telemetry and logging infrastructure

## Architecture

This repository follows a modular, multi-project architecture designed to support multiple independent release artifacts from a single monorepo:

```
📦 aws-toolkit-jetbrains
├── 🏗️  buildSrc/                   # Build logic and custom Gradle plugins
├── 🔍 detekt-rules/                # Custom linting rules for code quality
├── 🧪 ui-tests/                    # UI test infrastructure
├── 🔌 plugins/                     # All plugin modules
│   ├── core/                       # Shared core functionality
│   │   ├── jetbrains-community/    # Community edition features
│   │   ├── jetbrains-ultimate/     # Ultimate edition features
│   │   ├── resources/              # Shared resources
│   │   └── sdk-codegen/            # AWS SDK code generation
│   │
│   ├── toolkit/                    # AWS Toolkit plugin
│   │   ├── jetbrains-core/         # Toolkit core functionality
│   │   ├── jetbrains-ultimate/     # Ultimate-specific features
│   │   ├── jetbrains-rider/        # Rider-specific features
│   │   ├── jetbrains-gateway/      # Gateway support (2024.2+)
│   │   └── intellij-standalone/    # Standalone build configuration
│   │
│   └── amazonq/                    # Amazon Q plugin
│       ├── shared/                 # Shared Amazon Q functionality
│       ├── codewhisperer/          # AI code suggestions
│       ├── chat/                   # Conversational AI
│       ├── codetransform/          # Code transformation
│       └── mynah-ui/               # TypeScript UI components
│
└── 🧰 gradle/                      # Gradle wrapper and dependencies

Artifact Outputs:
  └─> plugin-core.zip               # Core APIs (runtime dependency)
  └─> plugin-toolkit.zip            # AWS Toolkit release
  └─> plugin-amazonq.zip            # Amazon Q release
```

### Platform-Specific Sourcesets

The project uses a sophisticated build structure to support multiple IDE editions:

- **`community/`** - Code for Community editions (IntelliJ IDEA Community, PyCharm Community)
- **`ultimate/`** - Code for Ultimate editions (includes community via dependency)
- **`rider/`** - Rider-specific implementations
- **Version-specific sources** - e.g., `src-231-232`, `tst-241+` for IDE version compatibility

For more details, see [REPOLAYOUT.md](REPOLAYOUT.md).

## Repository Structure

### Key Directories

- **`buildSrc/`** - Custom Gradle plugins and build logic for the entire project
- **`detekt-rules/`** - Custom detekt rules for code quality enforcement
- **`plugins/`** - All plugin source code organized by release artifact
- **`ui-tests/`** - UI testing infrastructure using Remote Robot
- **`ui-tests-starter/`** - Test starter utilities (IDE version-specific)
- **`testdata/`** - Test fixtures including sample SAM projects
- **`designs/`** - Architecture and design documentation
- **`buildspec/`** - AWS CodeBuild configuration for CI/CD
- **`gradle/`** - Gradle wrapper and dependency management

### Important Files

- **`build.gradle.kts`** - Root build configuration
- **`settings.gradle.kts`** - Multi-project structure definition
- **`gradle/libs.versions.toml`** - Centralized dependency version management
- **`REPOLAYOUT.md`** - Detailed repository structure documentation
- **`CONTRIBUTING.md`** - Contribution guidelines and development workflow
- **`CHANGELOG.md`** - Release notes and change history
- **`codecov.yml`** - Code coverage configuration

## Key Technologies

### Languages & Frameworks
- **Kotlin 2.0.0** - Primary language (Java discouraged for new code)
- **Java 21** - Runtime requirement
- **TypeScript** - UI components (mynah-ui)
- **.NET 6** - Required for Rider support

### Build System
- **Gradle 8.x** - Multi-project build orchestration
- **Gradle IntelliJ Plugin 2.2.1** - JetBrains platform integration
- **Node.js/npm** - UI component builds (mynah-ui)

### AWS & Core Dependencies
- **AWS SDK for Java 2.26.25** - AWS service clients
- **Kotlin Coroutines 1.8.0** - Asynchronous programming
- **Jackson 2.17.2** - JSON/XML/YAML processing
- **JGit 6.5.0** - Git operations

### Testing & Quality
- **JUnit 5.11.0** - Unit testing framework
- **Mockito 5.12.0** / **MockK 1.13.17** - Mocking
- **AssertJ 3.26.3** - Fluent assertions
- **detekt 1.23.7** - Static code analysis
- **JaCoCo 0.8.12** - Code coverage
- **IntelliJ Remote Robot 0.11.22** - UI testing

### JetBrains Platform
- Compatible with **2023.3+** (currently supporting 2024.1, 2024.2, 2024.3+)
- Platform-specific APIs for Community, Ultimate, Rider, and Gateway editions

## Supported IDEs

All plugins support **JetBrains IDEs 2023.3+**, including:

- ✅ IntelliJ IDEA Community Edition
- ✅ IntelliJ IDEA Ultimate Edition
- ✅ PyCharm Community Edition
- ✅ PyCharm Professional
- ✅ JetBrains Rider (with .NET 6 support)
- ✅ JetBrains Gateway (2024.2+)
- ✅ WebStorm (via ALTERNATIVE_IDE configuration)

Note: Some features (like database connectivity) require paid JetBrains products.

## Getting Started

### Prerequisites

1. **Java 21** - [Amazon Corretto 21](https://docs.aws.amazon.com/corretto/latest/corretto-21-ug/downloads-list.html) recommended
2. **Git** - For source control
3. **.NET 6** - Required for Rider support
   ```bash
   # macOS
   brew install dotnet@6
   
   # After installation, reload Gradle daemon:
   ./gradlew --stop && ./gradlew projects
   ```
4. **Launch IDE from terminal** - Recommended due to Java 21/Gradle PATH issues

### Building from Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/aws/aws-toolkit-jetbrains.git
   cd aws-toolkit-jetbrains
   ```

2. **Build all plugins**
   ```bash
   ./gradlew buildPlugin
   ```

3. **Build specific plugins**
   ```bash
   # AWS Toolkit
   ./gradlew :plugin-toolkit:intellij-standalone:buildPlugin
   
   # Amazon Q
   ./gradlew :plugin-amazonq:buildPlugin
   
   # Plugin Core
   ./gradlew :plugin-core:buildPlugin
   ```

4. **Build for specific IDE version**
   ```bash
   ./gradlew :plugin-toolkit:intellij-standalone:buildPlugin -PideProfileName=2024.1
   ```

5. **Install in your IDE**
   - Navigate to **Plugins → ⚙️ → Install Plugin from Disk...**
   - Select the `.zip` file from `plugins/<plugin-name>/build/distributions/`
   - Restart your IDE

Distribution artifacts will be located at:
- Toolkit: `plugins/toolkit/intellij-standalone/build/distributions/`
- Amazon Q: `plugins/amazonq/build/distributions/`
- Core: `plugins/core/build/distributions/`

### Running and Debugging

#### Using IntelliJ Run Configurations (Recommended)

The repository includes pre-configured run configurations. Simply select and run them from your IDE's Run menu. If debugging, the debugger will auto-attach to the sandbox IDE.

#### Manual Gradle Execution

```bash
# IntelliJ IDEA Community
./gradlew :plugin-toolkit:intellij-standalone:runIde -PrunIdeVariant=IC
./gradlew :plugin-amazonq:runIde -PrunIdeVariant=IC

# IntelliJ IDEA Ultimate
./gradlew :plugin-toolkit:intellij-standalone:runIde -PrunIdeVariant=IU
./gradlew :plugin-amazonq:runIde -PrunIdeVariant=IU

# Rider
./gradlew :plugin-toolkit:intellij-standalone:runIde -PrunIdeVariant=RD
./gradlew :plugin-amazonq:runIde -PrunIdeVariant=RD

# Gateway (2024.2+)
./gradlew :plugin-toolkit:jetbrains-gateway:runIde

# Run all plugins together
./gradlew :sandbox-all:runIde -PrunIdeVariant=IC
```

#### Using Alternative IDE Installation

To test against a specific IDE installation (e.g., PyCharm, WebStorm):

```bash
ALTERNATIVE_IDE=/path/to/ide ./gradlew :plugin-toolkit:intellij-standalone:runIde
```

#### Debugging UI Tests

The sandbox IDE runs with debug port `5005` open. Create a Remote Debug configuration in your IDE to attach to this port.

To make UI tests wait for debugger attachment, modify `suspend.set(false)` to `true` in the `RunIdeForUiTestTask` in `buildSrc/src/main/kotlin/toolkit-intellij-subplugin.gradle.kts`.

### Viewing Logs

Log files are written to:

```
# Toolkit
plugins/toolkit/intellij-standalone/build/idea-sandbox/system/log/idea.log
plugins/toolkit/intellij-standalone/build/idea-sandbox/system-test/logs/idea.log  # Tests

# Gateway
plugins/toolkit/jetbrains-gateway/build/idea-sandbox/system/logs/idea.log
```

**Enable DEBUG logging:**
1. In the sandbox IDE, go to **Help → Debug Log Settings**
2. Add the line: `software.aws.toolkits`
3. ⚠️ **Warning:** Debug logs may contain sensitive information

## Testing

### Unit Tests & Code Quality

Safe for all contributors to run:

```bash
./gradlew check
```

This runs:
- Unit tests (no network calls)
- detekt static analysis
- Code style checks
- JaCoCo coverage reports

### Integration Tests

⚠️ **Not recommended for third-party contributors** - creates/mutates real AWS resources

Requirements:
- Valid AWS credentials
- AWS SAM CLI on `$PATH`

```bash
./gradlew integrationTest
```

### UI Tests

⚠️ **Not recommended for third-party contributors** - creates/mutates real AWS resources

Requirements:
- Valid AWS credentials
- AWS SAM CLI on `$PATH`

```bash
./gradlew :ui-tests:uiTestCore
```

### Running Specific Tests

```bash
# Specific test class
./gradlew :plugin-core:test --tests "com.example.MyTest"

# Pattern matching
./gradlew :plugin-toolkit:intellij-standalone:test --tests "*Lambda*"

# With IDE version
./gradlew :plugin-core:test -PideProfileName=2024.1
```

## Contributing

We welcome contributions! This project is open source because we want community involvement.

### Ways to Contribute

- 👍 Vote on [feature requests](https://github.com/aws/aws-toolkit-jetbrains/issues?q=is%3Aissue+is%3Aopen+label%3Afeature-request+sort%3Areactions-%2B1-desc) (helps prioritization!)
- 💡 [Request a new feature](https://github.com/aws/aws-toolkit-jetbrains/issues/new?labels=feature-request&template=feature_request.md)
- ❓ [Ask a question](https://github.com/aws/aws-toolkit-jetbrains/issues/new?labels=guidance&template=guidance_request.md)
- 🐛 [File an issue](https://github.com/aws/aws-toolkit-jetbrains/issues/new?labels=bug&template=bug_report.md)
- 💻 Submit pull requests

### Contribution Workflow

1. **Check existing issues** - Search [open](https://github.com/aws/aws-toolkit-jetbrains/issues) and [recently closed](https://github.com/aws/aws-toolkit-jetbrains/issues?q=is%3Aissue+is%3Aclosed) issues
2. **Fork the repository** and work against the `main` branch
3. **Make your changes** - All changes require automated tests
4. **Run tests locally**
   ```bash
   ./gradlew check
   ```
5. **Generate changelog entry** (if user-visible change)
   ```bash
   ./gradlew :newChange --console plain
   ```
6. **Submit a pull request** using the PR template
7. **Stay engaged** - Respond to feedback and CI failures

### Development Guidelines

- **Kotlin First** - All new code should be written in Kotlin (Java is discouraged)
- **Follow Conventions** - Adhere to [Kotlin coding conventions](https://kotlinlang.org/docs/coding-conventions.html)
- **No Dependencies on Tools** - AWS Explorer should work without installing SAM CLI or other tools
- **Lazy Installation** - Dependencies should fetch/install when users interact with features requiring them
- **Tests Required** - All changes must include automated tests

For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

### Finding Work

Looking for something to contribute? Check out issues labeled [`help wanted`](https://github.com/aws/aws-toolkit-jetbrains/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22).

## Feedback and Support

We want your feedback!

- 🐛 **Bug Reports** - [File a bug](https://github.com/aws/aws-toolkit-jetbrains/issues/new?labels=bug&template=bug_report.md)
- 💡 **Feature Requests** - [Request a feature](https://github.com/aws/aws-toolkit-jetbrains/issues/new?labels=feature-request&template=feature_request.md)
- 💬 **Questions** - [Ask for guidance](https://github.com/aws/aws-toolkit-jetbrains/issues/new?labels=guidance&template=guidance_request.md)
- 📖 **Documentation** - [AWS Toolkit User Guide](https://docs.aws.amazon.com/console/toolkit-for-jetbrains/)
- 🔒 **Security Issues** - See [CONTRIBUTING.md](CONTRIBUTING.md) for security reporting

## Installation

### From JetBrains Marketplace

- **AWS Toolkit**: [Install from Marketplace](https://plugins.jetbrains.com/plugin/11349-aws-toolkit)
- **Amazon Q**: [Install from Marketplace](https://plugins.jetbrains.com/plugin/24267-amazon-q/)

Or within your IDE: **Plugins → Marketplace → Search "AWS Toolkit" or "Amazon Q"**

### EAP (Early Access Preview) Builds

Get automatic cutting-edge builds:

1. Go to **Plugins → ⚙️ → Manage Plugin Repositories**
2. Add: `https://plugins.jetbrains.com/plugins/eap/aws.toolkit`
3. Check for updates

### Prerequisites for Full Functionality

- **AWS Account** - Required for AWS service access
- **AWS Credentials** - IAM user with access keys, AWS Builder ID, or AWS SSO
- **AWS SAM CLI** - Required for Lambda local run/debug ([Installation Guide](https://github.com/awslabs/aws-sam-cli))
- **Docker** - Required for local Lambda execution
- **AWS CLI** - Optional but recommended

See the [Installation Guide](https://docs.aws.amazon.com/console/toolkit-for-jetbrains/install) for detailed setup instructions.

## Additional Resources

- 📚 [JetBrains Plugin Development Guide](https://plugins.jetbrains.com/docs/intellij/welcome.html)
- 🎨 [IntelliJ Design Guidelines](https://jetbrains.design/intellij/)
- 🏍️ [Rider SDK Documentation](https://www.jetbrains.com/help/resharper/sdk/Rider.html)
- 🔧 [Kotlin Standard Library](https://plugins.jetbrains.com/docs/intellij/kotlin.html#kotlin-standard-library)
- 📁 [IDE Directories and Files](https://intellij-support.jetbrains.com/hc/en-us/articles/206544519)

## Code of Conduct

This project has adopted the [Amazon Open Source Code of Conduct](https://aws.github.io/code-of-conduct). For more information, see the [Code of Conduct FAQ](https://aws.github.io/code-of-conduct-faq) or contact [opensource-codeofconduct@amazon.com](mailto:opensource-codeofconduct@amazon.com).

## License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for full details.

---

<p align="center">
  <i>Built with ❤️ by the AWS Developer Tools team and contributors</i>
</p>
