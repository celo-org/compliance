# Contributing

Thank you for your interest in improving `@celo/compliance`.

If you want to contribute, but aren't sure where to start, you can create a
[new discussion](https://github.com/celo-org/compliance/discussions).

There are multiple opportunities to contribute. It doesn't matter if you are just
getting started or are an expert. We appreciate your interest in contributing.

> **IMPORTANT**
> Please ask before starting work on any significant new features.
>
> It's never a fun experience to have your pull request declined after investing time and effort
> into a new feature. To avoid this from happening, we invite contributors to create a
> [new discussion](https://github.com/celo-org/compliance/discussions) to discuss API changes or
> significant new ideas.

## Basic guide

This guide is intended to help you get started with contributing. By following these steps,
you will understand the development process and workflow.

### Cloning the repository

To start contributing to the project, clone it to your local machine using git:

```sh
$ git clone https://github.com/celo-org/compliance.git
```

Navigate to the project's root directory:

```sh
$ cd compliance
```

### Installing Node.js

We use [Node.js](https://nodejs.org/en/) to run the project locally.

### Installing dependencies

Once in the project's root directory, run the following command to install the project's 
dependencies:

```sh
$ yarn install
```

After installing the dependencies, the project is ready to be run. 

### Navigating the repository

The project is mostly based on Github Actions implemented in the 
[`.github/workflows`](./.github/workflows) directory.

### Running packages

Once you navigated to the project directory you want to run, inspect the `package.json` file
and look for the `scripts` section. It contains the list of available scripts that can be run.

### Versioning

The package is automatically versioned by the CI/CD pipeline. The version is typically 
a patch version if changes are made to the OFAC addresses, but it can be a minor or major version 
if we make changes to the API or the package structure.

### Running the test suite 

We don't have a test suite for this package yet, but you can inspect the scripts in 
[`./scripts`](./scripts/), which are designed to manually check OFAC addresses.

When you open a Pull Request, the GitHub CI will run any available test suites for you, but 
you can also add and run tests locally.

> **INFO**
> Some tests are run automatically when you open a Pull Request, while others are run when a 
> maintainer approves the Pull Request. This is for security reasons, as some tests require access 
> to secrets.

### Open a Pull Request

✅ Now you're ready to contribute!
